import os
from flask import current_app as app
from flask import request, jsonify, make_response
from flask_jwt_extended import jwt_required, get_jwt_identity
from core.extensions import db, s
import traceback
from utils.auth import passwordhash, passwordcheck
from utils.serializable_resource import SerializableResource


def credential_mgmt(username: str, password: str, action: str = 'reset', memberid: int = None, first_login: bool = False):
    # USERNAME & PASSWORD ARE SANITIZED BEFORE PASSING THEM HERE
    try:
        

        if action == 'create':
            passhash = passwordhash(password=password)
            if memberid is None:
                app.logger.error("[Credential Mgmt] Error: memberid is required for 'create' action.")
                return False

            db.create_new_login(
                username=username,
                password_hash=passhash,
                team_member_id=memberid
            )
            return True

        elif action == 'reset':
            passhash = passwordhash(password=password)
            db.update_password_by_username(
                username=username,
                password_hash=passhash,
                is_first_login=first_login
            )
            return True

        app.logger.error(f"[Credential Mgmt] Error: Invalid action '{action}'")
        return False

    except Exception:
        traceback_str = traceback.format_exc()
        app.logger.error(f"[Credential Mgmt] Exception: {traceback_str}")
        return False


# ===== Password Manager API =====
class PasswordMgmt(SerializableResource):
    @jwt_required()
    def post():
        try:
            data = request.get_json(force=True)
            action = data.get("action", "reset").lower() #reset, recover
            
            current_username = get_jwt_identity()
            user = db.get_user_login(current_username)
            current_role = db.get_member_role(current_username)
            
            
            if action == 'reset':
                password = data.get("passwords", {})
                old_pass = s.sanitize_password(password.get('old'))
                new_pass = s.sanitize_password(password.get('new'))
                
                if not (user and passwordcheck(old_pass, user["PasswordHash"])):
                    return {"message": "Invalid password"}, 401

                reset = credential_mgmt(
                    username=current_username,
                    password=new_pass,
                    action='reset',
                    memberid=None,
                    first_login=True
                )

                if reset:
                    return {'message': 'Password successfully reset'}
                
            elif action == 'recover' and current_role.get("Role") == "Superadmin":
                member = data.get("member", {})
                username = s.sanitize_username(member.get("Username"))
                new_pass = s.sanitize_password(member.get('Password')) if member.get('Password') else os.getenv('MEMBER_DEFAULT_PASSWORD')
                memberid = db.get_member_id(username=username)
                
                if not memberid['TeamMemberID']:
                    return {"message": "Invalid password"}, 401
                
                reset = credential_mgmt(
                    username=username,
                    password=new_pass,
                    action='reset',
                    memberid=None
                )

                if reset:
                    return {'message': 'Password successfully reset'}
            
        except Exception:
            traceback_str = traceback.format_exc()
            app.logger.error(f"[ContributorMgmt:POST] Error: {traceback_str}")
            return {"message": "Internal server error"}, 500
    
    
    
