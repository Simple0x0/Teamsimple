import traceback
from flask import jsonify, make_response, current_app as app
from core.extensions import db
from utils.serializable_resource import SerializableResource
from query import HOME_LATEST_CONTENT_QUERY

class HomeLatest(SerializableResource):
    def get(self):
        try:
            results = db.execute(HOME_LATEST_CONTENT_QUERY, fetchall=True)
            return make_response(jsonify({
                "success": True,
                "home_latest": results
            }), 200)
        except Exception as e:
            app.logger.error(traceback.format_exc())
            return make_response(jsonify({
                "success": False,
                "message": str(e)
            }), 500)
