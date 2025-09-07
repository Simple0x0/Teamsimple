from flask_restful import Resource, Api, reqparse
from datetime import  datetime

# ===== Shared Base Resource =====
class SerializableResource(Resource):
    
    @staticmethod
    def serialize_row(row):
        return {
            k: (v.isoformat() if isinstance(v, datetime) else v)
            for k, v in row.items()
        }

    @classmethod
    def serialize_rows(cls, rows):
        return [cls.serialize_row(row) for row in rows]
    
