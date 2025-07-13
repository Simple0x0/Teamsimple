import os
import magic
from PIL import Image
from mutagen.mp3 import MP3
from core.extensions import VALID_MIME_TYPES, MAX_IMAGE_SIZE , MAX_AUDIO_SIZE


def get_mime_type(file):
    """Detect the MIME type from file buffer using libmagic."""
    file.seek(0)
    mime = magic.Magic(mime=True)
    mime_type = mime.from_buffer(file.read(8192))
    file.seek(0)
    return mime_type


def is_valid_mime_type(mime_type, filetype):
    """Validate MIME type against known safe list."""
    allowed_types = VALID_MIME_TYPES.get(filetype, set())
    return mime_type in allowed_types


def validate_magic_number(file, file_type):
    """Verify file signature (magic number) to detect disguised formats."""
    file.seek(0)
    header = file.read(12)
    file.seek(0)

    if file_type == "image":
        return (
            header.startswith(b'\x89PNG\r\n\x1a\n') or   # PNG
            header.startswith(b'\xff\xd8\xff')           # JPEG/JPG
        )
    elif file_type == "audio":
        return (
            header[:3] == b'ID3' or                      # ID3-tagged MP3
            header[:2] == b'\xff\xfb' or                # MPEG-1 Layer III without ID3
            header[:2] == b'\xff\xf3' or                # MPEG-2 Layer III
            header[:2] == b'\xff\xe3'                   # MPEG-2.5 Layer III
        )
    return False


def validate_image_content(file):
    """Ensure the image is loadable and valid (not truncated or malformed)."""
    try:
        file.seek(0)
        img = Image.open(file)
        img.verify()  # Basic integrity check
        file.seek(0)
        img = Image.open(file)
        img.load()    # Full decode to catch deeper corruption
        file.seek(0)
        return True
    except Exception:
        return False


def validate_audio_content(file):
    """Ensure MP3 is parseable and contains metadata."""
    try:
        file.seek(0)
        audio = MP3(file)
        file.seek(0)
        return hasattr(audio, 'info') and audio.info is not None
    except Exception:
        return False


def validate_extension(filename, filetype):
    """Whitelist file extensions based on expected media type."""
    if '.' not in filename:
        return False

    ext = filename.rsplit('.', 1)[1].lower()
    if filetype == "image":
        return ext in {'jpg', 'jpeg', 'png'}
    elif filetype == "audio":
        return ext in {'mp3'}
    return False

def validate_file_size(file, filetype):
    """
    Validate the size of the uploaded file based on its type.
    Returns (bool, str) tuple indicating validity and message.
    """
    file.seek(0, os.SEEK_END)
    size = file.tell()
    file.seek(0)

    if filetype == "image" and size > MAX_IMAGE_SIZE:
        return False, f"Image exceeds max size of {MAX_IMAGE_SIZE / (1024*1024):.1f} MB"
    if filetype == "audio" and size > MAX_AUDIO_SIZE:
        return False, f"Audio exceeds max size of {MAX_AUDIO_SIZE / (1024*1024):.1f} MB"
    
    return True, "File size is within allowed limit"

def file_validate(file, filename, filetype):
    """
    Run all validation checks on uploaded file:
    - File size
    - Extension
    - MIME type
    - Magic number
    - Content integrity
    """
    if not validate_extension(filename, filetype):
        return False, "Invalid file extension"

    valid, msg = validate_file_size(file, filetype)
    if not valid:
        return valid, msg
    
    mime_type = get_mime_type(file)
    print(mime_type)
    if not is_valid_mime_type(mime_type, filetype):
        return False, f"Invalid MIME type: {mime_type}"

    if not validate_magic_number(file, filetype):
        return False, "Magic number mismatch or unsupported format"

    if filetype == "image":
        if not validate_image_content(file):
            return False, "Corrupted or malformed image"
    elif filetype == "audio":
        if not validate_audio_content(file):
            return False, "Invalid or unreadable audio file"

    return True, "Valid file"
