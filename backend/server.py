#!/usr/bin/env python3
import os
import traceback
from time import sleep
import uuid
from db import Database
from utils.sanitizers import Sanitizer
from flask import Flask, jsonify, request, make_response, send_from_directory
from flask_restful import Resource, Api, reqparse
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from werkzeug.utils import secure_filename
from dotenv import load_dotenv
from flask_jwt_extended import (
    JWTManager, create_access_token, jwt_required, get_jwt_identity, set_access_cookies, get_csrf_token, unset_jwt_cookies
)
from datetime import timedelta, datetime
from pprint import pprint
from utils.utils import *
from collections import defaultdict
#from flask_limiter import Limiter
#from flask_limiter.util import get_remote_address

# ======= Initialize app and extensions =========
load_dotenv()
app = Flask(__name__)
api = Api(app)
app.app_context()
#CORS(app)
#CORS(app, supports_credentials=True, resources={r"/api/*": {"origins": "*"}})
CORS(app, supports_credentials=True, resources={r"/api/*": {"origins": ["http://localhost:5173", "http://127.0.0.1:5173", "http://192.168.1.31:5173", os.getenv('CLIENT_URL')]}})
bcrypt = Bcrypt(app)
db = Database()
s = Sanitizer()


# ======= App Config ==============

app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
app.config['JWT_TOKEN_LOCATION'] = ['cookies']
app.config['JWT_COOKIE_SECURE'] = False  # True in production (HTTPS)
app.config['JWT_COOKIE_CSRF_PROTECT'] = False  # Enable if using CSRF protection
app.config['JWT_ACCESS_COOKIE_PATH'] = '/api'  # Scoped path
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=1)
app.config['JWT_ACCESS_COOKIE_NAME'] = 'access_token'
app.config["JWT_COOKIE_SAMESITE"] = "Lax"  # 'Lax' in Dev, 'None' with Ngrok Or 'Strict' in prod (if not !same-origin)
#app.config["JWT_ACCESS_CSRF_HEADER_NAME"] = "X-CSRF-TOKEN"
jwt = JWTManager(app)
#limiter = Limiter(get_remote_address, app=app) #TO BE ACTIVATED WHEN READY FOR PRODUCTION

# ======= GLOBAL VARIABLES ==============
SLEEP = 1
UPLOAD_FOLDER_NAME = 'server/uploads'
UPLOAD_BASE = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', UPLOAD_FOLDER_NAME))
#UPLOAD_BASE = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'server', 'uploads'))

# ======= JWT CONFIGS ==============
@jwt.expired_token_loader
def expired_token_callback(jwt_header, jwt_payload):
    return jsonify({ "error": True, "message": "Your session has expired. Please log in again." }), 401

@jwt.invalid_token_loader
def invalid_token_callback(error):
    return jsonify({"error": True, "message": "Invalid token."}), 422

@jwt.unauthorized_loader
def missing_token_callback(error):
    return jsonify({"error": True, "message": "Authorization token is missing."}), 200

@jwt.revoked_token_loader
def revoked_token_callback(jwt_header, jwt_payload):
    return jsonify({"error": True, "message": "Token has been revoked."}), 401


# ===== Shared Base Resource =====
class SerializableResource(Resource):
    @staticmethod
    def serialize_row(row):
        return {
            k: (v.isoformat() if isinstance(v, datetime) else v)
            for k, v in row.items()
        }

    @classmethod
    def serialize_rows(cls, rows):
        return [cls.serialize_row(row) for row in rows]

