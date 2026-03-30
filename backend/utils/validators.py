"""
╔════════════════════════════════════════════════════════════════════════════╗
║        VALIDATION & ERROR HANDLING UTILITIES — Comprehensive Library       ║
║    Centralized input validation, sanitization, and error handling module   ║
╚════════════════════════════════════════════════════════════════════════════╝

This module provides reusable validation functions and custom exceptions
for the entire AI Driver Safety System. It ensures data integrity,
prevents invalid states, and provides meaningful error messages.

Components:
  1. Custom Exception Classes - Specific errors for different scenarios
  2. Input Validators - Validate emails, passwords, file uploads, etc.
  3. Data Sanitizers - Clean and normalize input data
  4. Error Handlers - Consistent error response formatting
  5. Decorators - Automatic validation for function arguments

Benefits:
  ✓ Consistent error handling across the application
  ✓ Early validation prevents crashes and security issues
  ✓ Clear error messages for debugging and user feedback
  ✓ DRY principle: write validation once, use everywhere
  ✓ Type hints for IDE autocompletion and type checking
"""

import re
import os
from typing import Any, Optional, Dict, List, Tuple
from email_validator import validate_email, EmailNotValidError
from pathlib import Path


# ════════════════════════════════════════════════════════════════════════════
# CUSTOM EXCEPTION CLASSES — Domain-specific exceptions for this system
# ════════════════════════════════════════════════════════════════════════════

class DriverSafetyException(Exception):
    """Base exception for all Driver Safety System errors."""
    pass


class ValidationError(DriverSafetyException):
    """Raised when input validation fails."""
    pass


class AuthenticationError(DriverSafetyException):
    """Raised when authentication/authorization fails."""
    pass


class DatabaseError(DriverSafetyException):
    """Raised when database operations fail."""
    pass


class ModelError(DriverSafetyException):
    """Raised when ML model loading or inference fails."""
    pass


class ConfigurationError(DriverSafetyException):
    """Raised when configuration is invalid or missing."""
    pass


class FileProcessingError(DriverSafetyException):
    """Raised when file upload/processing fails."""
    pass


# ════════════════════════════════════════════════════════════════════════════
# EMAIL VALIDATION — RFC 5321 compliant email validation
# ════════════════════════════════════════════════════════════════════════════

def validate_email_address(email: str) -> str:
    """
    Validate and normalize email address using RFC 5321 standards.
    
    Args:
        email: Email address string to validate
        
    Returns:
        str: Normalized email address (lowercase)
        
    Raises:
        ValidationError: If email format is invalid
        
    Examples:
        >>> validate_email_address("John.Doe@EXAMPLE.COM")
        'john.doe@example.com'
        
        >>> validate_email_address("invalid..email@test.com")
        ValidationError: The part after @ is not valid. It must have exactly one @-sign.
    """
    email = email.strip().lower() if email else ""
    
    if not email:
        raise ValidationError("Email address cannot be empty")
    
    if len(email) > 254:  # RFC 5321 limit
        raise ValidationError("Email address is too long (max 254 characters)")
    
    try:
        # Validates format, domain MX record existence (optional), etc.
        valid = validate_email(email, check_deliverability=False)
        return valid.email
    except EmailNotValidError as e:
        raise ValidationError(f"Invalid email address: {str(e)}")


# ════════════════════════════════════════════════════════════════════════════
# PASSWORD VALIDATION — Security requirements for user passwords
# ════════════════════════════════════════════════════════════════════════════

def validate_password_strength(password: str) -> Tuple[bool, List[str]]:
    """
    Validate password meets security requirements.
    
    Requirements:
      ✓ Minimum 8 characters
      ✓ At least 1 uppercase letter (A-Z)
      ✓ At least 1 lowercase letter (a-z)
      ✓ At least 1 digit (0-9)
      ✓ At least 1 special character (!@#$%^&*)
      ✓ No dictionary words (future enhancement)
    
    Args:
        password: Password string to validate
        
    Returns:
        Tuple[bool, List[str]]: (is_valid, list_of_errors)
        
    Examples:
        >>> validate_password_strength("MyPassword123!")
        (True, [])
        
        >>> validate_password_strength("weak")
        (False, ['Password is too short...', 'Must contain...', ...])
    """
    errors = []
    password = password or ""
    
    # Check minimum length
    if len(password) < 8:
        errors.append("Password must be at least 8 characters long")
    
    # Check maximum length (prevent DoS on hashing)
    if len(password) > 128:
        errors.append("Password cannot exceed 128 characters")
    
    # Check for uppercase letters
    if not re.search(r"[A-Z]", password):
        errors.append("Password must contain at least one uppercase letter (A-Z)")
    
    # Check for lowercase letters
    if not re.search(r"[a-z]", password):
        errors.append("Password must contain at least one lowercase letter (a-z)")
    
    # Check for digits
    if not re.search(r"\d", password):
        errors.append("Password must contain at least one digit (0-9)")
    
    # Check for special characters
    if not re.search(r"[!@#$%^&*()_+\-=\[\]{};:,.<>?]", password):
        errors.append("Password must contain at least one special character (!@#$%^&*)")
    
    return len(errors) == 0, errors


