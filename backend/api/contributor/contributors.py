import os
import traceback
from flask import request, jsonify, make_response
from flask_jwt_extended import jwt_required, get_jwt_identity
from core.extensions import db, s, UPLOAD_BASE, SLEEP
from utils.utils import flatten_contributor
from utils.serializable_resource import SerializableResource


# ===== Contributor API =====
class Contributor(SerializableResource):
    def post(self):
        try:
            data = request.get_json(force=True)
            name = data.get('username') #MUST VALIDATE USER INPUT BEFORE PROCESSING (ZERO-TRUST)
            username = s.sanitize_username(name)
            if not username:
                return {"message": "Username is required"}, 400
            contributor = db.get_contributor(username) or []
            return {"Contributor": flatten_contributor(self.serialize_rows(contributor))}, 200

        except Exception as e:
            print(f"Error in POST /api/contributors: {e}")
            return {"message": "Internal server error"}, 500
