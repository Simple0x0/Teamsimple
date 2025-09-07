#!/usr/bin/env python3

import os
from dotenv import load_dotenv
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_restful import Api
from datetime import timedelta
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from core.extensions import bcrypt, jwt
from flask_jwt_extended import get_csrf_token
import logging
from logging.handlers import RotatingFileHandler

# ===== Load environment variables =====
load_dotenv()

# ===== Initialize Flask App =====
app = Flask(__name__)
api = Api(app)
CORS(
    app, 
    supports_credentials=True, 
    resources={r"/api/*": {"origins": [os.getenv("CLIENT_URL")]}}
)

# ===== Logging Configuration =====
LOG_LEVEL = logging.DEBUG if app.debug else logging.INFO
LOG_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), "logs")
LOG_FILE = os.path.join(LOG_DIR, "app.log")
os.makedirs(LOG_DIR, exist_ok=True)

formatter = logging.Formatter(
    "[%(asctime)s] %(levelname)s in %(module)s: %(message)s",
    datefmt="%Y-%m-%d %H:%M:%S"
)

# Console logging
console_handler = logging.StreamHandler()
console_handler.setLevel(LOG_LEVEL)
console_handler.setFormatter(formatter)

# Rotating file logging
file_handler = RotatingFileHandler(LOG_FILE, maxBytes=10*1024*1024, backupCount=5)
file_handler.setLevel(LOG_LEVEL)
file_handler.setFormatter(formatter)

# Clear existing handlers and apply new ones
for handler in app.logger.handlers[:]:
    app.logger.removeHandler(handler)

app.logger.addHandler(console_handler)
app.logger.addHandler(file_handler)
app.logger.setLevel(LOG_LEVEL)

# Request logging
@app.before_request
def log_request_info():
    app.logger.info(f"{request.remote_addr} {request.method} {request.path}")

# ===== Flask Configurations =====
app.config.update({
    "SECRET_KEY": os.getenv("SECRET_KEY"),
    "JWT_SECRET_KEY": os.getenv("JWT_SECRET_KEY"),
    "JWT_TOKEN_LOCATION": ["cookies"],
    "JWT_COOKIE_SECURE": True,  # HTTPS only
    "JWT_COOKIE_CSRF_PROTECT": True,
    "JWT_ACCESS_COOKIE_PATH": "/api",
    "JWT_ACCESS_TOKEN_EXPIRES": timedelta(days=1),
    "JWT_ACCESS_COOKIE_NAME": "access_token",
    "JWT_COOKIE_SAMESITE": "Strict",
    "MAX_CONTENT_LENGTH": 150 * 1024 * 1024  # 150 MB
})

# ===== Initialize Extensions =====
bcrypt.init_app(app)
jwt.init_app(app)

# ===== Rate Limiter (Redis recommended) =====
limiter = Limiter(
    app,
    key_func=get_remote_address,
    default_limits=["200/day", "50/hour"]
)

# ===== JWT Error Handlers =====
@jwt.expired_token_loader
def expired_token_callback(jwt_header, jwt_payload):
    return jsonify({"error": True, "message": "Your session has expired. Please log in again."}), 401

@jwt.invalid_token_loader
def invalid_token_callback(error):
    return jsonify({"error": True, "message": "Invalid token."}), 422

@jwt.unauthorized_loader
def missing_token_callback(error):
    return jsonify({"error": True, "message": "Authorization token is missing."}), 401

@jwt.revoked_token_loader
def revoked_token_callback(jwt_header, jwt_payload):
    return jsonify({"error": True, "message": "Token has been revoked."}), 401

# ===== Global Error Handler =====
@app.errorhandler(Exception)
def handle_exception(e):
    app.logger.error(f"Unhandled Exception: {str(e)}", exc_info=True)
    return jsonify({"error": True, "message": "Internal server error"}), 500

@app.after_request
def add_csrf_token(response):
    if "access_token" in request.cookies:
        csrf_token = get_csrf_token()  # generates the token for current access cookie
        response.set_cookie("csrf_access_token", csrf_token, secure=True, samesite="Strict")
    return response

