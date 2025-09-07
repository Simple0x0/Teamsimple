import traceback
from flask import jsonify, make_response
from flask_jwt_extended import jwt_required
from core.extensions import db
from utils.serializable_resource import SerializableResource


# ===== Top Likes API =====
class TopLikes(SerializableResource):
    @jwt_required()
    def get(self):
        try:
            toplikes = db.get_toplikes()
            return make_response(jsonify(authenticated=True, toplikes=toplikes), 200)
        except Exception as e: 
            print(f"[TopLikes] Error: {traceback.format_exc()}")
            return {"message": "Internal server error"}, 500
