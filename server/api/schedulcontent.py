import traceback
from flask import request, jsonify, make_response, current_app as app
from flask_jwt_extended import jwt_required, get_jwt_identity
from core.extensions import db
from utils.serializable_resource import SerializableResource

class ScheduledContent(SerializableResource):
    def get(self):
        try:
            scheduled = db.get_scheduled_contents()
            return jsonify({"success": True, "scheduled": scheduled})
        except Exception as e:
            app.logger.error(traceback.format_exc())
            return make_response(jsonify({"success": False, "message": str(e)}), 500)

    @jwt_required()
    def post(self):
        try:
            identity = get_jwt_identity()
            data = request.json or {}
            action = data.get('action', '').lower()
            if action == 'new':
                ContentType = data.get('ContentType')
                ContentID = data.get('ContentID')
                ScheduledDate = data.get('ScheduledDate')
                db.insert_scheduled_content(ContentType, ContentID, ScheduledDate)
                return jsonify({"success": True, "message": "Scheduled content added."})
            elif action == 'edit':
                ScheduleID = data.get('ScheduleID')
                ContentType = data.get('ContentType')
                ContentID = data.get('ContentID')
                ScheduledDate = data.get('ScheduledDate')
                db.update_scheduled_content(ScheduleID, ContentType, ContentID, ScheduledDate)
                return jsonify({"success": True, "message": "Scheduled content updated."})
            elif action == 'delete':
                ScheduleID = data.get('ScheduleID')
                db.delete_scheduled_content(ScheduleID)
                return jsonify({"success": True, "message": "Scheduled content deleted."})
            else:
                return make_response(jsonify({"success": False, "message": "Invalid or missing action."}), 400)
        except Exception as e:
            app.logger.error(traceback.format_exc())
            return make_response(jsonify({"success": False, "message": str(e)}), 500)
