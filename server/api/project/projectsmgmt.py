import os
import traceback
from flask import current_app as app
from flask import request, jsonify, make_response
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from core.extensions import db, s, UPLOAD_BASE, CONTENT_STATUS, PROJECT_PROGRESS_STATUS
from utils.utils import generate_slug, validate_fingerprint_value
from utils.serializable_resource import SerializableResource
from pprint import pprint

# ===== Projects Management API =====
class ProjectsMgmt(SerializableResource):
    @jwt_required()
    def get(self):
        try:
            fingerprint = request.args.get('f')
            if fingerprint:
                valide, msg = validate_fingerprint_value(fingerprint)
                if not valide:
                    return {"message": msg}, 404
            projects = db.get_projects(fingerprint)
            if not projects:
                return {"message": "Projects are not yet Available"}, 404
            # Filter and serialize only published projects
            published_projects = []
            for project_row in projects:
                serialized_project = self.serialize_row(project_row)
                status = serialized_project.get("Status", "").strip()
                if status not in ['Deleted']:
                    published_projects.append(serialized_project)

            # Return the filtered list with a 200 OK HTTP response
            return {"Projects": published_projects}, 200

        except Exception:
            app.logger.error(f"Error in GET /api/projects: {traceback.format_exc()}")
            return {"message": "Internal server error"}, 500


    @jwt_required()
    def post(self):
        try:
            data = request.get_json(force=True)
            action = data.get("action", "new").lower()
            del_project = data.get("project", {})
            pprint(del_project)
            if action == "delete":
                ProjectID_raw = del_project.get("ProjectID")
                Reason_raw = del_project.get("Reason", "")
                if not ProjectID_raw:
                    return {"error": "Please specify Project for deletion"}, 400

                ProjectID = s.sanitize_id(ProjectID_raw)
                reason = s.sanitize_summary(Reason_raw)
                Username = get_jwt_identity()
                
                if not reason:
                    return {"error": "Provide a reason of deletion"}, 400
                
                project_info = db.get_project_slug(ProjectID)
                if not project_info:
                    return make_response(jsonify({"message": "Project not found or already deleted"}), 404)

                db.delete_project(ProjectID, project_info['Slug'], Username, reason)
                return make_response(jsonify({"message": "Project successfully deleted"}), 201)
            
            
            submission_type = data.get("submissionType", "draft").lower()
            raw_project = data.get("project", {})
            pprint(raw_project)
            ProjectID = s.sanitize_id(raw_project.get("ProjectID", ''))
            Title = s.sanitize_title(raw_project.get("Title"))
            Slug = s.sanitize_slug(raw_project.get("Slug"))
            EndDate = s.sanitize_date(raw_project.get("EndDate"))
            RepoURL = s.sanitize_url(raw_project.get('RepoURL'))
            DemoURL = s.sanitize_url(raw_project.get("DemoURL"))
            ProgressPercentage = s.sanitize_id(raw_project.get("ProgressPercentage", '%'))
            ProgressStatus = s.sanitize_title(raw_project.get("ProgressStatus"))
            StartDate = s.sanitize_date(raw_project.get("StartDate"))
            CoverImage = s.sanitize_image_path(raw_project.get("CoverImage"))
            Description = s.sanitize_summary(raw_project.get("Description"))
            Content = s.sanitize_content(raw_project.get("Content"))
            CategoryID = s.sanitize_id(raw_project.get("CategoryID", ''))
            Contributors = s.sanitize_list(raw_project.get("Contributors"))
            Tags = s.sanitize_list(raw_project.get("Tags"))
            UploadKey = s.sanitize_upload_key(raw_project.get("UploadKey"))
            
            # Required field check
            required = [
                ("Title", Title),
                ("Slug", Slug),
                ("ProgressStatus", ProgressStatus),
                ("StartDate", StartDate),
                ("Content", Content),
                ("Description", Description),
                ("CoverImage", CoverImage),
                ("ProgressPercentage", ProgressPercentage),
                ("CategoryID", CategoryID),
                ("Contributors", Contributors),
                ("UploadKey", UploadKey)
            ]

            missing_fields = [name for name, value in required if value in (None, '')]

            if missing_fields:
                return { "error": f"Missing or invalid project fields: {', '.join(missing_fields)}" }, 400


            ProgressStatus = ProgressStatus.title()
            if ProgressStatus not in PROJECT_PROGRESS_STATUS:
                return {"error": "Invalid project progress Status"}, 400
            
            # Status logic
            if submission_type == "publish":
                Status = "Published"
            elif submission_type == "schedule":
                Status = "Scheduled"
            else:
                Status = "Draft"

            if action == "edit" and ProjectID:
                success = db.update_project(
                    ProjectID=ProjectID,
                    Title=Title,
                    Content=Content,
                    Description=Description,
                    StartDate=StartDate,
                    EndDate=EndDate,
                    Status=Status,
                    RepoURL=RepoURL,
                    DemoURL=DemoURL,
                    CategoryID=CategoryID,
                    ProgressPercentage=ProgressPercentage,
                    ProgressStatus=ProgressStatus,
                    CoverImage=CoverImage,
                )
                if not success:
                    return make_response(jsonify({"error": "Failed to update project"}), 500)

                db.delete_project_tag(ProjectID)
                db.delete_project_contributor(ProjectID)

                for tag in Tags:
                    tag_obj = db.get_tag(tag)
                    if tag_obj and 'TagID' in tag_obj:
                        db.insert_project_tag(ProjectID, tag_obj['TagID'])

                for contributor in Contributors:
                    contributorID = db.get_contributor_id(contributor)
                    if contributorID:
                        db.insert_project_contributor(ProjectID, contributorID['ContributorID'])

                return make_response(jsonify({"message": "Project successfully edited", "ProjectID": ProjectID}), 201)

            elif action == "new":
                Slug = generate_slug(Title)
                hashuploadKey = UploadKey + '-hashed'
                print(Status)
                ProjectID = db.insert_project(
                    Title=Title,
                    EndDate=EndDate,
                    ProgressPercentage=ProgressPercentage,
                    RepoURL=RepoURL,
                    DemoURL=DemoURL,
                    StartDate=StartDate,
                    Content=Content,
                    Description=Description,
                    Status=Status,
                    ProgressStatus=ProgressStatus,
                    CategoryID=CategoryID,
                    CoverImage=CoverImage,
                    Slug=Slug,
                    UploadKey=hashuploadKey,
                )

                if ProjectID:
                    for tag in Tags:
                        Tag = db.get_tag(tag)
                        if Tag:
                            db.insert_project_tag(ProjectID, Tag['TagID'])
                    for Contributor in Contributors:
                        contributorID = db.get_contributor_id(Contributor)
                        if contributorID:
                            db.insert_project_contributor(ProjectID, contributorID['ContributorID'])

                    source = os.path.join(UPLOAD_BASE, 'projects', UploadKey)
                    target = os.path.join(UPLOAD_BASE, 'projects', hashuploadKey)
                    if os.path.exists(source):
                        os.rename(source, target)

                    return make_response(jsonify({"message": "Project successfully published", "ProjectID": ProjectID}), 201)

            return make_response(jsonify({"error": "Unsupported project action"}), 400)

        except Exception:
            app.logger.error(f"[Project:POST] Error: {traceback.format_exc()}")
            return make_response(jsonify({
                "error": "Failed to process project",
                "details": traceback.format_exc()
            }), 500)
