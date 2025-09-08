import os
import traceback
from flask import current_app as app
from flask import request, jsonify, make_response
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from core.extensions import db, s, UPLOAD_BASE
from utils.utils import generate_slug
from utils.serializable_resource import SerializableResource

class EventsMgmt(SerializableResource):
    @jwt_required()
    def get(self):
        try:
            events = db.get_events() or []
            events_list = [event for event in (self.serialize_row(e) for e in events) if event.get("Status") != "Deleted"]
            return {"Events": events_list}, 200

        except Exception:
            app.logger.error(f"Error in GET /api/eventsmgmt: {traceback.format_exc()}")
            return {"message": "Internal server error"}, 500

    @jwt_required()
    def post(self):
        try:
            data = request.get_json(force=True)
            action = data.get("action", "new").lower()
            username = get_jwt_identity()

            if action == "delete":
                raw = data.get("event", {})
                event_id = s.sanitize_id(raw.get("EventID"))
                reason = s.sanitize_alphanum(raw.get("Reason", ""))

                # If ScheduleID not provided, look it up
                ScheduleID = None
                if not ScheduleID and event_id:
                    ScheduleID = db.get_schedule_id("Event", event_id)
                if ScheduleID:
                    db.delete_scheduled_content(ScheduleID)

                if not event_id or not reason:
                    return {"error": "Missing EventID or Reason for deletion."}, 400

                if db.delete_event(event_id):
                    return {"message": "Event successfully deleted."}, 201
                else:
                    return {"error": "Failed to delete event."}, 500

            if action in ["open_registration", "close_registration"]:
                raw = data.get("event", {})
                event_id = s.sanitize_id(raw.get("EventID"))
                if not event_id:
                    return {"error": "Missing EventID for registration action."}, 400
                reg_status = "Open" if action == "open_registration" else "Closed"
                success = db.open_close_event(event_id, reg_status)
                if success:
                    return {"message": f"Registration {reg_status.lower()}ed successfully."}, 200
                else:
                    return {"error": f"Failed to {reg_status.lower()} registration."}, 500

            # Accept both 'submissionType' and 'submission_type' from frontend
            submission_type = data.get("submissionType") or data.get("submission_type") or "draft"
            submission_type = submission_type.lower()
            raw = data.get("event", {})

            event_id = s.sanitize_id(raw.get("EventID"))
            title = s.sanitize_title(raw.get("Title"))
            description = s.sanitize_summary(raw.get("Description"))
            start = s.sanitize_date(raw.get("StartDate"))
            end = s.sanitize_date(raw.get("EndDate"))
            mode = s.sanitize_alphanum(raw.get("Mode"))
            location = s.sanitize_summary(raw.get("Location"))
            type_ = s.sanitize_alphanum(raw.get("EventType"))
            image = s.sanitize_image_path(raw.get("EventImage"))
            organizer_id = s.sanitize_id(raw.get("OrganizerID"))
            upload_key = s.sanitize_upload_key(raw.get("UploadKey"))
            payment_type = s.sanitize_alphanum(raw.get("PaymentType"))
            registration_type = s.sanitize_alphanum(raw.get("RegistrationType"))
            summary = s.sanitize_summary(raw.get("Summary"))
            progress_status = s.sanitize_alphanum(raw.get("ProgressStatus"))
            slug = s.sanitize_alphanum(raw.get("Slug"))

            required_fields = [
                ("Title", title),
                ("Start", start),
                ("End", end),
                ("Type", type_),
                ("Image", image),
                ("UploadKey", upload_key),
                ("PaymentType", payment_type),
                ("RegistrationType", registration_type),
                ("Slug", slug),
            ]

            missing_fields = [name for name, val in required_fields if val in (None, '')]
            if missing_fields:
                return {"error": f"Missing or invalid event fields: {', '.join(missing_fields)}"}, 400
            
            if registration_type not in ['Open', 'Closed']:
                return {'message': 'Incorrect Registration Type'}, 400
            
            if payment_type not in ['Free', 'Paid']:
                return {'message': 'Incorrect Payment Type'}, 400

            if submission_type == "publish":
                status = "Published"
            elif submission_type == "schedule":
                status = "Scheduled"
            else:
                status = "Draft"

            if action == "edit" and event_id:
                success = db.update_event(
                    event_id=event_id,
                    title=title,
                    summary=summary,
                    description=description,
                    start=start,
                    end=end,
                    mode=mode,
                    location=location,
                    type_=type_,
                    progress_status=progress_status,
                    slug=slug,
                    status=status,
                    organizer_id=organizer_id,
                    image=image,
                    upload_key=upload_key,
                    payment_type=payment_type,
                    registration_type=registration_type
                )
                if not success:
                    return {"error": "Failed to update event."}, 500

                db.delete_event_tags(event_id)
                for tag in s.sanitize_list(raw.get("Tags", [])):
                    tag_obj = db.get_tag(tag)
                    if tag_obj and 'TagID' in tag_obj:
                        db.add_event_tag(event_id, tag_obj['TagID'])

                # --- SCHEDULE LOGIC ---
                schedule_id = db.get_schedule_id("Event", event_id)
                if status == "Scheduled":
                    db.insert_scheduled_content("Event", event_id, start)
                elif schedule_id:
                    db.delete_scheduled_content(schedule_id)

                return {"message": "Event successfully updated.", "EventID": event_id}, 201

            elif action == "new":
                slug = slug or generate_slug(title)
                hashed_upload_key = upload_key + '-hashed'
                new_event_id = db.create_event(
                    title=title,
                    summary=summary,
                    description=description,
                    start=start,
                    end=end,
                    mode=mode,
                    location=location,
                    type_=type_,
                    progress_status=progress_status,
                    slug=slug,
                    status=status,
                    organizer_id=organizer_id,
                    image=image,
                    upload_key=hashed_upload_key,
                    payment_type=payment_type,
                    registration_type=registration_type
                )

                for tag in s.sanitize_list(raw.get("Tags", [])):
                    tag_obj = db.get_tag(tag)
                    if tag_obj:
                        db.add_event_tag(new_event_id, tag_obj['TagID'])

                # --- SCHEDULE LOGIC ---
                schedule_id = db.get_schedule_id("Event", new_event_id)
                if status == "Scheduled":
                    db.insert_scheduled_content("Event", new_event_id, start)
                elif schedule_id:
                    db.delete_scheduled_content(schedule_id)

                source = os.path.join(UPLOAD_BASE, 'events', upload_key)
                target = os.path.join(UPLOAD_BASE, 'events', hashed_upload_key)
                if os.path.exists(source):
                    os.rename(source, target)

                return {"message": "Event successfully created.", "EventID": new_event_id}, 201

            return {"error": "Unsupported event action."}, 400

        except Exception:
            app.logger.error(f"[EventsMgmt:POST] Error: {traceback.format_exc()}")
            return make_response(jsonify({
                "error": "Failed to process event.",
                "details": traceback.format_exc()
            }), 500)
