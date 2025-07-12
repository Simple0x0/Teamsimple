import os
import traceback
from flask import request, jsonify, make_response, send_from_directory
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from time import sleep
from core.extensions import db, s, UPLOAD_BASE, SLEEP
from utils.utils import validate_like_input
from utils.serializable_resource import SerializableResource
from werkzeug.utils import secure_filename


# ===== Like API =====
class Like(SerializableResource):
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
