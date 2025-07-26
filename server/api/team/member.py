import traceback
from flask import request, jsonify, make_response
from flask_jwt_extended import jwt_required, get_jwt_identity
from core.extensions import db
from utils.utils import flatten_contributor
from utils.serializable_resource import SerializableResource

# ===== Member Info API =====
class MemberInfo(SerializableResource):
    @jwt_required()
    def get(self):
        try:
            current_user = get_jwt_identity()
            member = db.get_member(current_user)
            if not member:
                return {"message": "Member not found"}, 404

            member_info = flatten_contributor(self.serialize_rows(member), pop=False)
            return make_response(jsonify(authenticated=True, member=member_info), 200)

        except Exception:
            return {"message": "Internal server error"}, 500