import traceback
from flask import current_app as app
from flask import request
from utils.serializable_resource import SerializableResource
from core.extensions import db, s, PUBLIC_EXCLUDED_STATUSES
from pprint import pprint

# ===== Events API =====
class Events(SerializableResource):
    def get(self):
        try:
            events = db.get_events()
            if not events:
                return {"message": "Events are not yet available"}, 404

            public_events = []
            for row in events:
                serialized = self.serialize_row(row)
                status = serialized.get("Status", "").strip()
                if status not in PUBLIC_EXCLUDED_STATUSES:
                    public_events.append(serialized)

            return {"Events": public_events}, 200

        except Exception:
            app.logger.error(f"Error in GET /api/events: {traceback.format_exc()}")
            return {"message": "Internal server error"}, 500

    def post(self):
        try:
            data = request.get_json()
            EventID = s.sanitize_id(data.get('EventID', ''))
        
            # Check if event exists and registration is open
            event = db.get_event_by_id(EventID)
            if not event:
                return {"message": "Event not found."}, 404
            if event.get("RegistrationType") == "Closed":
                return {"message": "Registration for this event is closed."}, 403
            pprint(f"Event data: {data}")
            FirstName = s.sanitize_fullname(data.get('FirstName', ''))
            LastName = s.sanitize_fullname(data.get('LastName', ''))
            Nickname = s.sanitize_username(data.get('Nickname', 'Anonymous'))
            Email = s.sanitize_email(data.get('Email', ''))
            ContactNumber = s.sanitize_phone_number(data.get('ContactNumber', ''))
            Organization = s.sanitize_fullname(data.get('Organization', ''))
            Position = s.sanitize_fullname(data.get('Position', ''))
            City = s.sanitize_fullname(data.get('City', ''))
            Country = s.sanitize_fullname(data.get('Country', ''))
            RegistrationType = data.get('RegistrationType')
            ParticipantInput = s.sanitize_summary(data.get('ParticipantInput', ''))
            
            if RegistrationType not in ['Attendee', 'Student', 'VIP']:
                return {'message': 'Incorrect Registration Type'}
            
            required_fields = ["Nickname", "Email", "RegistrationType", "EventID"]
            if not all(data.get(field) for field in required_fields):
                return {"message": "Missing required registration fields."}, 400

            db.register_participant(
                first_name=FirstName,
                last_name=LastName,
                nickname=Nickname,
                email=Email,
                contact_number=ContactNumber,
                organization=Organization,
                position=Position,
                city=City,
                country=Country,
                registration_type=RegistrationType,
                participant_input=ParticipantInput,
                event_id=EventID
            )

            return {"message": "Registration successful."}, 201

        except Exception:
            app.logger.error(f"Error in POST /api/events: {traceback.format_exc()}")
            return {"message": "Internal server error"}, 500
