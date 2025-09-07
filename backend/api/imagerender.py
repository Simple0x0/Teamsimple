import os
import traceback
from flask import request, jsonify, make_response, send_from_directory
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from time import sleep
from core.extensions import db, s, UPLOAD_BASE, SLEEP
from utils.utils import is_allowed_file
from utils.serializable_resource import SerializableResource
from werkzeug.utils import secure_filename


class ImageRenderer(SerializableResource):

    def get(self, dir_name, slug, filename):
        try:
            safe_dir_name = secure_filename(dir_name.strip())
            safe_slug = secure_filename(slug.strip())
            safe_filename = secure_filename(filename.strip())

            # Determine filetype by extension
            if safe_filename.lower().endswith(('.png', '.jpg', '.jpeg')):
                filetype = 'image'
            else:
                filetype = 'audio'

            if not is_allowed_file(safe_filename, filetype):
                return {"error": "File extension not allowed"}, 400

            abs_dir = os.path.abspath(os.path.join(UPLOAD_BASE, safe_dir_name, safe_slug))
            abs_file_path = os.path.join(abs_dir, safe_filename)

            # Directory traversal check
            if not abs_file_path.startswith(UPLOAD_BASE):
                return {"error": "Invalid file path"}, 400

            if not os.path.exists(abs_file_path):
                return {"error": "File not found"}, 404

            return send_from_directory(abs_dir, safe_filename)

        except Exception:
            print(f"[ImageRenderer:GET] Error: {traceback.format_exc()}")
            return {"error": "Internal server error"}, 500
