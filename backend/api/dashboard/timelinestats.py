import datetime
import traceback
from flask import jsonify, make_response, request
from flask_jwt_extended import jwt_required
from core.extensions import db
from utils.utils import merge_likes_visitors
from utils.serializable_resource import SerializableResource
from pprint import pprint 

# ===== Visitors and Likes Timeline API =====
class VisitorLikeTimeLineStats(SerializableResource):
    @jwt_required()
    def get(self):
        try:
            timeline = request.args.get('timeline', 'week').lower()

            if timeline == 'week':
                likes = db.get_likes_1_week()
                visitors = db.get_visitors_1_week()

                # Get the current day of the week
                current_day = datetime.datetime.now().strftime('%a')
                days_order = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

                # Reorder days to ensure the current day is last
                start_index = days_order.index(current_day)
                ordered_days = days_order[start_index + 1:] + days_order[:start_index + 1]

                # Merge and map data to the desired format
                visitors_likes = merge_likes_visitors(likes, visitors, key="date", timeline=timeline)
                stats = []
                for day in ordered_days:
                    day_data = next((item for item in visitors_likes if item['date'] == day), {'date': day, 'likes': 0, 'visitors': 0})
                    stats.append(day_data)

                return make_response(jsonify(
                    authenticated=True,
                    timeline=timeline,
                    stats=stats
                ), 200)

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

