import traceback
from flask import request, jsonify, make_response
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from time import sleep
from core.extensions import db, s, UPLOAD_BASE, SLEEP
from utils.utils import flatten_contributor
from utils.serializable_resource import SerializableResource


# ===== Get Member Info API =====
class GetMemberInfo(SerializableResource):
    @jwt_required()
    def get(self):
        try:
            current_user = get_jwt_identity()
            member = db.get_member(current_user)
            if not member:
                return {"message": "Member not found"}, 404

            member_info = flatten_contributor(self.serialize_rows(member), pop=False)
            return make_response(jsonify(authenticated=True, member=member_info), 200)

        except Exception as e:
            print(f"[GetMemberInfo] Error: {traceback.format_exc()}")
            return {"message": "Internal server error"}, 500
