import os
from flask_bcrypt import Bcrypt
from flask_jwt_extended import JWTManager
from db import Database
from utils.sanitizers import Sanitizer

# ======= GLOBAL SHARED EXTENSIONS ==============
bcrypt = Bcrypt()
jwt = JWTManager()
db = Database()
s = Sanitizer()

# ======= GLOBAL VARIABLES ==============
SLEEP = 1
UPLOAD_BASE = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'uploads'))
CONTENT_STATUS = ['Scheduled', 'Draft', 'Published', 'Deleted']
PROJECT_PROGRESS_STATUS = ['In Progress', 'Completed', 'Paused']
PUBLIC_EXCLUDED_STATUSES = {"Deleted", "Draft", "Schedule"}



