import os 
import traceback
import uuid
from flask import request
from flask_jwt_extended import jwt_required, get_jwt_identity
from core.extensions import db, s, UPLOAD_BASE
from utils.utils import flatten_contributor
from utils.serializable_resource import SerializableResource
from collections import defaultdict

# ===== Contributor Management API =====
class ContributorsMgmt(SerializableResource):
    def get(self):
        try:
            username = request.args.get("username", "").strip().lower()

            if username:
                contributor = db.get_contributor(username)
                if not contributor:
                    return {"message": "Contributor not found"}, 404
                return {
                    "Contributor": flatten_contributor(self.serialize_rows(contributor))
                }, 200

            else:
                contributors = db.get_all_contributors()
                if not contributors:
                    return {"message": "No contributors found"}, 404

                grouped = defaultdict(list)
                for row in contributors:
                    grouped[row["ContributorID"]].append(row)

                result = [
                    flatten_contributor(self.serialize_rows(group))
                    for group in grouped.values()
                ]

                return {"Contributors": result}, 200

        except Exception as e:
            print(f"Error in GET /api/auth/contributormgmt: {traceback.format_exc()}")
            return {"message": "Internal server error"}, 500



    @jwt_required()
    def post(self):
        try:
            data = request.get_json(force=True)
            name = data.get("name", "").strip()
            username = data.get("username", "").strip()
            email = data.get("email", "").strip()

            if not name or not username or not email:
                return {"message": "Name, username, and email are required"}, 400

            # Additional validation can be done here (e.g. email format)

            new_contributor_id = db.add_contributor(name, username, email)
            if not new_contributor_id:
                return {"message": "Failed to add contributor"}, 500

            return {"message": "Contributor added successfully", "ContributorID": new_contributor_id}, 201

        except Exception as e:
            print(f"Error in POST /api/contributors: {e}")
            return {"message": "Internal server error"}, 500