# ===== Blogs API =====
class Blogs(SerializableResource):
    def get(self):
        try:
            print(UPLOAD_BASE)
            fingerprint = request.args.get('f')
            if fingerprint:
                valide, msg = validate_fingerprint_value(fingerprint)
                if not valide:
                    return {"message": msg}, 404

            blogs = db.get_blogs(fingerprint)
            if not blogs:
                return {"message": "Blogs are not yet Available"}, 404
            return {"Blogs": [self.serialize_row(b) for b in blogs]}, 200

        except Exception as e:
            print(f"Error in GET /api/blogs: {traceback.format_exc()}")
            return {"message": "Internal server error"}, 500

    @jwt_required()
    def post(self):
        try:
            data = request.get_json(force=True)

            action = data.get("action", "new").lower()
            del_blog = data.get("blog", {})
            # === HANDLE DELETE EARLY ===
            if action == "delete":
                BlogID_raw = del_blog.get("BlogID")
                Reason_raw = del_blog.get("Reason", "")
                if not BlogID_raw:
                    return make_response(jsonify({"error": "Missing BlogID for deletion"}), 400)

                BlogID = s.sanitize_id(BlogID_raw)
                reason = s.sanitize_alphanum(Reason_raw)
                Username = get_jwt_identity()

                blog_info = db.get_blog_slug(BlogID)
                if not blog_info:
                    return make_response(jsonify({"message": "Unable to delete Blog", "BlogID": BlogID}), 404)

                db.delete_blog(BlogID, blog_info['Slug'], Username, reason)
                return make_response(jsonify({"message": "Blog successfully deleted", "BlogID": BlogID}), 201)

            # === CONTINUE WITH CREATE OR EDIT ===
            submission_type = data.get("submissionType", "draft").lower()
            raw_blog = data.get("blog", {})

            BlogID_raw = raw_blog.get("BlogID")
            Title_raw = raw_blog.get("Title")
            Slug_raw = raw_blog.get("Slug")
            Content_raw = raw_blog.get("Content")
            Summary_raw = raw_blog.get("Summary")
            BlogImage_raw = raw_blog.get("BlogImage")
            CategoryID_raw = raw_blog.get("CategoryID")
            Contributors_raw = raw_blog.get("Contributors")
            Tags_raw = raw_blog.get("Tags")
            UploadKey_raw = raw_blog.get("UploadKey")
            Reason = raw_blog.get("Reason", "")

            # --- Validation (before sanitation) ---
            missing_fields = []
            if not Title_raw: missing_fields.append("Title")
            if not Content_raw: missing_fields.append("Content")
            if not Summary_raw: missing_fields.append("Summary")
            if not BlogImage_raw: missing_fields.append("BlogImage")
            if not CategoryID_raw: missing_fields.append("CategoryID")
            if not Contributors_raw: missing_fields.append("Contributors")
            if not UploadKey_raw: missing_fields.append("UploadKey")

            if missing_fields:
                print("[Validation Error] Missing fields:", missing_fields)
                return make_response(jsonify({
                    "error": "Missing or invalid blog fields",
                    "missing": missing_fields
                }), 400)

            # --- Safe Sanitize (after validation passed) ---
            BlogID = s.sanitize_id(BlogID_raw)
            Title = s.sanitize_title(Title_raw)
            Slug = s.sanitize_slug(Slug_raw)
            Content = s.sanitize_content(Content_raw)
            Summary = s.sanitize_summary(Summary_raw)
            BlogImage = s.sanitize_blog_image(BlogImage_raw)
            CategoryID = s.sanitize_id(CategoryID_raw)
            Contributors = s.sanitize_list(Contributors_raw)
            Tags = s.sanitize_list(Tags_raw)
            UploadKey = s.sanitize_upload_key(UploadKey_raw)
            reason = s.sanitize_alphanum(Reason)

            # --- Handle Status Logic ---
            if submission_type == "publish":
                Status = "Published"
                PublishDate = datetime.now()
            elif submission_type == "schedule":
                Status = "Scheduled"
                PublishDate = s.sanitize_date(raw_blog.get("PublishDate")) or datetime.now()
            else:
                Status = "Draft"
                PublishDate = None

            # --- Final Required Fields Check ---
            required_fields = [Title, Content, Summary, BlogImage, CategoryID, Contributors, UploadKey]
            if not all(required_fields):
                pprint(data)
                return make_response(jsonify({"error": "Missing or invalid blog fields"}), 400)

            # === EDIT ===
            if action == "edit" and BlogID:
                success = db.update_blogs(
                    BlogID=BlogID,
                    Title=Title,
                    Content=Content,
                    Summary=Summary,
                    PublishDate=PublishDate,
                    Status=Status,
                    CategoryID=CategoryID,
                    BlogImage=BlogImage,
                )
                if not success:
                    return make_response(jsonify({"error": "Failed to update blog"}), 500)

                db.delete_blogtag(BlogID)
                db.delete_blog_contributor(BlogID)

                for tag in Tags:
                    tag_obj = db.get_tag(tag)
                    if tag_obj and 'TagID' in tag_obj:
                        db.insert_blogtag(BlogID, tag_obj["TagID"])

                for contributor in Contributors:
                    contributorID = db.get_contributor_id(contributor)
                    if contributorID:
                        db.insert_blog_contributor(BlogID, contributorID['ContributorID'])

                return make_response(jsonify({"message": "Blog successfully edited", "BlogID": BlogID}), 201)

            # === NEW ===
            elif action == "new":
                Slug = generate_slug(Title)
                hashuploadKey = UploadKey + '-hashed'
                BlogID = db.insert_blogs(
                    Title=Title,
                    Slug=Slug,
                    Content=Content,
                    Summary=Summary,
                    PublishDate=PublishDate,
                    Status=Status,
                    CategoryID=CategoryID,
                    BlogImage=BlogImage,
                    UploadKey=hashuploadKey,
                )
                if BlogID:
                    for tag in Tags:
                        Tag = db.get_tag(tag)
                        if Tag:
                            db.insert_blogtag(BlogID, Tag['TagID'])
                    for Contributor in Contributors:
                        contributorID = db.get_contributor_id(Contributor)
                        if contributorID:
                            db.insert_blog_contributor(BlogID, contributorID['ContributorID'])

                source_path = os.path.join(UPLOAD_BASE, 'blogs', UploadKey)
                target_path = os.path.join(UPLOAD_BASE, 'blogs', hashuploadKey)
                if os.path.exists(source_path):
                    os.rename(source_path, target_path)

                return make_response(jsonify({"message": "Blog successfully published", "BlogID": BlogID}), 201)

            # Unknown action
            return make_response(jsonify({"error": "Unsupported blog action"}), 400)

        except Exception as e:
            print(f"[Blogs:POST] Error: {traceback.format_exc()}")
            return make_response(jsonify({
                "error": "Failed to process blog",
                "details": str(e)
            }), 500)


        
        
