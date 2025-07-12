import os
import traceback
from flask import request, jsonify, make_response, send_from_directory
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from time import sleep
from core.extensions import db, s, UPLOAD_BASE, SLEEP
from utils.utils import validate_fingerprint_value
from utils.serializable_resource import SerializableResource
from werkzeug.utils import secure_filename

# ===== Events API =====
class Events(SerializableResource):
    def get(self):
        try:
            events = db.get_events()
            if not events:
                return {"message": "Events are not yet Available"}, 404
            sleep(SLEEP)
            return {"Events": [self.serialize_row(w) for w in events]}, 200
        except Exception as e:
            print(f"Error in GET /api/events: {e}")
            return {"message": "Internal server error"}, 500