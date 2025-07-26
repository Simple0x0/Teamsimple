import os
import traceback
from flask import request, jsonify, make_response
from flask import current_app as app
from flask_jwt_extended import jwt_required, get_jwt_identity
from core.extensions import db, s, UPLOAD_BASE
from utils.utils import flatten_contributor
from collections import defaultdict
from utils.serializable_resource import SerializableResource
from pprint import pprint

# ===== Team Management API =====
class TeamMgmt(SerializableResource):
    #@jwt_required()
    def get(self):
        try:
            username = request.args.get("username", "").strip().lower()

            if username:
                member = db.get_member(username)
                if not member:
                    return {"message": "Member not found"}, 404
                return make_response(jsonify(authenticated=True, member=flatten_contributor(self.serialize_rows(member), pop=False)), 200)

            members = db.get_all_team_members()
            if not members:
                return {"message": "No team members found"}, 404

            grouped = defaultdict(list)
            for row in members:
                grouped[row["TeamMemberID"]].append(row)

            result = [
                flatten_contributor(self.serialize_rows(group), pop=False)
                for group in grouped.values()
            ]

            return make_response(jsonify(authenticated=True, members=result), 200)

        except Exception:
            traceback_str = traceback.format_exc()
            app.logger.error(f"[ContributorMgmt:POST] Error: {traceback_str}")
            return {"message": "Internal server error"}, 500


    @jwt_required()
    def post(self):
        try:
            data = request.get_json(force=True)
            action = data.get("action", "new").lower()
            raw_member = data.get("member", {})

            current_username = get_jwt_identity()
            current_role = db.get_member_role(current_username)
            if not current_role:
                return {"message": "Current member not found or invalid role"}, 403

            is_superadmin = current_role.get("Role") == "Superadmin"
            is_admin = current_role.get("Role") == "Admin"
            is_member = current_role.get("Role") == "Member"

            current_member = db.get_member_id(current_username)
            if not current_member['TeamMemberID']:
                return {"message": "Current member not found"}, 500
            current_member_id = current_member.get("TeamMemberID")

            Username = s.sanitize_username(raw_member.get("Username"))
            target_member = db.get_member_id(Username)
            TeamMemberID = target_member['TeamMemberID'] if target_member else None

            if not Username:
                return {"message": "Username required"}, 400

            
            if action in ["banned", "suspend", "active"]:
                if not is_superadmin:
                    return {"message": "Only Superadmin can suspend, ban or activate members"}, 403

                if not TeamMemberID:
                    return {"message": "TeamMemberID required for this action"}, 400

                if TeamMemberID == current_member_id:
                    return {"message": "Superadmin cannot modify their own status"}, 403

                status_map = {
                    "banned": "Banned",
                    "suspend": "Suspended",
                    "active": "Active"
                }

                new_status = status_map[action]
                print(new_status)
                updated = db.update_team_member_status(TeamMemberID=TeamMemberID, Status=new_status)
                if not updated:
                    return {"message": f"Failed to update status to {action}"}, 500

                return make_response(jsonify({"message": f"Member {action} successfully"}), 200)

            # Parse member details only when needed
            FullName = s.sanitize_fullname(raw_member.get("FullName", ""))
            Bio = s.sanitize_summary(raw_member.get("Bio", ""))
            ProfilePicture = s.sanitize_image_path(raw_member.get("ProfilePicture", ""))
            UploadKey = s.sanitize_upload_key(raw_member.get("UploadKey"))
            Email = s.sanitize_email(raw_member.get("Email", ""))
            Role = s.sanitize_enum(raw_member.get("Role", "Member"), ["Superadmin", "Admin", "Member"])
            SocialLinks = raw_member.get("SocialLinks", [])
            
            if action == "edit" and TeamMemberID:
                if TeamMemberID == current_member_id:
                    updated = db.update_team_member(
                        TeamMemberID=TeamMemberID,
                        Username=Username,
                        FullName=FullName,
                        Bio=Bio,
                        ProfilePicture=ProfilePicture,
                        Email=Email,
                        Role=current_role.get("Role")
                    )
                    if not updated:
                        return {"message": "Failed to update profile"}, 500
                    return make_response(jsonify({"message": "Profile updated successfully"}), 200)

                if not is_superadmin:
                    return {"message": "Only Superadmin can modify members"}, 403

                updated = db.update_team_member(
                    TeamMemberID=TeamMemberID,
                    Username=Username,
                    FullName=FullName,
                    Bio=Bio,
                    ProfilePicture=ProfilePicture,
                    Email=Email,
                    Role=Role
                )
                if not updated:
                    return {"message": "Failed to update member"}, 500

                if SocialLinks and isinstance(SocialLinks, list):
                    deleted = db.delete_social_links("TeamMember", TeamMemberID)
                    if deleted:
                        for link in SocialLinks:
                            if not isinstance(link, dict):
                                return {"message": "Invalid social link structure"}, 400

                            platform = s.sanitize_alphanum(link.get("Platform", "").strip())
                            url = s.sanitize_url(link.get("URL", "").strip())

                            if not platform or not url:
                                return {"message": "Invalid Platform Name or URL"}, 400

                            db.insert_social_link("TeamMember", TeamMemberID, platform, url)

                return make_response(jsonify({"message": "Member updated successfully"}), 200)

            if action == "new":
                if not (is_superadmin or is_admin):
                    return {"message": "Only Superadmin or Admin can add new members"}, 403
                hashuploadKey = UploadKey + '-hashed'
                created = db.insert_team_member(
                    Username=Username,
                    FullName=FullName,
                    Bio=Bio,
                    ProfilePicture=ProfilePicture or '#',
                    UploadKey=hashuploadKey or '',
                    Email=Email,
                    AddedBy=current_username,
                    Role=Role,
                    Status='Active'
                )
                if not created:
                    return {"message": "Failed to add member"}, 500

                source = os.path.join(UPLOAD_BASE, 'team', UploadKey)
                target = os.path.join(UPLOAD_BASE, 'team', hashuploadKey)
                if os.path.exists(source):
                    os.rename(source, target)
                
                if SocialLinks and isinstance(SocialLinks, list):
                    TeamMemberID = db.get_member_id(Username)
                    deleted = db.delete_social_links("TeamMember", TeamMemberID['TeamMemberID'])
                    if deleted:
                        for link in SocialLinks:
                            if not isinstance(link, dict):
                                return {"message": "Invalid social link structure"}, 400

                            platform = s.sanitize_alphanum(link.get("Platform", "").strip())
                            url = s.sanitize_url(link.get("URL", "").strip())

                            if not platform or not url:
                                return {"message": "Invalid Platform Name or URL"}, 400

                            db.insert_social_link("TeamMember", TeamMemberID['TeamMemberID'], platform, url)

                return make_response(jsonify({"message": "Member added successfully"}), 201)

            return {"message": "Unsupported action"}, 400

        except Exception:
            traceback_str = traceback.format_exc()
            app.logger.error(f"[TeamMgmt:POST] Error: {traceback_str}")
            return make_response(jsonify({
                "message": "Failed to process team member",
                "details": traceback_str
            }), 500)