# ===== WriteUps API =====
class WriteUps(SerializableResource):
    def get(self):
        try:
            fingerprint = request.args.get('f')
            if fingerprint:
                valide, msg = validate_fingerprint_value(fingerprint)
                if not valide:
                    return {"message": msg}, 404
            writeups = db.get_writeups(fingerprint)
            if not writeups:
                return {"message": "WriteUps are not yet Available"}, 404
            sleep(SLEEP)
            return {"Writeups": [self.serialize_row(w) for w in writeups]}, 200
        except Exception as e:
            print(f"Error in GET /api/writeups: {e}")
            return {"message": "Internal server error"}, 500
        
    @jwt_required()
    def post(self):
        data = request.get_json(force=True)
        

# ===== Projects API =====
class Projects(SerializableResource):
    def get(self):
        try:
            fingerprint = request.args.get('f')
            if fingerprint:
                valide, msg = validate_fingerprint_value(fingerprint)
                if not valide:
                    return {"message": msg}, 404
            projects = db.get_projects(fingerprint)
            if not projects:
                return {"message": "Projects are not yet Available"}, 404
            sleep(SLEEP)
            return {"Projects": [self.serialize_row(w) for w in projects]}, 200
        except Exception as e:
            print(f"Error in GET /api/projects: {e}")
            return {"message": "Internal server error"}, 500

