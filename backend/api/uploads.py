import os 
import traceback
import uuid
from flask import jsonify, make_response, request
from flask_jwt_extended import jwt_required
from core.extensions import UPLOAD_BASE, limiter
from utils.uploads_validator import file_validate
from werkzeug.utils import secure_filename
from utils.utils import is_allowed_file
from utils.serializable_resource import SerializableResource


class Uploads(SerializableResource):
    def get(self, file_type, dir_name, UploadKey):
        try:
            file_type = file_type.lower().strip()
            dir_name = secure_filename(dir_name.strip())
            UploadKey = secure_filename(UploadKey.strip())

            if file_type not in ["image", "audio"]:
                return {"error": "Invalid file type"}, 400

            folder_path = os.path.join(UPLOAD_BASE, dir_name, UploadKey)
            abs_path = os.path.abspath(folder_path)

            if not abs_path.startswith(UPLOAD_BASE):
                return {"error": "Invalid path"}, 400

            if not os.path.exists(abs_path):
                print(f"[DEBUG] Directory does not exist: {abs_path}")
                return {"files": []}, 200

            valid_files = []
            for file in os.listdir(abs_path):
                if is_allowed_file(file, file_type):
                    url_path = f"/uploads/{dir_name}/{UploadKey}/{file}"
                    #print(url_path)
                    valid_files.append(url_path)

            return {"files": sorted(valid_files, reverse=True)}, 200

        except Exception:
            print(f"[Uploads:GET] Error: {traceback.format_exc()}")
            return {"error": "Internal server error"}, 500

    @limiter.limit("10 per minute")
    @jwt_required()
    def post(self, file_type, dir_name, UploadKey):
        try:
            if 'file' not in request.files:
                return make_response(jsonify({"error": "No file part in request"}), 400)

            file = request.files['file']

            file_type = file_type.lower().strip()
            dir_name = secure_filename(dir_name.strip())
            UploadKey = secure_filename(UploadKey.strip()) if UploadKey else ""
            if file.filename == '':
                return make_response(jsonify({"error": "No selected file"}), 400)

            if file_type not in ["image", "audio"]:
                return make_response(jsonify({"error": "Invalid file type"}), 400)

            if not is_allowed_file(file.filename, file_type):
                return make_response(jsonify({"error": "Invalid file extension"}), 400)
            
            valid, message = file_validate(file, file.filename, file_type)
            if not valid:
                return {"error": message}, 400
            
            # If UploadKey is not provided or doesn't exist, generate a new one
            if UploadKey == 'new' or not UploadKey or not os.path.exists(os.path.join(UPLOAD_BASE, dir_name, UploadKey)):
                for _ in range(10):
                    UploadKey = f"{dir_name}-{uuid.uuid4().hex}"
                    target_dir = os.path.join(UPLOAD_BASE, dir_name, UploadKey)
                    if not os.path.exists(target_dir):
                        break
                else:
                    return make_response(jsonify({"error": "Failed to generate a unique path"}), 500)
            else:
                target_dir = os.path.join(UPLOAD_BASE, dir_name, UploadKey)

            abs_target_dir = os.path.abspath(target_dir)
            if not abs_target_dir.startswith(UPLOAD_BASE):
                return make_response(jsonify({"error": "Invalid target directory"}), 400)

            os.makedirs(abs_target_dir, exist_ok=True)

            filename = secure_filename(file.filename)
            file_path = os.path.join(abs_target_dir, filename)
            file.save(file_path)

            file_url = f"/uploads/{dir_name}/{UploadKey}/{filename}"
            return make_response(jsonify({
                "message": "Upload successful",
                "url": file_url,
                "UploadKey": UploadKey
            }), 201)

        except Exception as e:
            print(f"[Upload:POST] Error: {traceback.format_exc()}")
            return make_response(jsonify({
                "error": "Failed to upload file",
                "message": str(e)
            }), 500)