# ════════════════════════════════════════════════════════════════════════════
# IMAGE/FILE VALIDATION — File type and size validation for uploads
# ════════════════════════════════════════════════════════════════════════════

def validate_image_file(file_path: str, max_size_mb: int = 10) -> Tuple[bool, Optional[str]]:
    """
    Validate image file is a valid image format and appropriate size.
    
    Supported formats: JPEG, PNG, BMP, TIFF
    Default max size: 10MB
    
    Args:
        file_path: Path to file to validate
        max_size_mb: Maximum file size in megabytes
        
    Returns:
        Tuple[bool, Optional[str]]: (is_valid, error_message)
        
    Examples:
        >>> validate_image_file("photo.jpg")
        (True, None)
        
        >>> validate_image_file("document.pdf")
        (False, "File must be an image (JPEG, PNG, BMP, or TIFF)")
    """
    if not file_path:
        return False, "File path cannot be empty"
    
    file_path = Path(file_path)
    
    # Check file exists
    if not file_path.exists():
        return False, f"File not found: {file_path}"
    
    # Check file size
    file_size_mb = file_path.stat().st_size / (1024 * 1024)
    if file_size_mb > max_size_mb:
        return False, f"File is too large ({file_size_mb:.1f}MB). Maximum is {max_size_mb}MB"
    
    # Check file extension
    valid_extensions = {'.jpg', '.jpeg', '.png', '.bmp', '.tiff', '.tif'}
    if file_path.suffix.lower() not in valid_extensions:
        return False, "File must be an image (JPEG, PNG, BMP, or TIFF)"
    
    # Validate file signature (magic bytes) for basic file type verification
    try:
        with open(file_path, 'rb') as f:
            header = f.read(12)
            
            # Check for valid image magic numbers
            is_jpeg = header.startswith(b'\xff\xd8\xff')
            is_png = header.startswith(b'\x89PNG')
            is_bmp = header.startswith(b'BM')
            is_tiff_le = header.startswith(b'II\x2a\x00')  # Little-endian
            is_tiff_be = header.startswith(b'MM\x00\x2a')  # Big-endian
            
            if not (is_jpeg or is_png or is_bmp or is_tiff_le or is_tiff_be):
                return False, "File signature does not match image format (possible corrupted file)"
                
    except IOError as e:
        return False, f"Cannot read file: {str(e)}"
    
    return True, None


def validate_model_file(file_path: str, expected_extension: str = ".pth") -> Tuple[bool, Optional[str]]:
    """
    Validate model file exists and has correct extension.
    
    Args:
        file_path: Path to model file
        expected_extension: Expected file extension (e.g., ".pth", ".pkl")
        
    Returns:
        Tuple[bool, Optional[str]]: (is_valid, error_message)
    """
    if not file_path:
        return False, "Model file path cannot be empty"
    
    model_path = Path(file_path)
    
    if not model_path.exists():
        return False, f"Model file not found: {file_path}"
    
    if model_path.suffix.lower() != expected_extension.lower():
        return False, f"Model file must have {expected_extension} extension, got {model_path.suffix}"
    
    # Check file is not empty
    if model_path.stat().st_size == 0:
        return False, "Model file is empty (corrupted)"
    
    return True, None


# ════════════════════════════════════════════════════════════════════════════
# NUMERIC VALIDATION — Validate ranges, thresholds, and numeric values
# ════════════════════════════════════════════════════════════════════════════

