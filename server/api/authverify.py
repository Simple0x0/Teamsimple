from flask import jsonify, make_response
from flask_jwt_extended import jwt_required, get_jwt_identity
from utils.serializable_resource import SerializableResource

# ===== Auth Verify API =====
class AuthVerify(SerializableResource):
    @jwt_required()
    def get(self):
        current_user = get_jwt_identity()
        return make_response(jsonify(member=current_user, authenticated=True), 200)
