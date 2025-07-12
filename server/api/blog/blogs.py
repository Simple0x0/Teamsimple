import os
import traceback
from flask import request, jsonify, make_response
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from core.extensions import db, s, UPLOAD_BASE
from utils.utils import generate_slug, validate_fingerprint_value
from utils.serializable_resource import SerializableResource
from pprint import pprint

class Blogs(SerializableResource):
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
            published_blogs = [blog for blog in [self.serialize_row(b) for b in blogs] if blog.get("Status") == "Published"]
            return {"Blogs": published_blogs}, 200

        except Exception:
            print(f"Error in GET /api/blogs: {traceback.format_exc()}")
            return {"message": "Internal server error"}, 500