def validate_threshold(value: float, min_val: float = 0.0, max_val: float = 1.0,
                      name: str = "threshold") -> float:
    """
    Validate and clip numeric threshold to valid range.
    
    Args:
        value: Value to validate
        min_val: Minimum allowed value (inclusive)
        max_val: Maximum allowed value (inclusive)
        name: Parameter name for error messages
        
    Returns:
        float: Value clipped to valid range
        
    Raises:
        ValidationError: If value is not a number
        
    Examples:
        >>> validate_threshold(0.5)
        0.5
        
        >>> validate_threshold(1.5)  # Clips to max
        1.0
        
        >>> validate_threshold(-0.5)  # Clips to min
        0.0
    """
    try:
        value = float(value)
    except (TypeError, ValueError):
        raise ValidationError(f"{name} must be a number, got {type(value).__name__}")
    
    if value < min_val or value > max_val:
        # Log warning but clip and continue (fail-soft approach)
        clipped = max(min_val, min(value, max_val))
        return clipped
    
    return value


def validate_risk_score(score: float) -> float:
    """
    Validate risk score is in valid range (0.0 to 100.0).
    
    Args:
        score: Risk score value
        
    Returns:
        float: Score clipped to 0-100 range
        
    Raises:
        ValidationError: If score is not a number
    """
    return validate_threshold(score, min_val=0.0, max_val=100.0, name="risk_score")


def validate_confidence(confidence: float) -> float:
    """
    Validate confidence/probability is in range (0.0 to 100.0).
    
    Args:
        confidence: Confidence percentage
        
    Returns:
        float: Confidence clipped to 0-100 range
    """
    return validate_threshold(confidence, min_val=0.0, max_val=100.0, name="confidence")


# ════════════════════════════════════════════════════════════════════════════
# DATA SANITIZATION — Clean and normalize input data
# ════════════════════════════════════════════════════════════════════════════

def sanitize_string(text: str, max_length: int = 500, allow_newlines: bool = False) -> str:
    """
    Sanitize string input: remove dangerous characters, trim whitespace.
    
    Args:
        text: String to sanitize
        max_length: Maximum allowed length
        allow_newlines: Whether to preserve newline characters
        
    Returns:
        str: Sanitized string
        
    Raises:
        ValidationError: If text exceeds max length
    """
    if not isinstance(text, str):
        raise ValidationError(f"Expected string, got {type(text).__name__}")
    
    # Remove control characters (except tabs, newlines if allowed)
    if allow_newlines:
        text = ''.join(char for char in text if ord(char) > 31 or char in '\n\t')
    else:
        text = ''.join(char for char in text if ord(char) > 31 or char == '\t')
    
    # Trim whitespace
    text = text.strip()
    
    # Enforce maximum length
    if len(text) > max_length:
        raise ValidationError(f"Text exceeds maximum length of {max_length} characters")
    
    return text


def sanitize_filename(filename: str) -> str:
    """
    Sanitize filename to prevent directory traversal and injection attacks.
    
    Removes: /, \\, .., null bytes, etc.
    Keeps: alphanumeric, dash, underscore, dot
    
    Args:
        filename: Original filename
        
    Returns:
        str: Safe filename
        
    Example:
        >>> sanitize_filename("../../etc/passwd")
        "etcpasswd"
        
        >>> sanitize_filename("my_image_2026_03_31.jpg")
        "my_image_2026_03_31.jpg"
    """
    if not filename:
        return "file"
    
    # Remove path separators and potentially dangerous sequences
    filename = filename.replace('/', '').replace('\\', '').replace('..', '')
    
    # Keep only safe characters: alphanumeric, dash, underscore, dot
    filename = re.sub(r'[^a-zA-Z0-9._-]', '', filename)
    
    # Remove leading dots (hidden files on Unix)
    filename = filename.lstrip('.')
    
    # Limit length
    filename = filename[:255]
    
    if not filename:
        filename = "file"
    
    return filename


# ════════════════════════════════════════════════════════════════════════════
# AUTHENTICATION VALIDATION — Token and credential validation
# ════════════════════════════════════════════════════════════════════════════

def validate_token_format(token: str) -> bool:
    """
    Check if token has valid JWT format (three Base64-encoded parts separated by dots).
    
    Does NOT verify signature or expiration — use JWT library for that.
    
    Args:
        token: JWT token string
        
    Returns:
        bool: True if format is valid
        
    Examples:
        >>> validate_token_format("eyJhbGc...eyJzdWI...signature")
        True
        
        >>> validate_token_format("invalid_token")
        False
    """
    if not token or not isinstance(token, str):
        return False
    
    parts = token.split('.')
    if len(parts) != 3:
        return False
    
    # Basic Base64 validation (lots of edge cases, but good first check)
    for part in parts:
        # Base64 characters are: A-Z, a-z, 0-9, +, /, optional =
        if not re.match(r'^[A-Za-z0-9_-]+={0,2}$', part):
            return False
    
    return True


