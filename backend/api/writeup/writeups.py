import os
import traceback
from flask import current_app as app
from flask import request
from core.extensions import db
from utils.utils import validate_fingerprint_value
from utils.serializable_resource import SerializableResource

# ===== WriteUps API =====
class WriteUps(SerializableResource):
    def get(self):
        try:
            fingerprint = request.args.get('f')
            if fingerprint:
                valide, msg = validate_fingerprint_value(fingerprint)
                if not valide:
                    return {"message": msg}, 404

            writeups = db.get_writeups(fingerprint)
            if not writeups:
                return {"message": "WriteUps are not yet Available"}, 404

            serialized_list = []
            for w in writeups:
                writeup = self.serialize_row(w)
                if writeup.get("Status") == "Active":
                    writeup.pop("Content", None)  # Remove Content if Private
                if writeup.get("Status") != "Published":
                    continue
                serialized_list.append(writeup)

            return {"Writeups": serialized_list}, 200

        except Exception:
            app.logger.error(f"Error in GET /api/writeups: {traceback.format_exc()}")
            return {"message": "Internal server error"}, 500

        