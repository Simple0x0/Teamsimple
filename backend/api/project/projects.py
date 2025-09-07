import traceback
from flask import current_app as app
from flask import request
from datetime import datetime
from core.extensions import db, PUBLIC_EXCLUDED_STATUSES
from utils.utils import validate_fingerprint_value
from utils.serializable_resource import SerializableResource


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

            # Filter and serialize only published projects
            published_projects = []
            for project_row in projects:
                serialized_project = self.serialize_row(project_row)
                status = serialized_project.get("Status", "").strip()
                if status not in PUBLIC_EXCLUDED_STATUSES:
                    published_projects.append(serialized_project)

            # Return the filtered list with a 200 OK HTTP response
            return {"Projects": published_projects}, 200

        except Exception:
            app.logger.error(f"Error in GET /api/projects: {traceback.format_exc()}")
            return {"message": "Internal server error"}, 500
