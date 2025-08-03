import traceback
from flask import jsonify, make_response
from flask_jwt_extended import jwt_required
from time import sleep
from core.extensions import db, SLEEP
from utils.utils import flatten_contributor
from utils.serializable_resource import SerializableResource

# ===== Quick Analytics API =====
class QuickAnalytics(SerializableResource):
    @jwt_required()
    def get(self):
        try:
            quickanalytics = db.get_quickanalytics()
            sleep(SLEEP)
            return make_response(jsonify(authenticated=True, quickanalytics=quickanalytics), 200)
        except Exception as e: 
            print(f"[QuickAnalytics] Error: {traceback.format_exc()}")
            return {"message": "Internal server error"}, 500