# ===== Podcasts API =====
class Podcasts(SerializableResource):
    def get(self):
        try:
            fingerprint = request.args.get('f')
            if fingerprint:
                valide, msg = validate_fingerprint_value(fingerprint)
                if not valide:
                    return {"message": msg}, 404
            podcasts = db.get_podcasts(fingerprint)
            if not podcasts:
                return {"message": "Podcasts are not yet Available"}, 404
            sleep(SLEEP)
            return {"Podcasts": [self.serialize_row(w) for w in podcasts]}, 200
        except Exception as e:
            print(f"Error in GET /api/projects: {e}")
            return {"message": "Internal server error"}, 500


# ===== Achievements API =====
class Achievements(SerializableResource):
    def get(self):
        try:
            fingerprint = request.args.get('f')
            if fingerprint:
                valide, msg = validate_fingerprint_value(fingerprint)
                if not valide:
                    return {"message": msg}, 404
            achievements = db.get_achievements(fingerprint)
            if not achievements:
                return {"message": "Achievements are not yet Available"}, 404
            sleep(SLEEP)
            return {"Achievements": [self.serialize_row(w) for w in achievements]}, 200
        except Exception as e:
            print(f"Error in GET /api/projects: {e}")
            return {"message": "Internal server error"}, 500

# ===== Events API =====
class Events(SerializableResource):
    def get(self):
        try:
            events = db.get_events()
            if not events:
                return {"message": "Events are not yet Available"}, 404
            sleep(SLEEP)
            return {"Events": [self.serialize_row(w) for w in events]}, 200
        except Exception as e:
            print(f"Error in GET /api/events: {e}")
            return {"message": "Internal server error"}, 500

# ===== Fingerprint API =====
class Fingerprint(SerializableResource):
    def post(self):
        try:
            data = request.get_json(force=True)

            fingerprint_value = data.get('FingerprintValue')
            browser = data.get('Browser')
            os_name = data.get('OS')
            device_type = data.get('DeviceType')

            # Check for missing fields
            if not fingerprint_value or not browser or not os_name or not device_type:
                return {"message": "All fields are required"}, 400

            # Input validation
            is_valid, error_msg = validate_fingerprint(
                fingerprint_value, browser, os_name, device_type
            )
            if not is_valid:
                return {"message": error_msg}, 400
            
            ip_address = request.remote_addr
            now = datetime.utcnow()
            visitor = db.get_visitor_by_fingerprint(fingerprint_value)

            if visitor:
                # Update existing visitor
                db.update_visitor(
                    fingerprint_value=fingerprint_value,
                    last_visit=now,
                    visit_count=visitor['VisitCount'] + 1,
                    is_active=True
                )
            else:
                # Insert new visitor record
                db.insert_visitor(
                    fingerprint_value=fingerprint_value,
                    ip_address=ip_address,
                    location=get_country(ip_address),
                    browser=browser,
                    os=os_name,
                    device_type=device_type,
                    first_visit=now,
                    last_visit=now,
                    visit_count=1,
                    is_active=True
                )

            return {"message": "Visitor fingerprint recorded"}, 200

        except Exception as e:
            print(f"Error in POST /api/fingerprint: {e}")
            return {"message": "Internal server error"}, 500

# ===== Like API =====
class Like(Resource):
    def post(self):
        try:
            data = request.get_json()
            contentID = data.get("contentID")
            contentType = data.get("contentType")
            fingerprint = data.get("fingerprint")
            is_valid, error_msg = validate_like_input(contentID, contentType, fingerprint)
            if not is_valid:
                return {"message": error_msg}, 400
            contentType = contentType.strip().capitalize()
            already_liked = db.check_liked(contentType, contentID, fingerprint)
            if already_liked:
                return {"message": "You have already liked this content"}, 409
            updated = db.insert_like(contentType, contentID, fingerprint)
            if not updated:
                return {"message": "Content not found or not updated"}, 404
            return {"message": "Like updated successfully"}, 200
        except Exception as e:
            print(f"[-] Error in POST /api/like: {e}")
            return {"message": "Internal server error"}, 500

