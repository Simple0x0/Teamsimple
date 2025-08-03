import os
import traceback
from flask import current_app as app
from flask import request, jsonify, make_response
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from core.extensions import db, s, UPLOAD_BASE
from utils.utils import generate_slug, validate_fingerprint_value
from utils.serializable_resource import SerializableResource
from pprint import pprint

class BlogsMgmt(SerializableResource):
    @jwt_required()
    def get(self):
        try:
            fingerprint = request.args.get('f')
            if fingerprint:
                valide, msg = validate_fingerprint_value(fingerprint)
                if not valide:
                    return {"message": msg}, 404
            blogs = db.get_blogs(fingerprint)
            if not blogs:
                return {"message": "Blogs are not yet Available"}, 404
            blogs_list = [blog for blog in [self.serialize_row(b) for b in blogs] if blog.get("Status") != "Deleted"]
            return {"Blogs": blogs_list}, 200
            
        except Exception:
            app.logger.error(f"Error in GET /api/blogs: {traceback.format_exc()}")
            return {"message": "Internal server error"}, 500

    @jwt_required()
    def post(self):
        try:
            data = request.get_json(force=True)
            action = data.get("action", "new").lower()
            del_blog = data.get("blog", {})
            if action == "delete":
                BlogID_raw = del_blog.get("BlogID")
                Reason_raw = del_blog.get("Reason", "")
                if not BlogID_raw:
                    return make_response(jsonify({"error": "Please Blog WriteUp for deletion"}), 400)

                BlogID = s.sanitize_id(BlogID_raw)
                reason = s.sanitize_alphanum(Reason_raw)
                Username = get_jwt_identity()

                # If ScheduleID not provided, look it up
                ScheduleID = None
                if not ScheduleID and BlogID:
                    ScheduleID = db.get_schedule_id("Blog", BlogID)
                if ScheduleID:
                    db.delete_scheduled_content(ScheduleID)
                    
                if not reason:
                    return make_response(jsonify({"error": "Provide a reason of deletion"}), 400)
                
                blog_slug = db.get_blog_slug(BlogID)
                if not blog_slug:
                    return make_response(jsonify({"message": "Blog not found or already deleted"}), 404)

                db.delete_blog(BlogID, blog_slug['Slug'], Username, reason)
                return make_response(jsonify({"message": "Blog successfully deleted"}), 201)

            # Continue with create/edit
            submission_type = data.get("submissionType", "draft").lower()
            raw_blog = data.get("blog", {})

            BlogID = s.sanitize_id(raw_blog.get("BlogID"))
            Title = s.sanitize_title(raw_blog.get("Title"))
            Slug = s.sanitize_slug(raw_blog.get("Slug"))
            Content = s.sanitize_content(raw_blog.get("Content"))
            Summary = s.sanitize_summary(raw_blog.get("Summary"))
            BlogImage = s.sanitize_image_path(raw_blog.get("BlogImage"))
            CategoryID = s.sanitize_id(raw_blog.get("CategoryID"))
            Contributors = s.sanitize_list(raw_blog.get("Contributors"))
            Tags = s.sanitize_list(raw_blog.get("Tags"))
            UploadKey = s.sanitize_upload_key(raw_blog.get("UploadKey"))

            # Required field check
            required = [
                ("Title", Title),
                ("Content", Content),
                ("Summary", Summary),
                ("BlogImage", BlogImage),
                ("CategoryID", CategoryID),
                ("Contributors", Contributors),
                ("UploadKey", UploadKey)
            ]

            missing_fields = [name for name, value in required if value in (None, '')]

            if missing_fields:
                return { "error": f"Missing or invalid blog fields: {', '.join(missing_fields)}" }, 400

            

            # Status logic
            if submission_type == "publish":
                Status = "Published"
                PublishDate = datetime.now()
            elif submission_type == "schedule":
                Status = "Scheduled"
                PublishDate = s.sanitize_date(raw_blog.get("PublishDate")) or datetime.now()
            else:
                Status = "Draft"
                PublishDate = None

            if action == "edit" and BlogID:
                success = db.update_blogs(
                    BlogID=BlogID,
                    Title=Title,
                    Content=Content,
                    Summary=Summary,
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
                        db.insert_blogtag(BlogID, tag_obj['TagID'])

                for contributor in Contributors:
                    contributorID = db.get_contributor_id(contributor)
                    if contributorID:
                        db.insert_blog_contributor(BlogID, contributorID['ContributorID'])

                # --- SCHEDULE LOGIC ---
                schedule_id = db.get_schedule_id("Blog", BlogID)
                if Status == "Scheduled":
                    db.insert_scheduled_content("Blog", BlogID, PublishDate)
                elif schedule_id:
                    db.delete_scheduled_content(schedule_id)

                return make_response(jsonify({"message": "Blog successfully edited", "BlogID": BlogID}), 201)

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

                    # --- SCHEDULE LOGIC ---
                    schedule_id = db.get_schedule_id("Blog", BlogID)
                    if Status == "Scheduled":
                        db.insert_scheduled_content("Blog", BlogID, PublishDate)
                    elif schedule_id:
                        db.delete_scheduled_content(schedule_id)

                    return make_response(jsonify({"message": "Blog successfully published", "BlogID": BlogID}), 201)

            return make_response(jsonify({"error": "Unsupported blog action"}), 400)

        except Exception:
            app.logger.error(f"[Blogs:POST] Error: {traceback.format_exc()}")
            return make_response(jsonify({
                "error": "Failed to process blog",
                "details": traceback.format_exc()
            }), 500)
