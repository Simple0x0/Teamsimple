import traceback
from flask import request, jsonify, make_response, current_app as app
from flask_jwt_extended import jwt_required, get_jwt_identity
from core.extensions import db
from utils.serializable_resource import SerializableResource

class ScheduledContent(SerializableResource):
    @jwt_required()
    def get(self):
        try:
            scheduled = db.get_scheduled_contents()
            return jsonify({"success": True, "scheduled": scheduled})
        except Exception as e:
            app.logger.error(traceback.format_exc())
            return make_response(jsonify({"success": False, "message": str(e)}), 500)