# ===== Latest Contents API =====
class Latest(SerializableResource):
    def get(self):
        try:
            latest = db.get_latest()
            if not latest:
                return {"message": "Latest are not yet Available"}, 404
            sleep(SLEEP)
            return {"Latest": [self.serialize_row(w) for w in latest]}, 200
        except Exception as e:
            print(f"Error in GET /api/latest: {e}")
            return {"message": "Internal server error"}, 500

# ===== Contributor API =====
class Contributor(SerializableResource):
    def post(self):
        try:
            data = request.get_json(force=True)
            username = data.get('username') #MUST VALIDATE USER INPUT BEFORE PROCESSING (ZERO-TRUST)
            if not username:
                return {"message": "Username is required"}, 400
            contributor = db.get_contributor(username)
            if not contributor:
                return {"message": "Contributor not found"}, 404
            sleep(SLEEP)
            return {"Contributor": flatten_contributor(self.serialize_rows(contributor))}, 200

        except Exception as e:
            print(f"Error in POST /api/contributors: {e}")
            return {"message": "Internal server error"}, 500



# ==============================================================================================================
# ============================================= DASHBOARD ======================================================
# ==============================================================================================================
# ===== Login API =====
#@limiter.limit("5 per minute")
class Login(SerializableResource):
    def post(self):
        try:
            data = request.get_json(force=True)
            username = sanitize_alphanum(data.get('username')).lower()
            password = sanitize_password(data.get('password'))

            if not username or not password:
                return {"message": "Invalid username or password"}, 400

            user = db.get_user_login(username)
            if not (user and passwordcheck(password, user["PasswordHash"])):
                return {"message": "Invalid username or password"}, 401

            db.update_last_login(user['LoginID'], datetime.utcnow())
            access_token = create_access_token(identity=str(user['Username']))
            response = make_response({
                "message": "Login successful",
                #"csrf_token": get_csrf_token(access_token)
            })
            set_access_cookies(response, access_token)
            
            return response

        except Exception as e:
            print(f"[Login API] Error: {traceback.format_exc()}")
            return {"message": "Internal server error"}, 500

# ===== Logout API =====
class Logout(SerializableResource):
    @jwt_required()
    def post(self):
        response = make_response(jsonify({"message": "Logged out"}), 200)
        unset_jwt_cookies(response)
        return response

# ===== Auth Verify API =====
class AuthVerify(SerializableResource):
    @jwt_required()
    def get(self):
        current_user = get_jwt_identity()
        return make_response(jsonify(member=current_user, authenticated=True), 200)

# ===== Get Member Info API =====
class GetMemberInfo(SerializableResource):
    @jwt_required()
    def get(self):
        try:
            current_user = get_jwt_identity()
            member = db.get_member(current_user)
            if not member:
                return {"message": "Member not found"}, 404

            member_info = flatten_contributor(self.serialize_rows(member), pop=False)
            return make_response(jsonify(authenticated=True, member=member_info), 200)

        except Exception as e:
            print(f"[GetMemberInfo] Error: {traceback.format_exc()}")
            return {"message": "Internal server error"}, 500

# ===== Quick Analytics API =====
class QuickAnalytics(SerializableResource):
    @jwt_required()
    def get(self):
        try:
            quickanalytics = db.get_quickanalytics()
            sleep(SLEEP)
            return make_response(jsonify(authenticated=True, quickanalytics=quickanalytics), 200)
        except Exception as e: 
            print(f"[QuickAnalytics] Error: {traceback.format_exc()}")
            return {"message": "Internal server error"}, 500

