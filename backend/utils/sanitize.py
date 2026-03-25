"""Input sanitization helpers."""

import re

_TAG_RE = re.compile(r"<[^>]+>")


def sanitize_text(value: str) -> str:
    """Strip HTML-like tags and trim whitespace."""
    cleaned = _TAG_RE.sub("", value)
    return cleaned.strip()
