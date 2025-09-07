import os
import traceback
from flask import request, jsonify, make_response, send_from_directory
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from time import sleep
from core.extensions import db, s, UPLOAD_BASE, SLEEP
from utils.utils import validate_fingerprint, get_country
from utils.serializable_resource import SerializableResource
from werkzeug.utils import secure_filename


# ===== Fingerprint API =====
class Fingerprint(SerializableResource):
    def post(self):
        try:
            data = request.get_json(force=True)

            fingerprint_value = data.get('FingerprintValue')
            browser = data.get('Browser')
            os_name = data.get('OS')
            device_type = data.get('DeviceType')

            # Check for missing fields
            if not fingerprint_value or not browser or not os_name or not device_type:
                return {"message": "All fields are required"}, 400

            # Input validation
            is_valid, error_msg = validate_fingerprint(
                fingerprint_value, browser, os_name, device_type
            )
            if not is_valid:
                return {"message": error_msg}, 400
            
            ip_address = request.remote_addr
            now = datetime.utcnow()
            visitor = db.get_visitor_by_fingerprint(fingerprint_value)

            if visitor:
                # Update existing visitor
                db.update_visitor(
                    fingerprint_value=fingerprint_value,
                    last_visit=now,
                    visit_count=visitor['VisitCount'] + 1,
                    is_active=True
                )
            else:
                # Insert new visitor record
                db.insert_visitor(
                    fingerprint_value=fingerprint_value,
                    ip_address=ip_address,
                    location=get_country(ip_address),
                    browser=browser,
                    os=os_name,
                    device_type=device_type,
                    first_visit=now,
                    last_visit=now,
                    visit_count=1,
                    is_active=True
                )

            return {"message": "Visitor fingerprint recorded"}, 200

        except Exception as e:
            print(f"Error in POST /api/fingerprint: {e}")
            return {"message": "Internal server error"}, 500