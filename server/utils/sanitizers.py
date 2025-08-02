import html
import re
from datetime import datetime
import ipaddress
from urllib.parse import urlparse

class Sanitizer():
    def __init__(self):
        pass
    # --- Sanitizers ---
    def sanitize_title(self, title: str) -> str:
        if not title or not isinstance(title, str):
            return None
        title = html.escape(title.strip())
        title = re.sub(r'[^a-zA-Z0-9 \-]', '', title)
        title = re.sub(r'\s+', ' ', title)
        
        return title.title() if title else None
        
    def sanitize_slug(self, slug: str) -> str:
        return re.sub(r'[^a-zA-Z0-9\-]', '', slug.strip().lower())

    def sanitize_summary(self, summary: str) -> str:
        return html.escape(summary.strip())

    def sanitize_status(self, status: str) -> str:
        allowed_status = {"Draft", "Published", "Scheduled", "Deleted"}
        status = status.strip().capitalize()
        return status if status in allowed_status else "Draft"

    def sanitize_date(self, date_str: str) -> str:
        if not date_str:
            return None
        try:
            return datetime.fromisoformat(date_str).strftime('%Y-%m-%d %H:%M:%S')
        except ValueError:
            return None

    def sanitize_image_path(self, path: str) -> str:
        
        if not path or not isinstance(path, str):
            return None

        path = path.strip()
        if '/api/files/' not in path:
            return None
            #raise ValueError("Invalid path: must contain '/api/files/'")
        
         # Parse URL to validate base structure
        parsed = urlparse(path)

        if parsed.scheme not in ('http', 'https') or not parsed.netloc:
            raise ValueError("Invalid path: must include a valid scheme and domain")
        # Extract the part starting from /api/files/
        start_index = path.index('/api/files/')
        prefix = path[:start_index]
        path_suffix = path[start_index:]

        # Sanitize only the suffix, keeping prefix untouched (e.g., http://localhost:5000)
        path_suffix = re.sub(r'[^a-zA-Z0-9_\-\/\.]', '', path_suffix)

        return prefix + path_suffix


    def sanitize_id(self, id_value, id_type=None) -> int | None:
        try:
            id_int = int(id_value)
            if id_type == '%':
                return id_int if 0 <= id_int <= 100 else None
            return id_int
        except (ValueError, TypeError):
            return None


    def sanitize_content(self, content: str) -> str:
        return content.strip()

    def sanitize_id_list(self, id_list_str: str) -> list[int]:
        return [int(i) for i in id_list_str.split(",") if i.strip().isdigit()]
    
    def sanitize_list(self, tag_input) -> list[str]:
        if isinstance(tag_input, list):
            return [html.escape(str(tag).strip()) for tag in tag_input if str(tag).strip()]
        elif isinstance(tag_input, str):
            return [html.escape(tag.strip()) for tag in tag_input.split(",") if tag.strip()]
        return []

    def sanitize_alphanum(self, value: str) -> str:
        return re.sub(r'[^a-zA-Z0-9]', '', value.strip()) if value else None
    

    def sanitize_upload_key(self, raw_key: str) -> str:
        if raw_key:
            prefix, uuid_part = raw_key.strip().split('-', 1)
            prefix = re.sub(r'[^a-zA-Z]', '', prefix)[:20].lower()
            uuid_part = re.sub(r'[^a-fA-F0-9]', '', uuid_part)[:32].lower()
            return f"{prefix}-{uuid_part}"

    def sanitize_username(self, username):
        if username:
            if re.match("^[a-zA-Z0-9._-]+$", username):
                return username
            else:
                return None  
            
    def sanitize_fullname(self, username):
        if username:
            if re.match("^[a-zA-Z ]+$", username):
                return username
            else:
                return None  
        
    def sanitize_ostype(self, os_type):
        ostype_map = {
            'windows': 'Windows',
            'linux': 'Linux',
            'android': 'Android',
            'macos': 'macOS',
            'freebsd': 'FreeBSD',
            'unknown' : 'Unknown'
        }
        key = os_type.strip().lower()
        return ostype_map.get(key)


    def sanitize_password(self, password):
        if len(password) >= 8:  
            return password
        else:
            return None 
        
    

    def sanitize_ipaddress(self, ip_str, allow_ipv6=False):
        """
        Filters IP addresses for dynamic pentesting lab environments like HTB, THM, etc.

        Accepts:
            - Any valid IPv4 (or optionally IPv6)
            - Must be private and not loopback/reserved

        Returns:
            str: Normalized IP if valid and allowed
            None: Otherwise
        """
        try:
            ip = ipaddress.ip_address(ip_str.strip())

            if not allow_ipv6 and ip.version == 6:
                return None

            if ip.is_private and not (ip.is_loopback or ip.is_reserved or ip.is_multicast):
                return str(ip)

            return None

        except ValueError:
            return None
    from urllib.parse import urlparse

    def sanitize_url(self, url_str):
        """
        Sanitizes and validates a URL.

        Parameters:
            url_str (str): Raw input string containing the URL.

        Returns:
            str: A sanitized URL string if valid.
            None: If the URL is invalid, missing a scheme, or malformed.
        """
        if not url_str or not isinstance(url_str, str):
            return None

        url_str = url_str.strip()

        try:
            parsed = urlparse(url_str)

            # Scheme and netloc
            if parsed.scheme not in ('http', 'https') or not parsed.netloc:
                return None

            # Reconstruct sanitized URL
            sanitized = f"{parsed.scheme}://{parsed.netloc}"
            if parsed.path:
                sanitized += parsed.path
            if parsed.params:
                sanitized += f";{parsed.params}"
            if parsed.query:
                sanitized += f"?{parsed.query}"
            if parsed.fragment:
                sanitized += f"#{parsed.fragment}"

            return sanitized

        except Exception:
            return None

    def sanitize_difficulty(self, difficulty: str) -> str:
        """
        Sanitizes and normalizes a difficulty level string.

        Accepts: Easy, Medium, Hard, Insane (case-insensitive)

        Returns:
            str: Normalized difficulty (capitalized)
            None: If the input is invalid or unrecognized
        """
        if not difficulty or not isinstance(difficulty, str):
            return None

        normalized = difficulty.strip().lower()

        allowed_difficulties = {
            'easy': 'Easy',
            'medium': 'Medium',
            'hard': 'Hard',
            'insane': 'Insane'
        }

        return allowed_difficulties.get(normalized)

    def sanitize_tool_list(self, input_str):
        # Split by comma
        tools = input_str.split(',')

        sanitized = []
        for tool in tools:
            # Strip whitespace
            tool = tool.strip()

            # Remove dangerous characters
            tool = re.sub(r"[^\w\s\-]", "", tool)  # Allow alphanum, _, -, space
            tool = re.sub(r"\s+", "", tool)  # Remove internal spaces if needed

            # Optional: Title case or keep original
            tool = tool.title()

            if tool:
                sanitized.append(tool)

        return ", ".join(sanitized)


    def sanitize_enum(self, value: str, allowed_values: list) -> str:
        """
        Validate the input string against a list of allowed enum values.
        Case-insensitive matching.
        """
        if not isinstance(value, str):
            return None

        value_clean = value.strip()
        for allowed in allowed_values:
            if value_clean.lower() == allowed.lower():
                return allowed  # return the canonical casing from allowed list
        return None


    def sanitize_email(self, email: str) -> str:
        email = email.strip().lower()
        pattern = re.compile(
            r"(^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$)"
        )
        if not pattern.match(email):
            raise ValueError(f"Invalid email address: {email}")
        return email

    def sanitize_phone_number(self, phone: str) -> str:
        """
        Sanitize and validate a phone number.
        Removes spaces, dashes, and parentheses.
        Allows only numbers with optional leading '+'.
        """
        if not isinstance(phone, str):
            return None

        # Remove common separators
        phone = phone.strip().replace(" ", "").replace("-", "").replace("(", "").replace(")", "")

        # Validate pattern: allows optional '+' followed by 7 to 15 digits (E.164 compliant)
        pattern = re.compile(r"^\+?[0-9]{7,15}$")
        if not pattern.match(phone):
            raise ValueError(f"Invalid phone number: {phone}")

        return phone











