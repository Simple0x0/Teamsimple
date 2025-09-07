from flask import jsonify, make_response
from flask_jwt_extended import jwt_required, get_jwt_identity
from utils.serializable_resource import SerializableResource
from core.extensions import db

# ===== Auth Verify API =====
class AuthVerify(SerializableResource):
    @jwt_required()
    def get(self):
        current_user = get_jwt_identity()
        user = db.get_user_login(current_user)

        if not user:
            return make_response(jsonify(
                authenticated=False,
                message="User not found"
            ), 404)

        is_first_login = bool(user.get('Isfirstlogin'))

        response = {
            "member": current_user,
            "authenticated": True
        }

        if is_first_login:
            response["isFirstLogin"] = True

        return make_response(jsonify(response), 200)
