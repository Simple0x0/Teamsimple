import traceback
from time import sleep
from core.extensions import db, s, UPLOAD_BASE, SLEEP
from utils.serializable_resource import SerializableResource

# ===== Latest Contents API =====
class Latest(SerializableResource):
    def get(self):
        try:
            latest = db.get_latest() or []
            return {"Latest": [self.serialize_row(w) for w in latest]}, 200
        except Exception as e:
            print(f"Error in GET /api/latest: {e}")
            return {"message": "Internal server error"}, 500
