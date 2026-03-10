"""
Lightweight audio alert helper.

Tries pygame.mixer first; if unavailable (e.g. Python 3.14 build issue),
falls back to macOS 'afplay' via subprocess. Sound playback always runs
in a dedicated thread so the detection loop is never blocked.
"""

import os
import platform
import subprocess
import threading
import time
from pathlib import Path
from typing import Optional

from backend.utils.logger import get_logger


class AlertPlayer:
    def __init__(self, drowsy_path: Path, yawn_path: Path, enabled: bool = True):
        self._logger = get_logger("alert_player")
        self._drowsy_path = Path(drowsy_path)
        self._yawn_path = Path(yawn_path)
        self._enabled = enabled
        self._backend: Optional[str] = None  # "pygame" or "afplay"
        self._current_key: Optional[str] = None
        self._lock = threading.Lock()

        # pygame-specific state
        self._pygame = None
        self._sounds: dict = {}
        self._current_channel = None

        # afplay-specific state
        self._afplay_proc: Optional[subprocess.Popen] = None
        self._afplay_thread: Optional[threading.Thread] = None
        self._afplay_stop = threading.Event()
        self._sound_paths: dict = {}

        if not self._enabled:
            self._logger.info("Audio alerts disabled by configuration")
            return

        # ── Try pygame.mixer first ──
        try:
            if "SDL_AUDIODRIVER" not in os.environ and platform.system() == "Darwin":
                os.environ["SDL_AUDIODRIVER"] = "coreaudio"

            os.environ.setdefault("PYGAME_HIDE_SUPPORT_PROMPT", "1")
            import pygame
            pygame.mixer.init()
            self._pygame = pygame
            self._backend = "pygame"
            self._logger.info(
                f"Audio mixer initialized via pygame "
                f"(freq={pygame.mixer.get_init()[0] if pygame.mixer.get_init() else 'n/a'})"
            )
            self._load_pygame_sound("drowsy", self._drowsy_path)
            self._load_pygame_sound("yawn", self._yawn_path)
            if "yawn" not in self._sounds and "drowsy" in self._sounds:
                self._sounds["yawn"] = self._sounds["drowsy"]
            if not self._sounds:
                raise RuntimeError("No audio files loaded via pygame")
        except Exception as exc:
            self._logger.warning(f"pygame.mixer unavailable: {exc}")
            self._pygame = None
            self._sounds = {}
            self._backend = None

        # ── Fallback: macOS afplay ──
        if self._backend is None and platform.system() == "Darwin":
            self._backend = "afplay"
            self._logger.info("Using macOS afplay as audio backend")
            self._register_afplay_sound("drowsy", self._drowsy_path)
            self._register_afplay_sound("yawn", self._yawn_path)
            if "yawn" not in self._sound_paths and "drowsy" in self._sound_paths:
                self._sound_paths["yawn"] = self._sound_paths["drowsy"]
            if not self._sound_paths:
                self._logger.warning("No audio files found; alerts muted")
                self._enabled = False
                self._backend = None

        if self._backend is None and self._enabled:
            self._logger.warning("No audio backend available; alerts muted")
            self._enabled = False

    # ── Public API ----------------------------------------------------
    def play_drowsy(self):
        self._play("drowsy")

    def play_yawn(self):
        self._play("yawn")

    def stop(self):
        if not self._enabled:
            return
        with self._lock:
            self._stop_locked()

    # ── pygame helpers ------------------------------------------------
    def _load_pygame_sound(self, key: str, path: Path):
        if not path or not Path(path).exists():
            self._logger.warning(f"Sound file missing for {key}: {path}")
            return
        try:
            self._sounds[key] = self._pygame.mixer.Sound(str(path))
            self._logger.info(f"Loaded {key} sound via pygame: {path}")
        except Exception as exc:
            self._logger.warning(f"Failed to load {key} via pygame: {exc}")

    # ── afplay helpers ------------------------------------------------
    def _register_afplay_sound(self, key: str, path: Path):
        if not path or not Path(path).exists():
            self._logger.warning(f"Sound file missing for {key}: {path}")
            return
        self._sound_paths[key] = str(path)
        self._logger.info(f"Registered {key} sound for afplay: {path}")

    def _afplay_loop(self, filepath: str):
        """Loop the sound file until _afplay_stop is set."""
        while not self._afplay_stop.is_set():
            try:
                proc = subprocess.Popen(
                    ["afplay", filepath],
                    stdout=subprocess.DEVNULL,
                    stderr=subprocess.DEVNULL,
                )
                with self._lock:
                    self._afplay_proc = proc
                proc.wait()
            except Exception:
                break
            # Small gap between loops; check stop flag
            if self._afplay_stop.wait(timeout=0.1):
                break

    # ── Unified play / stop -------------------------------------------
    def _play(self, key: str):
        if not self._enabled:
            return
        with self._lock:
            if self._current_key == key:
                # Already playing this alert
                if self._backend == "pygame":
                    if self._current_channel and self._current_channel.get_busy():
                        return
                elif self._backend == "afplay":
                    if self._afplay_thread and self._afplay_thread.is_alive():
                        return
            self._stop_locked()
            self._current_key = key

            if self._backend == "pygame":
                sound = self._sounds.get(key)
                if sound is None:
                    return
                try:
                    self._current_channel = sound.play(loops=-1)
                    if self._current_channel:
                        self._current_channel.set_volume(1.0)
                    self._logger.info(f"Started {key} alert (pygame)")
                except Exception as exc:
                    self._logger.warning(f"Unable to play {key}: {exc}")
                    self._current_channel = None
                    self._current_key = None

            elif self._backend == "afplay":
                filepath = self._sound_paths.get(key)
                if filepath is None:
                    return
                self._afplay_stop.clear()
                self._afplay_thread = threading.Thread(
                    target=self._afplay_loop, args=(filepath,), daemon=True
                )
                self._afplay_thread.start()
                self._logger.info(f"Started {key} alert (afplay)")

    def _stop_locked(self):
        if self._backend == "pygame" and self._current_channel is not None:
            try:
                self._current_channel.stop()
                self._logger.info("Stopped alert audio (pygame)")
            except Exception as exc:
                self._logger.warning(f"Unable to stop pygame audio: {exc}")
            self._current_channel = None

        if self._backend == "afplay":
            self._afplay_stop.set()
            if self._afplay_proc is not None:
                try:
                    self._afplay_proc.terminate()
                    self._afplay_proc.wait(timeout=1)
                except Exception:
                    pass
                self._afplay_proc = None
            self._afplay_thread = None

        self._current_key = None
