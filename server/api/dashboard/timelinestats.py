import traceback
from flask import jsonify, make_response, request
from flask_jwt_extended import jwt_required
from core.extensions import db
from utils.utils import merge_likes_visitors
from utils.serializable_resource import SerializableResource


# ===== Visitors and Likes Timeline API =====
class VisitorLikeTimeLineStats(SerializableResource):
    @jwt_required()
    def post(self):
        try:
            data = request.get_json(force=True)
            timeline = data.get("timeline", "").lower()

            if timeline == 'week':
                likes = db.get_likes_1_week()
                visitors = db.get_visitors_1_week()
            elif timeline == 'month':
                likes = db.get_likes_1_month()
                visitors = db.get_visitors_1_month()
            elif timeline == 'year':
                likes = db.get_likes_1_year()
                visitors = db.get_visitors_1_year()
            else:
                return make_response(jsonify(
                    authenticated=True,
                    error="Invalid timeline value. Expected 'week', 'month', or 'year'."
                ), 400)

            visitors_likes = merge_likes_visitors(likes, visitors, key="date", timeline=timeline)


            return make_response(jsonify(
                authenticated=True,
                timeline=timeline,
                stats=visitors_likes
            ), 200)

        except Exception as e:
            print(f"[VisitorLikeTimeLineStats] Error: {traceback.format_exc()}")
            return make_response(jsonify(
                authenticated=False,
                message="Internal server error",
                error=str(e)
            ), 500)

