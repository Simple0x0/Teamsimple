import traceback
from flask import request, jsonify, make_response
from flask_jwt_extended import create_access_token, set_access_cookies
from datetime import datetime
from core.extensions import db, s, UPLOAD_BASE, SLEEP
from utils.auth import passwordcheck
from utils.serializable_resource import SerializableResource



# ===== Login API =====
#@limiter.limit("5 per minute")
class Login(SerializableResource):
    def post(self):
        try:
            data = request.get_json(force=True)
            username = s.sanitize_alphanum(data.get('username')).lower()
            password = s.sanitize_password(data.get('password'))

            if not username or not password:
                return {"message": "Invalid username or password"}, 400

            user = db.get_user_login(username)
            if not (user and passwordcheck(password, user["PasswordHash"])):
                return {"message": "Invalid username or password"}, 401

            db.update_last_login(user['LoginID'], datetime.utcnow())
            access_token = create_access_token(identity=str(user['Username']))
            response = make_response({
                "message": "Login successful",
                #"csrf_token": get_csrf_token(access_token)
            })
            set_access_cookies(response, access_token)
            
            return response

        except Exception as e:
            print(f"[Login API] Error: {traceback.format_exc()}")
            return {"message": "Internal server error"}, 500
