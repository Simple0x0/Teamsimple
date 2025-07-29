import os
import traceback
from flask import request, jsonify, make_response, current_app as app
from flask_jwt_extended import jwt_required, get_jwt_identity
from core.extensions import db, s
from utils.auth import passwordhash, passwordcheck
from utils.serializable_resource import SerializableResource
from pprint import pprint

def credential_mgmt(username: str, password: str, action: str = 'reset', memberid: int = None, first_login: bool = False):
    try:
        if action == 'create':
            if memberid is None:
                app.logger.error("[Credential Mgmt] Error: memberid is required for 'create' action.")
                return False

            passhash = passwordhash(password=password)
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
        app.logger.error("[Credential Mgmt] Exception:\n%s", traceback.format_exc())
        return False


# ===== Password Manager API =====
class PasswordMgmt(SerializableResource):
    @jwt_required()
    def post(self):
        try:
            data = request.get_json(force=True)
            action = data.get("action", "reset").lower()  # 'reset' or 'recover'
            pprint(data)
            current_username = get_jwt_identity()
            user = db.get_user_login(current_username)
            current_role = db.get_member_role(current_username)
            
            # ==== RESET own password ====
            if action == 'reset':
                password = data.get("passwords", {})
                old_pass = s.sanitize_password(password.get('old'))
                new_pass = s.sanitize_password(password.get('new'))

                if not old_pass or not new_pass:
                    return {"message": "Password fields are required"}, 400

                if not (user and passwordcheck(old_pass, user["PasswordHash"])):
                    app.logger.warning(f"[PasswordMgmt] Invalid current password for user: {current_username}")
                    return {"message": "Invalid current password"}, 401
                
                if (passwordcheck(new_pass, user["PasswordHash"]) or (new_pass == os.getenv('MEMBER_DEFAULT_PASSWORD'))):
                    return {"message": "Password must not be reused"}, 400


                reset = credential_mgmt(
                    username=current_username,
                    password=new_pass,
                    action='reset',
                    first_login=False  
                )

                if reset:
                    app.logger.info(f"[PasswordMgmt] Password reset for user: {current_username}")
                    return {'message': 'Password reset successfully'}
                else:
                    return {'message': 'Password reset failed'}, 500

            # ==== RECOVER password for another user (Superadmin only) ====
            elif action == 'recover' and current_role.get("Role") == "Superadmin":
                member = data.get("member", {})
                username = s.sanitize_username(member.get("Username"))

                new_pass = s.sanitize_password(member.get('Password')) if member.get('Password') \
                           else os.getenv('MEMBER_DEFAULT_PASSWORD')

                memberid = db.get_member_id(username=username)

                if not memberid or not memberid.get('TeamMemberID'):
                    app.logger.warning(f"[PasswordMgmt] Invalid member for password recovery: {username}")
                    return {"message": "Invalid user for recovery"}, 404

                reset = credential_mgmt(
                    username=username,
                    password=new_pass,
                    action='reset',
                    memberid=None,
                    first_login=True  # Enforce password change after recovery
                )

                if reset:
                    app.logger.info(f"[PasswordMgmt] Password recovered for user: {username}")
                    return {'message': 'Password successfully reset'}
                else:
                    return {'message': 'Password recovery failed'}, 500

            else:
                return {"message": "Invalid action or insufficient permissions"}, 403

        except Exception:
            app.logger.error(f"[PasswordMgmt:POST] Exception:\n{traceback.format_exc()}")
            return {"message": "Internal server error"}, 500

