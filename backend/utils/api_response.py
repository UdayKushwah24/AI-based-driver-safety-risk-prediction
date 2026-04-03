"""API request/response utilities and helpers."""

import json
from typing import Any, Dict, Optional
from functools import wraps
from datetime import datetime


class APIResponse:
    """Helper class for building consistent API responses."""
    
    @staticmethod
    def success(data: Any, message: str = "Success", status_code: int = 200) -> Dict[str, Any]:
        """Build a successful API response."""
        return {
            "status": "success",
            "data": data,
            "message": message,
            "timestamp": datetime.utcnow().isoformat(),
            "code": status_code,
        }
    
    @staticmethod
    def error(error: str, message: str = "", status_code: int = 400) -> Dict[str, Any]:
        """Build an error API response."""
        return {
            "status": "error",
            "error": error,
            "message": message,
            "timestamp": datetime.utcnow().isoformat(),
            "code": status_code,
        }
    
    @staticmethod
    def paginated(items: list, total: int, page: int = 1, page_size: int = 20) -> Dict[str, Any]:
        """Build a paginated response."""
        return {
            "status": "success",
            "data": items,
            "pagination": {
                "page": page,
                "page_size": page_size,
                "total": total,
                "pages": (total + page_size - 1) // page_size,
            },
            "timestamp": datetime.utcnow().isoformat(),
        }


def http_error_handler(default_status: int = 500):
    """Decorator to handle HTTP errors in route handlers."""
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            try:
                return func(*args, **kwargs)
            except ValueError as e:
                return APIResponse.error("validation_error", str(e), 422), 422
            except KeyError as e:
                return APIResponse.error("missing_field", f"Missing required field: {e}", 400), 400
            except Exception as e:
                return APIResponse.error("server_error", str(e), default_status), default_status
        return wrapper
    return decorator
