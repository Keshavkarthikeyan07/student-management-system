"""
test_settings.py — Override settings for automated tests.

Uses SQLite so tests can run without a running MySQL instance.
This is standard practice for CI/CD environments.

Usage:
    python manage.py test students --settings=config.test_settings --verbosity=2
"""

from .settings import *  # noqa: F401, F403

# Override database to use SQLite for testing
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "test_db.sqlite3",  # noqa: F405
    }
}

# Silence migration output during tests
# MIGRATION_MODULES = {"students": None}  # Uncomment to skip migrations
