import traceback
from flask import jsonify, make_response
from flask_jwt_extended import jwt_required
from core.extensions import db, SLEEP
from utils.serializable_resource import SerializableResource

# ===== Total Visitor Count API =====
class TotalVisitors(SerializableResource):
    @jwt_required()
    def get(self):
        try:
            counts = db.get_totalvisitors()
            total = counts['total_visitors'] or 0
            last_30 = counts['last_30_days'] or 0
            last_30_60 = counts['last_30_60_days'] or 0

            if last_30_60 == 0:
                change = 100 if last_30 > 0 else 0
            else:
                change = ((last_30 - last_30_60) / last_30_60) * 100
            response = {
                'authenticated': True,
                'TVisitors': {
                    'total': total,
                    'last_30_days': last_30,
                    'last_30_60_days': last_30_60,
                    'change': round(change, 2)
                }
            }
            return make_response(jsonify(response), 200)
        except Exception as e:
            print(f"[TotalVisitors] Error: {traceback.format_exc()}")
            return {"message": "Internal server error"}, 500