# ===== Endpoint Registration =====
from api.home_latest import HomeLatest
from api.blog.blogs import Blogs
from api.writeup.writeups import WriteUps
from api.project.projects import Projects
from api.podcast.podcasts import Podcasts
from api.imagerender import ImageRenderer
from api.achievement.achievements import Achievements
from api.event.events import Events
from api.fingerprint import Fingerprint
from api.likes import Like
from api.latest import Latest
from api.contributor.contributors import Contributor
from api.login import Login
from api.logout import Logout
from api.authverify import AuthVerify
from api.dashboard.quickanalytics import QuickAnalytics
from api.dashboard.totalvisitors import TotalVisitors
from api.dashboard.toplikes import TopLikes
from api.dashboard.timelinestats import VisitorLikeTimeLineStats
from api.tagcattech import TagCategoryTechStack
from api.uploads import Uploads
from api.contributor.contributorsmgmt import ContributorsMgmt
from api.blog.blogsmgmt import BlogsMgmt
from api.writeup.writeupsmgmt import WriteUpsMgmt
from api.project.projectsmgmt import ProjectsMgmt
from api.podcast.podcastsmgmt import PodcastMgmt
from api.achievement.achievementmgmt import AchievementMgmt
from api.team.member import MemberInfo
from api.team.teammgmt import TeamMgmt
from api.team.loginmgmt import PasswordMgmt
from api.aboutteam.aboutteammgmt import AboutTeamMgmt
from api.event.eventsmgmt import EventsMgmt
from api.event.eventparticipant import EventParticipants
from api.contact.platformcontact import PlatformContacts
from api.dashboard.schedulcontent import ScheduledContent

# ----- API Endpoints -----
api.add_resource(HomeLatest, '/api/home_latest')
api.add_resource(Blogs, '/api/blogs')
api.add_resource(WriteUps, '/api/writeups')
api.add_resource(Projects, '/api/projects')
api.add_resource(Podcasts, '/api/podcasts')
api.add_resource(Achievements, '/api/achievements')
api.add_resource(Events, '/api/events')
api.add_resource(Fingerprint, '/api/fingerprint')
api.add_resource(Like, '/api/like')
api.add_resource(Latest, '/api/latest')
api.add_resource(Contributor, '/api/contributors')
api.add_resource(ImageRenderer, '/api/files/<string:dir_name>/<string:slug>/<string:filename>')
api.add_resource(ScheduledContent, '/api/scheduledcontents')
api.add_resource(limiter.limit("5/minute")(Login), '/api/auth/login')
api.add_resource(Logout, '/api/auth/logout')
api.add_resource(AuthVerify, '/api/auth/verify')
api.add_resource(QuickAnalytics, '/api/auth/quickanalytics')
api.add_resource(TotalVisitors, '/api/auth/tvisitors')
api.add_resource(TopLikes, '/api/auth/toplikes')
api.add_resource(VisitorLikeTimeLineStats, '/api/auth/visitorslikes')
api.add_resource(TagCategoryTechStack, '/api/tagscattech')
api.add_resource(limiter.limit("100/hour")(Uploads), '/api/uploads/<string:file_type>/<string:dir_name>/<string:UploadKey>')
api.add_resource(limiter.limit("20/minute")(ContributorsMgmt), '/api/auth/contributorsmgmt')
api.add_resource(limiter.limit("20/minute")(BlogsMgmt), '/api/auth/blogsmgmt')
api.add_resource(limiter.limit("20/minute")(WriteUpsMgmt), '/api/auth/writeupsmgmt')
api.add_resource(limiter.limit("20/minute")(ProjectsMgmt), '/api/auth/projectsmgmt')
api.add_resource(limiter.limit("20/minute")(PodcastMgmt), '/api/auth/podcastmgmt')
api.add_resource(limiter.limit("20/minute")(AchievementMgmt), '/api/auth/achievementmgmt')
api.add_resource(limiter.limit("20/minute")(MemberInfo), '/api/auth/memberinfo')
api.add_resource(limiter.limit("20/minute")(TeamMgmt), '/api/auth/teammgmt')
api.add_resource(limiter.limit("20/minute")(AboutTeamMgmt), '/api/auth/aboutteam')
api.add_resource(limiter.limit("20/minute")(PasswordMgmt), '/api/auth/passwordmgmt')
api.add_resource(limiter.limit("20/minute")(EventsMgmt), '/api/auth/eventsmgmt')
api.add_resource(EventParticipants, '/api/auth/eventsmgmt/participants/<string:event_id>')
api.add_resource(PlatformContacts, '/api/contacts')

# ===== Info =====
app.logger.info("Flask app ready for production. Serve with Gunicorn behind HTTPS/Nginx.")


# gunicorn -w 4 -b 0.0.0.0:5000 'app:app'


