import os
import traceback
from flask import request, jsonify, make_response, send_from_directory
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from time import sleep
from core.extensions import db, s, UPLOAD_BASE, SLEEP
from utils.utils import validate_fingerprint_value
from utils.serializable_resource import SerializableResource
from werkzeug.utils import secure_filename

# ===== Achievements API =====
class Achievements(SerializableResource):
    def get(self):
        try:
            fingerprint = request.args.get('f')
            if fingerprint:
                valide, msg = validate_fingerprint_value(fingerprint)
                if not valide:
                    return {"message": msg}, 404
            achievements = db.get_achievements(fingerprint) or []
            published_achievements = [achievement for achievement in [self.serialize_row(p) for p in achievements] if achievement.get("Status") == "Published"]
            return {"Achievements": published_achievements}, 200
        except Exception as e:
            print(f"Error in GET /api/projects: {e}")
            return {"message": "Internal server error"}, 500