# ===== Total Visitor Count API =====
class TotalVisitors(SerializableResource):
    @jwt_required()
    def get(self):
        try:
            counts = db.get_totalvisitors()
            total = counts['total_visitors'] or 0
            last_30 = counts['last_30_days'] or 0
            last_30_60 = counts['last_30_60_days'] or 0

            if last_30_60 == 0:
                change = 100 if last_30 > 0 else 0
            else:
                change = ((last_30 - last_30_60) / last_30_60) * 100
            response = {
                'authenticated': True,
                'TVisitors': {
                    'total': total,
                    'last_30_days': last_30,
                    'last_30_60_days': last_30_60,
                    'change': round(change, 2)
                }
            }
            return make_response(jsonify(response), 200)
        except Exception as e:
            print(f"[TotalVisitors] Error: {traceback.format_exc()}")
            return {"message": "Internal server error"}, 500

# ===== Top Likes API =====
class TopLikes(SerializableResource):
    @jwt_required()
    def get(self):
        try:
            toplikes = db.get_toplikes()
            sleep(SLEEP)
            return make_response(jsonify(authenticated=True, toplikes=toplikes), 200)
        except Exception as e: 
            print(f"[TopLikes] Error: {traceback.format_exc()}")
            return {"message": "Internal server error"}, 500

# ===== Visitors and Likes Timeline API =====
class VisitorLikeTimeLineStats(SerializableResource):
    @jwt_required()
    def post(self):
        try:
            data = request.get_json(force=True)
            timeline = data.get("timeline", "").lower()

            if timeline == 'week':
                likes = db.get_likes_1_week()
                visitors = db.get_visitors_1_week()
            elif timeline == 'month':
                likes = db.get_likes_1_month()
                visitors = db.get_visitors_1_month()
            elif timeline == 'year':
                likes = db.get_likes_1_year()
                visitors = db.get_visitors_1_year()
            else:
                return make_response(jsonify(
                    authenticated=True,
                    error="Invalid timeline value. Expected 'week', 'month', or 'year'."
                ), 400)

            visitors_likes = merge_likes_visitors(likes, visitors, key="date", timeline=timeline)


            sleep(SLEEP)
            return make_response(jsonify(
                authenticated=True,
                timeline=timeline,
                stats=visitors_likes
            ), 200)

        except Exception as e:
            print(f"[VisitorLikeTimeLineStats] Error: {traceback.format_exc()}")
            return make_response(jsonify(
                authenticated=False,
                message="Internal server error",
                error=str(e)
            ), 500)


# ===== Tags, Categories and TechStacks API =====
class TagCategoryTechStack(SerializableResource):
    def get(self):
        try:
            data_type = request.args.get("type", "").lower()

            if data_type == "category":
                records = db.get_all_categories()
            elif data_type == "tag":
                records = db.get_all_tags()
            elif data_type == "techstack":
                records = db.get_all_techstack()
            else:
                return make_response(jsonify({"error": "Invalid type specified"}), 400)

            return make_response(jsonify({
                "type": data_type,
                "data": records
            }), 200)

        except Exception as e:
            print(f"[MetaDataManager:GET] Error: {traceback.format_exc()}")
            return make_response(jsonify({
                "error": "Internal server error",
                "message": str(e)
            }), 500)

    @jwt_required()
    def post(self):
        try:
            data = request.get_json(force=True)
            data_type = data.get("type", "").lower()
            is_valid, result = validate_input_data(data_type, data)
            if not is_valid:
                return make_response(jsonify({"error": result}), 400)

            name = result["name"]
            if result.get("description"):
                description = result.get("description")

            if data_type == "category":
                db.add_category(name, description)
                records = db.get_category(name)
            elif data_type == "tag":
                db.add_tags(name)  # Pass empty string or None if unused
                records = db.get_tag(name)
            elif data_type == "techstack":
                db.add_techstack(name, description)
                records = db.get_techstack(name)
            else:
                return make_response(jsonify({"error": "Invalid type specified"}), 400)

            return make_response(jsonify({
                "message": f"{data_type.capitalize()} added successfully",
                "data": records
            }), 201)

        except Exception as e:
            print(f"[MetaDataManager:POST] Error: {traceback.format_exc()}")
            return make_response(jsonify({
                "error": "Internal server error",
                "message": str(e)
            }), 500)


