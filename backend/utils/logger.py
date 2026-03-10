"""
Logging utility — used across all backend modules.
"""
import logging
import sys

from backend.config import LOG_LEVEL, ALERT_LOG_LEVEL


def get_logger(name: str) -> logging.Logger:
    """Return a pre-configured logger with consistent formatting."""
    logger = logging.getLogger(name)
    if not logger.handlers:
        handler = logging.StreamHandler(sys.stdout)
        formatter = logging.Formatter(
            "[%(asctime)s] [%(name)s] %(levelname)s — %(message)s",
            datefmt="%H:%M:%S",
        )
        handler.setFormatter(formatter)
        logger.addHandler(handler)
        level = LOG_LEVEL if name != "alert_player" else ALERT_LOG_LEVEL
        logger.setLevel(getattr(logging, level.upper(), logging.INFO))
    return logger
