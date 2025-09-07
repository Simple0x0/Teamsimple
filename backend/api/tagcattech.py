import traceback
from flask import jsonify, make_response, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from core.extensions import db
from utils.utils import validate_input_data
from utils.serializable_resource import SerializableResource


# ===== Tags, Categories and TechStacks API =====
class TagCategoryTechStack(SerializableResource):
    def get(self):
        try:
            data_type = request.args.get("type", "").lower()

            if data_type == "category":
                records = db.get_all_categories()
            elif data_type == "tag":
                records = db.get_all_tags()
            elif data_type == "techstack":
                records = db.get_all_techstack()
            else:
                return make_response(jsonify({"error": "Invalid type specified"}), 400)

            return make_response(jsonify({
                "type": data_type,
                "data": records
            }), 200)

        except Exception as e:
            print(f"[MetaDataManager:GET] Error: {traceback.format_exc()}")
            return make_response(jsonify({
                "error": "Internal server error",
                "message": str(e)
            }), 500)

    @jwt_required()
    def post(self):
        try:
            data = request.get_json(force=True)
            data_type = data.get("type", "").lower()
            is_valid, result = validate_input_data(data_type, data)
            if not is_valid:
                return make_response(jsonify({"error": result}), 400)

            name = result["name"]
            if result.get("description"):
                description = result.get("description")

            if data_type == "category":
                db.add_category(name, description)
                records = db.get_category(name)
            elif data_type == "tag":
                db.add_tags(name) 
                records = db.get_tag(name)
            elif data_type == "techstack":
                db.add_techstack(name, description)
                records = db.get_techstack(name)
            else:
                return make_response(jsonify({"error": "Invalid type specified"}), 400)

            return make_response(jsonify({
                "message": f"{data_type.capitalize()} added successfully",
                "data": records
            }), 201)

        except Exception as e:
            print(f"[MetaDataManager:POST] Error: {traceback.format_exc()}")
            return make_response(jsonify({
                "error": "Internal server error",
                "message": str(e)
            }), 500)
