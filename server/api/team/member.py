import traceback
from flask import request, jsonify, make_response
from flask_jwt_extended import jwt_required, get_jwt_identity
from core.extensions import db
from utils.utils import flatten_contributor
from utils.serializable_resource import SerializableResource
from collections import defaultdict
from pprint import pprint

# ===== Member Info API =====
class MemberInfo(SerializableResource):
    #@jwt_required()
    def post(self):
        try:
            data = request.get_json(force=True) or {}
            if data.get('member') == 'all':
                members = db.get_all_team_members()
                if not members:
                    return {"message": "No team members found"}, 404

                # Group by TeamMemberID and build SocialLinks array
                grouped = {}
                for row in members:
                    tm_id = row["TeamMemberID"]
                    if tm_id not in grouped:
                        grouped[tm_id] = {
                            "TeamMemberID": tm_id,
                            "Username": row["Username"],
                            "FullName": row["FullName"],
                            "Bio": row["Bio"],
                            "ProfilePicture": row["ProfilePicture"],
                            "SocialLinks": []
                        }
                    # Add social link if present and not duplicate
                    if row.get("Platform") and row.get("URL"):
                        link = {"Platform": row["Platform"], "URL": row["URL"]}
                        if link not in grouped[tm_id]["SocialLinks"]:
                            grouped[tm_id]["SocialLinks"].append(link)

                # Redact bio to 20 words for preview
                for m in grouped.values():
                    words = m["Bio"].split()
                    if len(words) > 20:
                        m["BioPreview"] = " ".join(words[:20]) + "..."
                    else:
                        m["BioPreview"] = m["Bio"]

                result = list(grouped.values())
                return make_response(jsonify(team=result), 200)
            else:
                return {"message": "Invalid request"}, 400
        except Exception:
            return {"message": "Internal server error"}, 500
        
    @jwt_required()
    def get(self):
        try:
            current_user = get_jwt_identity()
            member = db.get_member(current_user)
            if not member:
                return {"message": "Member not found"}, 404

            member_info = flatten_contributor(self.serialize_rows(member), pop=False)
            return make_response(jsonify(authenticated=True, member=member_info), 200)

        except Exception:
            return {"message": "Internal server error"}, 500