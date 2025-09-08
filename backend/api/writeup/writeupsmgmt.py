import os
import traceback
from flask import current_app as app
from flask import request, jsonify, make_response
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from time import sleep
from core.extensions import db, s, UPLOAD_BASE, SLEEP
from utils.utils import generate_slug, validate_fingerprint_value
from utils.serializable_resource import SerializableResource
from pprint import pprint

# ===== WriteUpsMgmt API =====
class WriteUpsMgmt(SerializableResource):
    @jwt_required()
    def get(self):
        try:
            fingerprint = request.args.get('f')
            if fingerprint:
                valide, msg = validate_fingerprint_value(fingerprint)
                if not valide:
                    return {"message": msg}, 404
            writeups = db.get_writeups(fingerprint) or []
            writeups_list = [ writeup for writeup in (self.serialize_row(w) for w in writeups) if writeup.get("Status") != "Deleted" ]
            return {"Writeups": writeups_list}, 200
        except Exception as e:
            app.logger.error(f"Error in GET /api/writeups: {traceback.format_exc()}")
            return {"message": "Internal server error"}, 500
        
    @jwt_required()
    def post(self):
        try:
            data = request.get_json(force=True)
            action = data.get("action", "new").lower()
            del_writeup = data.get("writeUp", {})
            
            if action == "delete":
                WriteUpID_raw = del_writeup.get("WriteUpID")
                Reason_raw = del_writeup.get("Reason", "")
                if not WriteUpID_raw:
                    return {"error": "Please specify WriteUp for deletion"}, 400
                WriteUpID = s.sanitize_id(WriteUpID_raw)
                reason = s.sanitize_alphanum(Reason_raw)
                Username = get_jwt_identity()
                if not reason:
                    return {"error": "Provide a reason of deletion"}, 400
                writeup_info = db.get_writeup_slug(WriteUpID)
                if not writeup_info:
                    return make_response(jsonify({"message": "WriteUp not found or already deleted"}), 404)
                # Always delete the content first
                db.delete_writeup(WriteUpID, writeup_info['Slug'], Username, reason)
                # Then, if scheduled, delete from Schedule
                ScheduleID = db.get_schedule_id("WriteUp", WriteUpID_raw)
                if ScheduleID:
                    db.delete_scheduled_content(ScheduleID)
                return make_response(jsonify({"message": "WriteUp successfully deleted"}), 201)

            
            submission_type = data.get("submissionType", "draft").lower()
            raw_writeup = data.get("writeup", {})

            WriteUpID = s.sanitize_id(raw_writeup.get("WriteUpID"))
            MachineName = s.sanitize_title(raw_writeup.get("MachineName"))
            Slug = s.sanitize_slug(raw_writeup.get("Slug"))
            Difficulty = s.sanitize_difficulty(raw_writeup.get("Difficulty"))
            OsType = s.sanitize_ostype(raw_writeup.get("OsType"))
            IPAddress = s.sanitize_ipaddress(raw_writeup.get("IPAddress"))
            Reference = s.sanitize_url(raw_writeup.get('Reference'))
            Platform = s.sanitize_title(raw_writeup.get("Platform"))
            ToolsUsed = s.sanitize_tool_list(raw_writeup.get("ToolsUsed"))
            BoxCreator = s.sanitize_title(raw_writeup.get("BoxCreator"))
            ReleaseDate = s.sanitize_date(raw_writeup.get("ReleaseDate"))
            WriteUpImage = s.sanitize_image_path(raw_writeup.get("WriteUpImage"))
            Summary = s.sanitize_summary(raw_writeup.get("Summary"))
            Content = s.sanitize_content(raw_writeup.get("Content"))
            CategoryID = s.sanitize_id(raw_writeup.get("CategoryID"))
            Contributors = s.sanitize_list(raw_writeup.get("Contributors"))
            Tags = s.sanitize_list(raw_writeup.get("Tags"))
            UploadKey = s.sanitize_upload_key(raw_writeup.get("UploadKey"))
            
            # Required field check
            required = [
                ("MachineName", MachineName),
                ("Difficulty", Difficulty),
                ("OsType", OsType),
                ("IPAddress", IPAddress),
                ("Reference", Reference),
                ("Platform", Platform),
                ("BoxCreator", BoxCreator),
                ("ReleaseDate", ReleaseDate),
                ("Content", Content),
                ("Summary", Summary),
                ("WriteUpImage", WriteUpImage),
                ("ToolsUsed", ToolsUsed),
                ("CategoryID", CategoryID),
                ("Contributors", Contributors),
                ("UploadKey", UploadKey)
            ]

            missing_fields = [name for name, value in required if value in (None, '')]

            if missing_fields:
                return { "error": f"Missing or invalid writeup fields: {', '.join(missing_fields)}" }, 400


            # Status logic
            if submission_type == "publish":
                Status = "Published"
            elif submission_type == "schedule":
                Status = "Scheduled"
                PublishDate = s.sanitize_date(raw_writeup.get("PublishDate")) or datetime.now()
                
            elif submission_type == "active":
                Status = "Active"
            else:
                Status = "Draft"
            
            if action == "edit" and WriteUpID:
                success = db.update_writeup(
                    WriteUpID=WriteUpID,
                    MachineName=MachineName,
                    Difficulty=Difficulty,
                    OsType=OsType,
                    ToolsUsed=ToolsUsed,
                    IPAddress=IPAddress,
                    Reference=Reference,
                    Platform=Platform,
                    BoxCreator=BoxCreator,
                    ReleaseDate=ReleaseDate,
                    Content=Content,
                    Summary=Summary,
                    Status=Status,
                    CategoryID=CategoryID,
                    WriteUpImage=WriteUpImage,
                )
                if not success:
                    return make_response(jsonify({"error": "Failed to update writeup"}), 500)

                db.delete_writeup_tag(WriteUpID)
                db.delete_writeup_contributor(WriteUpID)

                for tag in Tags:
                    tag_obj = db.get_tag(tag)
                    if tag_obj and 'TagID' in tag_obj:
                        db.insert_writeup_tag(WriteUpID, tag_obj['TagID'])

                for contributor in Contributors:
                    contributorID = db.get_contributor_id(contributor)
                    if contributorID:
                        db.insert_writeup_contributor(WriteUpID, contributorID['ContributorID'])

                return make_response(jsonify({"message": "WriteUp successfully edited", "WriteUpID": WriteUpID}), 201)

            elif action == "new":
                Slug = generate_slug(MachineName)
                hashuploadKey = UploadKey + '-hashed'

                WriteUpID = db.insert_writeup(
                    MachineName=MachineName,
                    Difficulty=Difficulty,
                    OsType=OsType,
                    ToolsUsed=ToolsUsed,
                    IPAddress=IPAddress,
                    Reference=Reference,
                    Platform=Platform,
                    BoxCreator=BoxCreator,
                    ReleaseDate=ReleaseDate,
                    Content=Content,
                    Summary=Summary,
                    Status=Status,
                    CategoryID=CategoryID,
                    WriteUpImage=WriteUpImage,
                    Slug=Slug,
                    UploadKey=hashuploadKey,
                )

                if WriteUpID:
                    for tag in Tags:
                        Tag = db.get_tag(tag)
                        if Tag:
                            db.insert_writeup_tag(WriteUpID, Tag['TagID'])
                    for Contributor in Contributors:
                        contributorID = db.get_contributor_id(Contributor)
                        if contributorID:
                            db.insert_writeup_contributor(WriteUpID, contributorID['ContributorID'])

                    source = os.path.join(UPLOAD_BASE, 'writeups', UploadKey)
                    target = os.path.join(UPLOAD_BASE, 'writeups', hashuploadKey)
                    if os.path.exists(source):
                        os.rename(source, target)

                    # --- SCHEDULE LOGIC ---
                    # Always fetch ScheduleID for this WriteUp
                    schedule_id = db.get_schedule_id("WriteUp", WriteUpID)
                    if Status == "Scheduled":
                        db.insert_scheduled_content("WriteUp", WriteUpID, PublishDate)
                    elif schedule_id:
                        db.delete_scheduled_content(schedule_id)

                    return make_response(jsonify({"message": "WriteUp successfully published", "WriteUpID": WriteUpID}), 201)

            return make_response(jsonify({"error": "Unsupported writeup action"}), 400)

        except Exception:
            app.logger.error(f"[WriteUp:POST] Error: {traceback.format_exc()}")
            return make_response(jsonify({
                "error": "Failed to process writeup",
                "details": traceback.format_exc()
            }), 500)
