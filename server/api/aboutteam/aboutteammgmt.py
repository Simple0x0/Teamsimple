import os
import traceback
from flask import current_app as app
from flask import request, jsonify, make_response
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from core.extensions import db, s, SECTION_MAP, ADMINS
from utils.utils import generate_slug, validate_fingerprint_value
from utils.serializable_resource import SerializableResource

class AboutTeamMgmt(SerializableResource):
    #@jwt_required()
    def get(self):
        try:
            section = request.args.get("section", "").strip()
            section_normalized = SECTION_MAP.get(section)

            if not section_normalized:
                return {"error": "Invalid section"}, 400

            result = db.about_team_section(section=section_normalized)

            if not result:
                return {"message": "No content found for section."}, 404

            #return jsonify(result), 200
            return {"AboutTeam": result}, 200

        except Exception:
            app.logger.error("GET /api/aboutteammgmt failed: %s", traceback.format_exc())
            return {"message": "Internal server error"}, 500

    @jwt_required()
    def post(self):
        try:
            payload = request.get_json(force=True)
            section_key = payload.get("section", "").strip()
            section_normalized = SECTION_MAP.get(section_key)

            if not section_normalized:
                return {"error": "Invalid section"}, 400

            title = s.sanitize_title(payload.get("title", "").strip())
            description = s.sanitize_summary(payload.get("description", "").strip())

            username = get_jwt_identity()
            role_data = db.get_member_role(username)

            if not role_data or role_data.get("Role") not in ADMINS:
                return {"error": "Action not permitted"}, 403

            if db.about_team_section(section=section_normalized):
                db.about_team_update(title=title, description=description, section=section_normalized)
            else:
                db.about_team_insert(title=title, description=description, section=section_normalized)

            return {"message": f"{section_normalized} saved successfully."}, 200

        except Exception:
            app.logger.error("POST /api/aboutteammgmt failed: %s", traceback.format_exc())
            return make_response(jsonify({"error": "Failed to process AboutTeam"}), 500)
