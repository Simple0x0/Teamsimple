import os
import traceback
from flask import  request, jsonify, make_response, current_app as app
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from core.extensions import db, s, UPLOAD_BASE
from utils.serializable_resource import SerializableResource

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
            action = request.json.get('action', '').lower()

            if action == 'delete':
                # Delete all contacts
                existing = db.get_platform_contacts()
                for c in existing:
                    db.delete_platform_contact(c['ContactID'])
                return jsonify({"success": True, "message": "All contacts deleted."})

            elif action == 'edit':
                # Edit contacts: expects a list of contacts with ContactID
                for c in data:
                    db.update_platform_contact(
                        c.get('ContactID'),
                        c.get('Platform'),
                        c.get('Handle'),
                        c.get('URL'),
                        c.get('Icon')
                    )
                return jsonify({"success": True, "message": "Contacts updated."})

            elif action == 'new':
                # Add new contacts
                for c in data:
                    db.insert_platform_contact(
                        c.get('Platform'),
                        c.get('Handle'),
                        c.get('URL'),
                        c.get('Icon')
                    )
                return jsonify({"success": True, "message": "Contacts added."})

            else:
                return make_response(jsonify({"success": False, "message": "Invalid or missing action."}), 400)
        except Exception as e:
            app.logger.error(traceback.format_exc())
            return make_response(jsonify({"success": False, "message": str(e)}), 500)

