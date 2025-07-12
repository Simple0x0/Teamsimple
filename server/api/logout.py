import traceback
from flask import request, jsonify, make_response
from flask_jwt_extended import jwt_required, unset_jwt_cookies
from datetime import datetime
from core.extensions import db, s, UPLOAD_BASE, SLEEP
from utils.serializable_resource import SerializableResource

# ===== Logout API =====
class Logout(SerializableResource):
    @jwt_required()
    def post(self):
        response = make_response(jsonify({"message": "Logged out"}), 200)
        unset_jwt_cookies(response)
        return response