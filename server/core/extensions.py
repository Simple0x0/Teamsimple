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
VALID_MIME_TYPES = {
    'image': {'image/png', 'image/jpeg'},
    'audio': {'audio/mpeg', 'audio/x-mp3', 'audio/x-mpeg', 'audio/mp3', 'application/octet-stream'}
}
MAX_IMAGE_SIZE = 10 * 1024 * 1024 # 10 MB
MAX_AUDIO_SIZE = 150 * 1024 * 1024 #150MB


