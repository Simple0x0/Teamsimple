import traceback
from flask import request, make_response, current_app as app
from flask_jwt_extended import create_access_token, set_access_cookies
from datetime import datetime
from core.extensions import db, s
from utils.auth import passwordcheck
from utils.serializable_resource import SerializableResource
from pprint import pprint

# ===== Login API =====
@limiter.limit("5 per minute")
class Login(SerializableResource):
    def post(self):
        try:
            data = request.get_json(force=True)
            username = s.sanitize_alphanum(data.get('username')).lower()
            password = s.sanitize_password(data.get('password'))

            if not username or not password:
                app.logger.warning(f"[Login] Missing username or password from input: {data}")
                return {"message": "Invalid username or password"}, 400

            user = db.get_user_login(username)
            if not (user and passwordcheck(password, user["PasswordHash"])):
                app.logger.warning(f"[Login] Failed login attempt for username: {username}")
                return {"message": "Invalid username or password"}, 401

            # Successful login
            db.update_last_login(user['LoginID'], datetime.utcnow())
            access_token = create_access_token(identity=str(user['Username']))
            is_first_login = user.get('Isfirstlogin') #COME BACK HERE TO CONFIRM THIS bool OR string

            if is_first_login:
                message = f"Welcome to the team {user['Username']}! Please change your password"
                res = {"message": message, "isFirstLogin": True}
            else:
                message = "Login successful"
                res = {"message": message, "isFirstLogin": False}

            app.logger.info(f"[Login] Successful login for username: {username}")

            response = make_response(res)
            set_access_cookies(response, access_token)

            return response

        except Exception:
            app.logger.error("[Login] Exception:\n%s", traceback.format_exc())
            return {"message": "Internal server error"}, 500




