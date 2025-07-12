import os
import traceback
from flask import current_app as app
from flask import request, jsonify, make_response
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime
from core.extensions import db, s, UPLOAD_BASE
from utils.utils import generate_slug, validate_fingerprint_value
from utils.serializable_resource import SerializableResource
from pprint import pprint

# ===== PodcastMgmt API =====
class PodcastMgmt(SerializableResource):
    #@jwt_required()
    def get(self):
        try:
            fingerprint = request.args.get('f')
            if fingerprint:
                valid, msg = validate_fingerprint_value(fingerprint)
                if not valid:
                    return {"message": msg}, 404

            podcasts = db.get_podcasts(fingerprint)
            if not podcasts:
                return {"message": "Podcasts are not yet Available"}, 404

            podcasts_list = [podcast for podcast in [self.serialize_row(p) for p in podcasts] if podcast.get("Status") != "Deleted"]
            return {"Podcasts": podcasts_list}, 200

        except Exception:
            app.logger.error(f"Error in GET /api/podcasts: {traceback.format_exc()}")
            return {"message": "Internal server error"}, 500

    @jwt_required()
    def post(self):
        try:
            data = request.get_json(force=True)
            action = data.get("action", "new").lower()
            del_podcast = data.get("podcast", {})

            if action == "delete":
                PodcastID_raw = del_podcast.get("PodcastID")
                Reason_raw = del_podcast.get("Reason", "")
                if not PodcastID_raw:
                    return {"error": "Please specify Podcast for deletion"}, 400

                PodcastID = s.sanitize_id(PodcastID_raw)
                reason = s.sanitize_alphanum(Reason_raw)
                Username = get_jwt_identity()

                if not reason:
                    return {"error": "Provide a reason for deletion"}, 400

                podcast_info = db.get_podcast_slug(PodcastID)
                if not podcast_info:
                    return make_response(jsonify({"message": "Podcast not found or already deleted"}), 404)

                db.delete_podcast(PodcastID, podcast_info['Slug'], Username, reason)
                return make_response(jsonify({"message": "Podcast successfully deleted"}), 201)

            submission_type = data.get("submissionType", "draft").lower()
            raw_podcast = data.get("podcast", {})

            PodcastID = s.sanitize_id(raw_podcast.get("PodcastID"))
            Title = s.sanitize_title(raw_podcast.get("Title"))
            Slug = s.sanitize_slug(raw_podcast.get("Slug"))
            Description = s.sanitize_summary(raw_podcast.get("Description"))
            Content = s.sanitize_content(raw_podcast.get("Content"))
            CoverImage = s.sanitize_image_path(raw_podcast.get("CoverImage"))
            Duration = s.sanitize_id(raw_podcast.get("Duration"))
            EpisodeNumber = s.sanitize_id(raw_podcast.get("EpisodeNumber"))
            AudioURL = s.sanitize_url(raw_podcast.get("AudioURL"))
            DatePublished = s.sanitize_date(raw_podcast.get("DatePublished"))
            CategoryID = s.sanitize_id(raw_podcast.get("CategoryID"))
            UploadKey = s.sanitize_upload_key(raw_podcast.get("UploadKey"))

            # Required field check
            required = [
                ("Title", Title),
                ("Description", Description),
                ("Content", Content),
                ("CoverImage", CoverImage),
                ("Duration", Duration),
                ("EpisodeNumber", EpisodeNumber),
                ("AudioURL", AudioURL),
                ("DatePublished", DatePublished),
                ("CategoryID", CategoryID),
                ("UploadKey", UploadKey),
            ]

            missing_fields = [name for name, value in required if value in (None, '', 0)]

            if missing_fields:
                return {"error": f"Missing or invalid podcast fields: {', '.join(missing_fields)}"}, 400

            # Status logic
            if submission_type == "publish":
                Status = "Published"
            elif submission_type == "schedule":
                Status = "Scheduled"
            else:
                Status = "Draft"

            if action == "edit" and PodcastID:
                success = db.update_podcast(
                    PodcastID=PodcastID,
                    Title=Title,
                    Description=Description,
                    Content=Content,
                    CoverImage=CoverImage,
                    Duration=Duration,
                    EpisodeNumber=EpisodeNumber,
                    AudioURL=AudioURL,
                    DatePublished=DatePublished,
                    CategoryID=CategoryID,
                    Status=Status
                )
                if not success:
                    return make_response(jsonify({"error": "Failed to update podcast"}), 500)

                db.delete_podcast_speakers(PodcastID)
                speakers = raw_podcast.get("Contributors", [])
                for speaker in speakers:
                    contributorID = db.get_contributor_id(speaker)
                    if contributorID:
                        db.insert_podcast_speaker(PodcastID, contributorID['ContributorID'])

                return make_response(jsonify({"message": "Podcast successfully edited", "PodcastID": PodcastID}), 201)

            elif action == "new":
                Slug = generate_slug(Title)
                hashuploadKey = UploadKey + '-hashed'

                PodcastID = db.insert_podcast(
                    Title=Title,
                    Slug=Slug,
                    Description=Description,
                    Content=Content,
                    CoverImage=CoverImage,
                    Duration=Duration,
                    EpisodeNumber=EpisodeNumber,
                    AudioURL=AudioURL,
                    DatePublished=DatePublished,
                    CategoryID=CategoryID,
                    Status=Status,
                    UploadKey=hashuploadKey,
                )

                if PodcastID:
                    speakers = raw_podcast.get("Contributors", [])
                    for speaker in speakers:
                        contributorID = db.get_contributor_id(speaker)
                        if contributorID:
                            db.insert_podcast_speaker(PodcastID, contributorID['ContributorID'])

                    source = os.path.join(UPLOAD_BASE, 'podcasts', UploadKey)
                    target = os.path.join(UPLOAD_BASE, 'podcasts', hashuploadKey)
                    if os.path.exists(source):
                        os.rename(source, target)

                    return make_response(jsonify({"message": "Podcast successfully published", "PodcastID": PodcastID}), 201)

            return make_response(jsonify({"error": "Unsupported podcast action"}), 400)

        except Exception:
            app.logger.error(f"[Podcast:POST] Error: {traceback.format_exc()}")
            return make_response(jsonify({
                "error": "Failed to process podcast",
                "details": traceback.format_exc()
            }), 500)
