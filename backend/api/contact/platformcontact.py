import os
import traceback
from flask import request, jsonify, make_response, current_app as app
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from core.extensions import db, s
from utils.serializable_resource import SerializableResource
from pprint import pprint 

class PlatformContacts(SerializableResource):
    def get(self):
        try:
            contacts = db.get_platform_contacts()
            return jsonify({"success": True, "contacts": contacts})
        except Exception as e:
            app.logger.error(traceback.format_exc())
            return make_response(jsonify({"success": False, "message": str(e)}), 500)

    @jwt_required()
    def post(self):
        try:
            identity = get_jwt_identity()
            data = request.json.get('contacts', [])
            # Validate input: must be a list
            if not isinstance(data, list):
                return make_response(jsonify({"success": False, "message": "Invalid input: contacts must be a list."}), 400)
            sanitized_contacts = []
            for idx, c in enumerate(data):
                if not isinstance(c, dict):
                    return make_response(jsonify({"success": False, "message": f"Contact at index {idx} is not a valid object."}), 400)
                platform = s.sanitize_platform(c.get('Platform', ''))
                if not platform:
                    return make_response(jsonify({"success": False, "message": f"Invalid or missing Platform in contact at index {idx}."}), 400)
                url = c.get('URL', '')
                icon = s.sanitize_icon(c.get('Icon', ''))
                # Handle and URL sanitization by platform type
                if platform.lower() == 'email':
                    handle = s.sanitize_email(c.get('Handle', ''))
                    url = s.sanitize_email(url)
                elif platform.lower() == 'phone':
                    handle = s.sanitize_phone_number(c.get('Handle', ''))
                    url = s.sanitize_phone_number(url)
                else:
                    handle = s.sanitize_handle(c.get('Handle', ''))
                    if url.startswith('http://') or url.startswith('https://'):
                        url = s.sanitize_url(url)
                    else:
                        return make_response(jsonify({"success": False, "message": f"Invalid URL in contact at index {idx}."}), 400)
                if not (platform and handle and url and icon):
                    app.logger.error(f"Sanitization failed at index {idx}: {c}")
                    return make_response(jsonify({"success": False, "message": f"Missing or invalid fields in contact at index {idx}: {c}"}), 400)
                sanitized_contacts.append({
                    'Platform': platform,
                    'Handle': handle,
                    'URL': url,
                    'Icon': icon
                })
            
            pprint(sanitized_contacts)
            # Always treat as full replace (edit): delete all, then insert all
            existing = db.get_platform_contacts()
            for c in existing:
                db.delete_platform_contact(c['ContactID'])
            for c in sanitized_contacts:
                db.insert_platform_contact(
                    c['Platform'],
                    c['Handle'],
                    c['URL'],
                    c['Icon']
                )
            return jsonify({"success": True, "message": "Contacts updated."})
        except Exception as e:
            app.logger.error(traceback.format_exc())
            return make_response(jsonify({"success": False, "message": str(e)}), 500)