class Uploads(Resource):
    def get(self, file_type, dir_name, UploadKey):
        try:
            file_type = file_type.lower().strip()
            dir_name = secure_filename(dir_name.strip())
            UploadKey = secure_filename(UploadKey.strip())

            if file_type not in ["image", "audio"]:
                return {"error": "Invalid file type"}, 400

            folder_path = os.path.join(UPLOAD_BASE, dir_name, UploadKey)
            abs_path = os.path.abspath(folder_path)

            if not abs_path.startswith(UPLOAD_BASE):
                return {"error": "Invalid path"}, 400

            if not os.path.exists(abs_path):
                print(f"[DEBUG] Directory does not exist: {abs_path}")
                return {"files": []}, 200

            valid_files = []
            for file in os.listdir(abs_path):
                if is_allowed_file(file, file_type):
                    url_path = f"/uploads/{dir_name}/{UploadKey}/{file}"
                    #print(url_path)
                    valid_files.append(url_path)

            return {"files": sorted(valid_files, reverse=True)}, 200

        except Exception:
            print(f"[Uploads:GET] Error: {traceback.format_exc()}")
            return {"error": "Internal server error"}, 500

    @jwt_required()
    def post(self, file_type, dir_name, UploadKey):
        try:
            if 'file' not in request.files:
                return make_response(jsonify({"error": "No file part in request"}), 400)

            file = request.files['file']

            file_type = file_type.lower().strip()
            dir_name = secure_filename(dir_name.strip())
            UploadKey = secure_filename(UploadKey.strip()) if UploadKey else ""
            print(UploadKey)
            if file.filename == '':
                return make_response(jsonify({"error": "No selected file"}), 400)

            if file_type not in ["image", "audio"]:
                return make_response(jsonify({"error": "Invalid file type"}), 400)

            if not is_allowed_file(file.filename, file_type):
                return make_response(jsonify({"error": "Invalid file extension"}), 400)

            # If UploadKey is not provided or doesn't exist, generate a new one
            if UploadKey == 'new' or not UploadKey or not os.path.exists(os.path.join(UPLOAD_BASE, dir_name, UploadKey)):
                for _ in range(10):
                    UploadKey = f"{dir_name}-{uuid.uuid4().hex}"
                    target_dir = os.path.join(UPLOAD_BASE, dir_name, UploadKey)
                    if not os.path.exists(target_dir):
                        break
                else:
                    return make_response(jsonify({"error": "Failed to generate a unique path"}), 500)
            else:
                target_dir = os.path.join(UPLOAD_BASE, dir_name, UploadKey)

            abs_target_dir = os.path.abspath(target_dir)
            if not abs_target_dir.startswith(UPLOAD_BASE):
                return make_response(jsonify({"error": "Invalid target directory"}), 400)

            os.makedirs(abs_target_dir, exist_ok=True)

            filename = secure_filename(file.filename)
            file_path = os.path.join(abs_target_dir, filename)
            file.save(file_path)

            file_url = f"/uploads/{dir_name}/{UploadKey}/{filename}"
            return make_response(jsonify({
                "message": "Upload successful",
                "url": file_url,
                "UploadKey": UploadKey
            }), 201)

        except Exception as e:
            print(f"[Upload:POST] Error: {traceback.format_exc()}")
            return make_response(jsonify({
                "error": "Failed to upload file",
                "message": str(e)
            }), 500)

class ImageRenderer(Resource):

    def get(self, dir_name, slug, filename):
        try:
            safe_dir_name = secure_filename(dir_name.strip())
            safe_slug = secure_filename(slug.strip())
            safe_filename = secure_filename(filename.strip())

            # Determine filetype by extension
            if safe_filename.lower().endswith(('.png', '.jpg', '.jpeg')):
                filetype = 'image'
            else:
                filetype = 'audio'

            if not is_allowed_file(safe_filename, filetype):
                return {"error": "File extension not allowed"}, 400

            abs_dir = os.path.abspath(os.path.join(UPLOAD_BASE, safe_dir_name, safe_slug))
            abs_file_path = os.path.join(abs_dir, safe_filename)

            # Directory traversal check
            if not abs_file_path.startswith(UPLOAD_BASE):
                return {"error": "Invalid file path"}, 400

            if not os.path.exists(abs_file_path):
                return {"error": "File not found"}, 404

            return send_from_directory(abs_dir, safe_filename)

        except Exception:
            print(f"[ImageRenderer:GET] Error: {traceback.format_exc()}")
            return {"error": "Internal server error"}, 500


