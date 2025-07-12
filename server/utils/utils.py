import requests
import re
import os
from dotenv import load_dotenv
from datetime import datetime
import bcrypt
from pprint import pprint
import unicodedata


# ======= Initialize app and extensions =========
load_dotenv()
JWT_ALGO = os.getenv('JWT_ALGO') 

def get_country(ip):
    try:
        response = requests.get(f"http://ip-api.com/json/{ip}")
        if response.status_code == 200:
            data = response.json()
            country = data.get("country")
            return f"{country}" if country else "Unknown"
        return "Unknown"
    except Exception as e:
        print(f"[-] Error fetching location: {e}")
        return "Unknown"

def validate_fingerprint_value(fingerprint_value):
    if not re.fullmatch(r'^[a-f0-9]{32}$', fingerprint_value):
        return False, "Invalid fingerprint"
    return True, ' '

def validate_fingerprint(fingerprint_value, browser, os_name, device_type):
    # Normalize inputs
    fingerprint_value = str(fingerprint_value).strip().lower()
    browser = str(browser).strip()
    os_name = str(os_name).strip()
    device_type = str(device_type).strip()

    # Fingerprint: 32-character lowercase hex
    if not re.fullmatch(r'^[a-f0-9]{32}$', fingerprint_value):
        return False, "Invalid fingerprint"

    # Browser string: allow alphanumerics + common User-Agent symbols
    if not re.fullmatch(r'^[\w\d\s\-\.\(\);:/]+$', browser):
        return False, "Invalid browser"

    # OS name: only allow known OS types (limited whitelist)
    if not re.fullmatch(r'^(Windows|macOS|Linux|Unknown)$', os_name, re.IGNORECASE):
        return False, "Invalid OS name"

    # Device type: strict whitelist
    if not re.fullmatch(r'^(Desktop|Mobile|Tablet|Unknown)$', device_type, re.IGNORECASE):
        return False, "Invalid device type"

    return True, ""

def validate_like_input(contentID, contentType, fingerprint):
    # Basic presence check
    if contentID is None or not contentType or not fingerprint:
        return False, "Missing contentID, content type, or fingerprint"

    # Validate contentID: must be a positive integer
    try:
        contentID = int(contentID)
        if contentID <= 0:
            return False, "Invalid contentID: must be a positive integer"
    except ValueError:
        return False, "Invalid contentID: must be an integer"

    contentType = str(contentType).strip().capitalize()
    fingerprint = str(fingerprint).strip().lower()

    # Validate fingerprint: must be 32-character lowercase hex string
    if not re.fullmatch(r'^[a-f0-9]{32}$', fingerprint):
        return False, "Invalid fingerprint format"

    # Allowed content types whitelist
    allowed_types = {"Blog", "Writeup", "Podcast", "Achievement", "Project"}
    if contentType not in allowed_types:
        return False, "Invalid content type"

    return True, ""

def flatten_contributor(rows, pop = True):
    if not rows:
        return None
    base = rows[0].copy()
    base['SocialLinks'] = []
    for row in rows:
        if row.get('Platform') and row.get('URL'):
            base['SocialLinks'].append({
                'Platform': row['Platform'],
                'URL': row['URL']
            })
    base.pop('Platform', None)
    base.pop('URL', None)
    if pop:
        for field in ['Email', 'DateAdded', 'AddedBy', 'Status', 'LastUpdated', 'Role']:
            base.pop(field, None)
    return base

# ===== TO BE DELETED =====
def sanitize_alphanum(username):
    if re.match("^[a-zA-Z0-9_]+$", username):
        return username
    else:
        return None  

def sanitize_password(password):
    if len(password) >= 6:  
        return password
    else:
        return None 

#=================

def passwordhash(password: str) -> str:
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
def passwordcheck(password: str, passwordhash: str) -> bool:
    return bcrypt.checkpw(password.encode('utf-8'), passwordhash.encode('utf-8'))


def merge_likes_visitors(likes, visitors, key="date", timeline="week"):
    def normalize(rows):
        for row in rows:
            row["date"] = row.get("date")  # Already normalized in SQL
        return rows

    def sort_key(row):
        if timeline == "week":
            days_order = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
            return days_order.index(row[key]) if row[key] in days_order else -1
        elif timeline == "month":
            return int(row[key])
        elif timeline == "year":
            parts = row[key].split("-")
            if len(parts) == 2:
                return int(parts[1])  # month part
            elif len(parts) == 1:
                # Only year given, no month. Sort before or after months?
                return 0  # or 13 if you want it after all months
            else:
                # Unexpected format: just sort by string fallback
                return row[key]
        return row[key]


    def format_date_label(label):
        if timeline == "year":
            month_map = {
                "01": "Jan", "02": "Feb", "03": "Mar", "04": "Apr",
                "05": "May", "06": "Jun", "07": "Jul", "08": "Aug",
                "09": "Sep", "10": "Oct", "11": "Nov", "12": "Dec"
            }
            parts = label.split("-")
            if len(parts) == 2:
                _, month = parts
                return month_map.get(month, month)
            elif len(parts) == 1:
                # Just year, show full year label or decide what you want
                return parts[0]
            else:
                return label
        return label


    likes = normalize(likes)
    visitors = normalize(visitors)

    merged = {}
    for row in likes:
        merged[row["date"]] = {
            "date": row["date"],
            "likes": row["total_likes"],
            "visitors": 0,
        }

    for row in visitors:
        if row["date"] in merged:
            merged[row["date"]]["visitors"] = row["total_visitors"]
        else:
            merged[row["date"]] = {
                "date": row["date"],
                "likes": 0,
                "visitors": row["total_visitors"],
            }

    # Format date labels and sort
    result = list(merged.values())
    for r in result:
        r["date"] = format_date_label(r["date"])

    return sorted(result, key=sort_key)


def validate_input_data(data_type, data):
    name = data.get("name", "").strip()
    description = data.get("description", "").strip() if "description" in data else ""

    if not name:
        return False, "Name is required."

    if data_type not in ["category", "tag", "techstack"]:
        return False, "Invalid type. Must be one of: category, tag, techstack."

    if data_type in ["category", "techstack"] and not description:
        return False, "Description is required for category and techstack."

    return True, {"name": name, "description": description}




def is_allowed_file(filename, filetype):
    if '.' not in filename:
        return False

    ext = filename.rsplit('.', 1)[1].lower()

    allowed_image_exts = {'jpg', 'jpeg', 'png'}
    allowed_audio_exts = {'mp3'}

    if filetype == "image":
        return ext in allowed_image_exts
    elif filetype == "audio":
        return ext in allowed_audio_exts
    return False


def generate_slug(title: str) -> str:
    # Normalize unicode characters to ASCII
    normalized = unicodedata.normalize('NFKD', title).encode('ascii', 'ignore').decode('ascii')
    
    # Replace any non-alphanumeric character with hyphens
    slug = re.sub(r'[^a-zA-Z0-9]+', '-', normalized)
    
    # Remove leading/trailing hyphens
    slug = slug.strip('-')

    # Convert to lowercase
    return slug.lower()
