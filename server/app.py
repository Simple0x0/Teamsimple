#!/usr/bin/env python3

#======== Importing dependencies and libraries ============
import os
import traceback
from dotenv import load_dotenv
from flask import Flask, jsonify
from core.extensions import bcrypt, jwt
from flask_cors import CORS
from flask_restful import Api
from datetime import timedelta
import logging
from logging.handlers import RotatingFileHandler

# ======== Importing API's ==========
from api.blog.blogs import Blogs
from api.writeup.writeups import WriteUps
from api.project.projects import Projects
from api.podcast.podcasts import Podcasts
from api.imagerender import ImageRenderer
from api.achievement.achievements import Achievements
from api.events import Events
from api.fingerprint import Fingerprint
from api.likes import Like
from api.latest import Latest
from api.contributors import Contributor
from api.login import Login
from api.logout import Logout
from api.authverify import AuthVerify
from api.getmemberinfo import GetMemberInfo
from api.quickanalytics import QuickAnalytics
from api.totalvisitors import TotalVisitors
from api.toplikes import TopLikes
from api.timelinestats import VisitorLikeTimeLineStats
from api.tagcattech import TagCategoryTechStack
from api.uploads import Uploads

from api.contributorsmgmt import ContributorsMgmt
from api.blog.blogsmgmt import BlogsMgmt
from api.writeup.writeupsmgmt import WriteUpsMgmt
from api.project.projectsmgmt import ProjectsMgmt
from api.podcast.podcastsmgmt import PodcastMgmt

# ======= Initialize app and extensions =========
load_dotenv()
app = Flask(__name__)
api = Api(app)
app.app_context()
#CORS(app)
#CORS(app, supports_credentials=True, resources={r"/api/*": {"origins": "*"}})
CORS(app, supports_credentials=True, resources={r"/api/*": {"origins": ["http://localhost:5173", "http://127.0.0.1:5173", "http://192.168.1.31:5173", "https://f242-2001-4278-11-44cd-1d90-1ad1-c7ee-ffca.ngrok-free.app", os.getenv('CLIENT_URL')]}})

# ======= Logging Configuration ============
LOG_LEVEL = logging.DEBUG if app.debug else logging.INFO
LOG_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'logs')
LOG_FILE = os.path.join(LOG_DIR, 'app.log')

# Ensure the log directory exists
os.makedirs(LOG_DIR, exist_ok=True)

# Common formatter
formatter = logging.Formatter(
    '[%(asctime)s] %(levelname)s in %(module)s: %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)

# Console Handler
console_handler = logging.StreamHandler()
console_handler.setLevel(LOG_LEVEL)
console_handler.setFormatter(formatter)

# Rotating File Handler (10 MB per file, keep 5 backups)
file_handler = RotatingFileHandler(LOG_FILE, maxBytes=10 * 1024 * 1024, backupCount=5)
file_handler.setLevel(LOG_LEVEL)
file_handler.setFormatter(formatter)

# Clear existing handlers and apply new ones
for handler in app.logger.handlers[:]:
    app.logger.removeHandler(handler)

app.logger.addHandler(console_handler)
app.logger.addHandler(file_handler)
app.logger.setLevel(LOG_LEVEL)

# ======= App Config ==============
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY')
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY')
app.config['JWT_TOKEN_LOCATION'] = ['cookies']
app.config['JWT_COOKIE_SECURE'] = True  # True in production (HTTPS)
app.config['JWT_COOKIE_CSRF_PROTECT'] = False  # Enable if using CSRF protection
app.config['JWT_ACCESS_COOKIE_PATH'] = '/api'  # Scoped path
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=1)
app.config['JWT_ACCESS_COOKIE_NAME'] = 'access_token'
app.config["JWT_COOKIE_SAMESITE"] = "None"  # 'Lax' in Dev, 'None' with Ngrok Or 'Strict' in prod (if not !same-origin)
#app.config["JWT_ACCESS_CSRF_HEADER_NAME"] = "X-CSRF-TOKEN"
#limiter = Limiter(get_remote_address, app=app) #TO BE ACTIVATED WHEN READY FOR PRODUCTION

# ======= Encryption & Token Initialization =========
bcrypt.init_app(app)
jwt.init_app(app)




# ======= JWT CONFIGS ==============
@jwt.expired_token_loader
def expired_token_callback(jwt_header, jwt_payload):
    return jsonify({ "error": True, "message": "Your session has expired. Please log in again." }), 401

@jwt.invalid_token_loader
def invalid_token_callback(error):
    return jsonify({"error": True, "message": "Invalid token."}), 422

@jwt.unauthorized_loader
def missing_token_callback(error):
    return jsonify({"error": True, "message": "Authorization token is missing."}), 200

@jwt.revoked_token_loader
def revoked_token_callback(jwt_header, jwt_payload):
    return jsonify({"error": True, "message": "Token has been revoked."}), 401



# ===== Endpoints Registration =====
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

api.add_resource(Login, '/api/auth/login')
api.add_resource(Logout, '/api/auth/logout')
api.add_resource(AuthVerify, '/api/auth/verify')
api.add_resource(GetMemberInfo, '/api/auth/memberinfo')
api.add_resource(QuickAnalytics, '/api/auth/quickanalytics')
api.add_resource(TotalVisitors, '/api/auth/tvisitors')
api.add_resource(TopLikes, '/api/auth/toplikes')
api.add_resource(VisitorLikeTimeLineStats, '/api/auth/visitorslikes')
api.add_resource(TagCategoryTechStack, '/api/tagscattech')
api.add_resource(Uploads, '/api/uploads/<string:file_type>/<string:dir_name>/<string:UploadKey>')
api.add_resource(ContributorsMgmt, '/api/auth/contributorsmgmt')
api.add_resource(BlogsMgmt, '/api/auth/blogsmgmt')
api.add_resource(WriteUpsMgmt, '/api/auth/writeupsmgmt')
api.add_resource(ProjectsMgmt, '/api/auth/projectsmgmt')
api.add_resource(PodcastMgmt, '/api/auth/podcastmgmt')


# ===== Run App =====
if __name__ == '__main__':
    try:
        app.logger.info("Starting Flask application...")
        app.run(host="0.0.0.0", debug=True)
    except Exception as e:
        app.logger.critical("An error occurred while starting the server", exc_info=True)

