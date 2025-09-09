from flask_restful import Resource
from flask import jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity, create_access_token, set_access_cookies, get_csrf_token

class RefreshToken(Resource):
    @jwt_required(refresh=True)  # Require a valid refresh token
    def post(self):
        # Get the identity from the refresh token
        identity = get_jwt_identity()

        # Create a new access token
        new_access_token = create_access_token(identity=identity)

        # Set the access token in the cookies
        response = jsonify({"msg": "Access token refreshed"})
        set_access_cookies(response, new_access_token)

        # Optionally, add the CSRF token in the headers
        csrf_token = get_csrf_token(new_access_token)
        response.headers["X-CSRF-Token"] = csrf_token

        return response
