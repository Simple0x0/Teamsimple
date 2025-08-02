import traceback
from flask import current_app as app
from flask_jwt_extended import jwt_required
from utils.serializable_resource import SerializableResource
from core.extensions import db, s

class EventParticipants(SerializableResource):
    @jwt_required()
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
"""
    @jwt_required()
    def post(self, event_id):
        try:
            id = s.sanitize_id(event_id)
            event = db.get_event_by_id(id)
            if not event:
                return {"error": "Event not found."}, 404
            if event.get("RegistrationType") == "Closed":
                return {"error": "Registration for this event is closed."}, 403
            data = self.get_json()
            participant = {
                "FirstName": s.sanitize_alphanum(data.get("FirstName", "")),
                "LastName": s.sanitize_alphanum(data.get("LastName", "")),
                "Nickname": s.sanitize_alphanum(data.get("Nickname", "")),
                "Email": s.sanitize_email(data.get("Email", "")),
                "ContactNumber": s.sanitize_alphanum(data.get("ContactNumber", "")),
                "Organization": s.sanitize_summary(data.get("Organization", "")),
                "Position": s.sanitize_summary(data.get("Position", "")),
                "City": s.sanitize_summary(data.get("City", "")),
                "Country": s.sanitize_summary(data.get("Country", "")),
                "RegistrationType": s.sanitize_alphanum(data.get("RegistrationType", "Attendee")),
                "ParticipantInput": s.sanitize_summary(data.get("ParticipantInput", "")),
                "EventID": id,
            }
            # Required fields check
            required = ["Nickname", "Email"]
            missing = [f for f in required if not participant[f]]
            if missing:
                return {"error": f"Missing required fields: {', '.join(missing)}"}, 400
            # Register participant using correct db method
            result = db.register_participant(
                participant["FirstName"],
                participant["LastName"],
                participant["Nickname"],
                participant["Email"],
                participant["ContactNumber"],
                participant["Organization"],
                participant["Position"],
                participant["City"],
                participant["Country"],
                participant["RegistrationType"],
                participant["ParticipantInput"],
                participant["EventID"]
            )
            if result:
                return {"message": "Registration successful."}, 201
            else:
                return {"error": "Failed to register participant."}, 500
        except Exception:
            app.logger.error(f"Error registering participant for event {event_id}: {traceback.format_exc()}")
            return {"error": "Failed to register participant.", "details": traceback.format_exc()}, 500

"""