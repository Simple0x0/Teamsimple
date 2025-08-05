import traceback
from flask import current_app as app
from flask_jwt_extended import jwt_required
from utils.serializable_resource import SerializableResource
from core.extensions import db, s

class EventParticipants(SerializableResource):
    #@jwt_required()
    def get(self, event_id):
        
        try:
            id = s.sanitize_id(event_id)
            participants = db.get_event_participants(id)
            if not participants:
                return {"message": "No participants found for this event."}, 404
            return {"Participants": self.serialize_rows(participants)}, 200
        except Exception:
            app.logger.error(f"Error fetching participants for event {event_id}: {traceback.format_exc()}")
            return {"error": "Failed to fetch participants.", "details": traceback.format_exc()}, 500
