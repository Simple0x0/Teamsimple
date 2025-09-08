import os
import traceback
from flask import request, jsonify, make_response
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from time import sleep
from core.extensions import db, s, UPLOAD_BASE, SLEEP
from utils.utils import generate_slug, validate_fingerprint_value
from utils.serializable_resource import SerializableResource

# ===== Podcasts API =====
class Podcasts(SerializableResource):
    def get(self):
        try:
            fingerprint = request.args.get('f')
            if fingerprint:
                valide, msg = validate_fingerprint_value(fingerprint)
                if not valide:
                    return {"message": msg}, 404
            podcasts = db.get_podcasts(fingerprint) or []
            published_podcasts = [podcast for podcast in (self.serialize_row(p) for p in podcasts) if podcast.get("Status") == "Published"]
            return {"Podcasts": published_podcasts}, 200
        except Exception as e:
            print(f"Error in GET /api/projects: {e}")
            return {"message": "Internal server error"}, 500