# ===== Contributor Management API =====


class ContributorsMgmt(SerializableResource):
    
    def get(self):
        try:
            username = request.args.get("username", "").strip().lower()

            if username:
                contributor = db.get_contributor(username)
                if not contributor:
                    return {"message": "Contributor not found"}, 404
                return {
                    "Contributor": flatten_contributor(self.serialize_rows(contributor))
                }, 200

            else:
                contributors = db.get_all_contributors()
                if not contributors:
                    return {"message": "No contributors found"}, 404

                grouped = defaultdict(list)
                for row in contributors:
                    grouped[row["ContributorID"]].append(row)

                result = [
                    flatten_contributor(self.serialize_rows(group))
                    for group in grouped.values()
                ]

                return {"Contributors": result}, 200

        except Exception as e:
            print(f"Error in GET /api/auth/contributormgmt: {traceback.format_exc()}")
            return {"message": "Internal server error"}, 500



    @jwt_required()
    def post(self):
        try:
            data = request.get_json(force=True)
            name = data.get("name", "").strip()
            username = data.get("username", "").strip()
            email = data.get("email", "").strip()

            if not name or not username or not email:
                return {"message": "Name, username, and email are required"}, 400

            # Additional validation can be done here (e.g. email format)

            new_contributor_id = db.add_contributor(name, username, email)
            if not new_contributor_id:
                return {"message": "Failed to add contributor"}, 500

            return {"message": "Contributor added successfully", "ContributorID": new_contributor_id}, 201

        except Exception as e:
            print(f"Error in POST /api/contributors: {e}")
            return {"message": "Internal server error"}, 500


# ===== Public Register Endpoints =====
api.add_resource(Blogs, '/api/blogs')
api.add_resource(WriteUps, '/api/writeups')
api.add_resource(Projects, '/api/projects')
api.add_resource(Podcasts, '/api/podcasts')
api.add_resource(Achievements, '/api/achievements')
api.add_resource(Events, '/api/events')
api.add_resource(Fingerprint, '/api/fingerprint')
api.add_resource(Like, '/api/like')
api.add_resource(Latest, '/api/latest')
api.add_resource(Contributor, '/api/contributors')
api.add_resource(ImageRenderer, '/api/files/<string:dir_name>/<string:slug>/<string:filename>')

# ===== Dashboards Register Endpoints =====
api.add_resource(Login, '/api/auth/login')
api.add_resource(Logout, '/api/auth/logout')
api.add_resource(AuthVerify, '/api/auth/verify')
api.add_resource(GetMemberInfo, '/api/auth/memberinfo')
api.add_resource(QuickAnalytics, '/api/auth/quickanalytics')
api.add_resource(TotalVisitors, '/api/auth/tvisitors')
api.add_resource(TopLikes, '/api/auth/toplikes')
api.add_resource(VisitorLikeTimeLineStats, '/api/auth/visitorslikes')
api.add_resource(TagCategoryTechStack, '/api/tagscattech')
api.add_resource(Uploads, '/api/uploads/<string:file_type>/<string:dir_name>/<string:UploadKey>')
api.add_resource(ContributorsMgmt, '/api/auth/contributorsmgmt')

#api.add_resource(Dashboard, '/api/writeups')

# ===== Run App =====
if __name__ == '__main__':
    try:
        app.run(host="0.0.0.0", debug=True)
    except Exception as e:
        print("An error occurred while starting the server:")
        traceback.print_exc()
