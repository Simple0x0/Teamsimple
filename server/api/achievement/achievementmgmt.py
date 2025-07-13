import os
import traceback
from flask import current_app as app
from flask import request, jsonify, make_response
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from core.extensions import db, s, UPLOAD_BASE
from utils.utils import generate_slug, validate_fingerprint_value
from utils.serializable_resource import SerializableResource

class AchievementMgmt(SerializableResource):
    @jwt_required()
    def get(self):
        try:
            fingerprint = request.args.get('f')
            if fingerprint:
                valid, msg = validate_fingerprint_value(fingerprint)
                if not valid:
                    return {"message": msg}, 404

            achievements = db.get_achievements(fingerprint)
            if not achievements:
                return {"message": "Achievements are not yet available"}, 404

            result = [a for a in [self.serialize_row(a) for a in achievements] if a.get("Status") != "Deleted"]
            return {"Achievements": result}, 200

        except Exception:
            app.logger.error(f"Error in GET /api/achievements: {traceback.format_exc()}")
            return {"message": "Internal server error"}, 500

    @jwt_required()
    def post(self):
        try:
            data = request.get_json(force=True)
            action = data.get("action", "new").lower()
            submission_type = data.get("submissionType", "draft").lower()

            if action == "delete":
                ach_data = data.get("achievement", {})
                AchievementID = s.sanitize_id(ach_data.get("AchievementID"))
                reason = s.sanitize_alphanum(ach_data.get("Reason", ""))
                Username = get_jwt_identity()

                if not AchievementID:
                    return {"error": "Please specify achievement to delete"}, 400
                if not reason:
                    return {"error": "Provide a reason for deletion"}, 400

                db.delete_achievement(AchievementID, Username, reason)
                return make_response(jsonify({"message": "Achievement successfully deleted"}), 201)

            ach_data = data.get("achievement", {})
            AchievementID = s.sanitize_id(ach_data.get("AchievementID"))
            Title = s.sanitize_title(ach_data.get("Title"))
            Description = s.sanitize_summary(ach_data.get("Description"))
            DateAchieved = s.sanitize_date(ach_data.get("DateAchieved"))
            Image = s.sanitize_image_path(ach_data.get("Image"))
            UploadKey = s.sanitize_upload_key(ach_data.get("UploadKey"))
            ReferenceURL = s.sanitize_url(ach_data.get("ReferenceURL"))

            required_fields = [
                ("Title", Title),
                ("Description", Description),
                ("DateAchieved", DateAchieved),
                ("Image", Image),
                ("UploadKey", UploadKey)
            ]

            missing_fields = [field for field, value in required_fields if not value]
            if missing_fields:
                return {"error": f"Missing or invalid achievement fields: {', '.join(missing_fields)}"}, 400

            Status = "Published" if submission_type == "publish" else "Scheduled" if submission_type == "schedule" else "Draft"

            if action == "edit" and AchievementID:
                success = db.update_achievement(
                    AchievementID=AchievementID,
                    Title=Title,
                    Description=Description,
                    DateAchieved=DateAchieved,
                    Image=Image,
                    ReferenceURL=ReferenceURL,
                    Status=Status
                )
                if not success:
                    return make_response(jsonify({"error": "Failed to update achievement"}), 500)

                return make_response(jsonify({"message": "Achievement successfully updated", "AchievementID": AchievementID}), 201)

            elif action == "new":
                hashed_upload_key = UploadKey + '-hashed'
                AchievementID = db.insert_achievement(
                    Title=Title,
                    Description=Description,
                    DateAchieved=DateAchieved,
                    Image=Image,
                    UploadKey=hashed_upload_key,
                    ReferenceURL=ReferenceURL,
                    Status=Status
                )

                source = os.path.join(UPLOAD_BASE, 'achievements', UploadKey)
                target = os.path.join(UPLOAD_BASE, 'achievements', hashed_upload_key)
                if os.path.exists(source):
                    os.rename(source, target)

                return make_response(jsonify({"message": "Achievement successfully created", "AchievementID": AchievementID}), 201)

            return make_response(jsonify({"error": "Unsupported achievement action"}), 400)

        except Exception:
            app.logger.error(f"[Achievement:POST] Error: {traceback.format_exc()}")
            return make_response(jsonify({
                "error": "Failed to process achievement",
                "details": traceback.format_exc()
            }), 500)
