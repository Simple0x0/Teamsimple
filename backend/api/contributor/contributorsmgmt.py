import os
import traceback
import uuid
from flask import request, jsonify, make_response
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask import current_app as app
from core.extensions import db, s, UPLOAD_BASE, CONTRIBUTOR_TYPES, ADMINS
from utils.utils import flatten_contributor
from utils.serializable_resource import SerializableResource
from collections import defaultdict
from pprint import pprint

class ContributorsMgmt(SerializableResource):
    @jwt_required()
    def get(self):
        try:
            username = request.args.get("username", "").strip().lower()

            if username:
                contributor = db.get_contributor(username)
                if not contributor:
                    return {"Contributor": {}}, 200
                return {
                    "Contributor": flatten_contributor(self.serialize_rows(contributor))
                }, 200

            contributors = db.get_all_contributors() or []

            grouped = defaultdict(list)
            for row in contributors:
                grouped[row["ContributorID"]].append(row)

            result = [
                flatten_contributor(self.serialize_rows(group))
                for group in grouped.values()
            ]

            return {"Contributors": result}, 200

        except Exception as e:
            traceback_str = traceback.format_exc()
            app.logger.error(f"[ContributorMgmt:POST] Error: {traceback_str}")
            return {"message": "Internal server error"}, 500

    @jwt_required()
    def post(self):
        try:
            data = request.get_json(force=True)
            action = data.get("action", "new").lower()
            raw_contributor = data.get("contributor", {})

            if action == "delete":
                ContributorID = s.sanitize_id(raw_contributor.get("ContributorID"))
                Reason = s.sanitize_alphanum(raw_contributor.get("Reason", ""))
                Username = get_jwt_identity()
                role_data = db.get_member_role(Username)

                if not role_data or role_data.get("Role") not in ADMINS:
                    return {"error": "Action not permitted"}, 403

                if not ContributorID:
                    return {"error": "ContributorID required for deletion"}, 400
                if not Reason:
                    return {"error": "Deletion reason required"}, 400

                contributor = db.get_contributor_id(ContributorID)
                if not contributor:
                    return {"error": "Contributor not found"}, 404

                #INTENTIONALLY LEFT INACTIVE 
                #db.delete_contributor("Contributor", ContributorID['ContributorID'])
                #db.delete_social_links("Contributor", ContributorID)

                return make_response(jsonify({"message": "Contributor deleted successfully"}), 201)

            ContributorID = s.sanitize_id(raw_contributor.get("ContributorID"))
            Username = s.sanitize_username(raw_contributor.get("Username"))
            FullName = s.sanitize_fullname(raw_contributor.get("FullName", ""))
            Bio = s.sanitize_summary(raw_contributor.get("Bio", ""))
            ProfilePicture = s.sanitize_image_path(raw_contributor.get("ProfilePicture", ""))
            UploadKey = s.sanitize_upload_key(raw_contributor.get("UploadKey"))
            Type = s.sanitize_enum(raw_contributor.get("Type"), CONTRIBUTOR_TYPES)
            SocialLinks = raw_contributor.get("SocialLinks", [])

            # === EDIT ===
            if action == "edit" and ContributorID:
                if not Username or not Type:
                    return {"error": "Missing required fields for update"}, 400

                updated = db.update_contributor(
                    Username=Username,
                    FullName=FullName,
                    Bio=Bio,
                    ProfilePicture=ProfilePicture,
                    Type=Type,
                    ContributorID=ContributorID
                )

                if not updated:
                    return {"error": "Failed to update contributor"}, 500

                if SocialLinks and isinstance(SocialLinks, list):
                    ConID = db.get_contributor_id(Username)
                    deleted = db.delete_social_links("Contributor", ConID['ContributorID'])
                    if deleted:
                        for link in SocialLinks:
                            if not isinstance(link, dict):
                                return {"error": "Invalid social link structure"}, 400
                            platform = s.sanitize_alphanum(link.get("Platform", "").strip())
                            url = s.sanitize_url(link.get("URL", "").strip())
                            
                            if not platform or not url:
                                return {"error": "Invalid Platform Name or URL"}, 400

                            db.insert_social_link("Contributor", ConID["ContributorID"], platform, url)

                    return make_response(jsonify({
                        "message": "Contributor updated successfully",
                        "status": "success"
                    }), 201)

            # === NEW ===
            if action == "new":
                if not Username or not Type:
                    return {"error": "Missing required fields for creation"}, 400

                hashuploadKey = UploadKey + '-hashed'
                contributorID = db.insert_contributor(
                    Username=Username,
                    FullName=FullName,
                    Bio=Bio,
                    ProfilePicture=ProfilePicture if ProfilePicture else '#',
                    UploadKey=hashuploadKey if UploadKey else '',
                    Type=Type
                )

                source = os.path.join(UPLOAD_BASE, 'contributor', UploadKey)
                target = os.path.join(UPLOAD_BASE, 'contributor', hashuploadKey)
                if os.path.exists(source):
                    os.rename(source, target)

                if SocialLinks and isinstance(SocialLinks, list):
                    ConID = db.get_contributor_id(Username)
                    deleted = db.delete_social_links("Contributor", ConID)
                    if deleted:
                        for link in SocialLinks:
                            if not isinstance(link, dict):
                                return {"error": "Invalid social link structure"}, 400
                            platform = s.sanitize_alphanum(link.get("Platform", "").strip())
                            url = s.sanitize_url(link.get("URL", "").strip())
                            
                            if not platform or not url:
                                return {"error": "Invalid Platform Name or URL"}, 400

                            db.insert_social_link("Contributor", ConID["ContributorID"], platform, url)

                    return make_response(jsonify({
                        "message": "Contributor created successfully",
                        "status": "success"
                    }), 201)

            return make_response(jsonify({"error": "Unsupported contributor action"}), 400)

        except Exception:
            traceback_str = traceback.format_exc()
            app.logger.error(f"[ContributorMgmt:POST] Error: {traceback_str}")
            return make_response(jsonify({
                "error": "Failed to process contributor",
                "status": "failure",
                "details": traceback_str
            }), 500)