# ════════════════════════════════════════════════════════════════════════════
# REQUEST VALIDATION — Validate API request parameters
# ════════════════════════════════════════════════════════════════════════════

def validate_pagination_params(skip: int, limit: int,
                              max_limit: int = 1000) -> Tuple[int, int]:
    """
    Validate pagination parameters for database queries.
    
    Args:
        skip: Number of records to skip (offset)
        limit: Number of records to return
        max_limit: Maximum allowed limit
        
    Returns:
        Tuple[int, int]: (validated_skip, validated_limit)
        
    Raises:
        ValidationError: If parameters are invalid
    """
    try:
        skip = int(skip)
        limit = int(limit)
    except (TypeError, ValueError):
        raise ValidationError("skip and limit must be integers")
    
    if skip < 0:
        raise ValidationError("skip must be non-negative")
    
    if limit < 1:
        raise ValidationError("limit must be at least 1")
    
    if limit > max_limit:
        limit = max_limit  # Silently limit to max (fail-soft)
    
    return skip, limit


def validate_filter_dict(filters: Optional[Dict[str, Any]],
                        allowed_keys: Optional[List[str]] = None) -> Dict[str, Any]:
    """
    Validate filter dictionary for database queries.
    
    Args:
        filters: Filter dictionary from request
        allowed_keys: Whitelist of allowed filter keys (None = allow all)
        
    Returns:
        Dict: Validated and cleaned filters
        
    Raises:
        ValidationError: If filters contain invalid keys
    """
    if not filters:
        return {}
    
    if not isinstance(filters, dict):
        raise ValidationError("Filters must be a dictionary")
    
    validated = {}
    
    for key, value in filters.items():
        # Check against whitelist if provided
        if allowed_keys and key not in allowed_keys:
            raise ValidationError(f"Filter '{key}' is not allowed. Allowed: {allowed_keys}")
        
        # Sanitize key (prevent injection)
        key = sanitize_string(key, max_length=50)
        
        # Handle None values
        if value is None:
            validated[key] = None
        # Handle string values
        elif isinstance(value, str):
            validated[key] = sanitize_string(value, max_length=1000)
        # Handle numeric values
        elif isinstance(value, (int, float)):
            validated[key] = value
        # Handle boolean values
        elif isinstance(value, bool):
            validated[key] = value
        # Handle lists (for $in queries)
        elif isinstance(value, list):
            validated[key] = [sanitize_string(str(v), max_length=100) if isinstance(v, str) else v
                            for v in value]
        else:
            # Skip unrecognized value types
            continue
        
        validated[key] = value
    
    return validated


# ════════════════════════════════════════════════════════════════════════════
# ERROR RESPONSE FORMATTING — Consistent API error responses
# ════════════════════════════════════════════════════════════════════════════

def format_error_response(error: Exception, status_code: int = 400,
                         user_message: Optional[str] = None) -> Dict[str, Any]:
    """
    Format exception into consistent API error response.
    
    Args:
        error: Exception that occurred
        status_code: HTTP status code
        user_message: User-friendly message (if None, shows technical details)
        
    Returns:
        Dict: Error response with status code and details
        
    Example:
        >>> format_error_response(ValueError("Invalid input"), 400)
        {
          'status_code': 400,
          'error': 'ValueError',
          'message': 'Invalid input',
          'user_message': 'Invalid input'
        }
    """
    error_dict = {
        'status_code': status_code,
        'error': type(error).__name__,
        'message': str(error),
        'user_message': user_message or str(error),
    }
    
    return error_dict


def format_validation_error(field: str, message: str) -> Dict[str, Any]:
    """
    Format field validation error.
    
    Args:
        field: Field name that failed validation
        message: Error message
        
    Returns:
        Dict: Formatted validation error
        
    Example:
        >>> format_validation_error('email', 'Invalid email format')
        {'field': 'email', 'message': 'Invalid email format'}
    """
    return {
        'field': field,
        'message': message,
        'code': 'VALIDATION_ERROR',
    }
