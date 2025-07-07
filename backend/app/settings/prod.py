###########################################################
"""
Production settings configuration
"""
###########################################################
from app.settings.base import *
from datetime import timedelta

DEBUG = False
ALLOWED_HOSTS = ['pngpoint.com']
SECRET_KEY = os.getenv('DJANGO_SECRET_KEY', None)

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.getenv('POSTGRES_DB', 'your_db'),
        'USER': os.getenv('POSTGRES_USER', 'your_user'),
        'PASSWORD': os.getenv('POSTGRES_PASSWORD', 'your_pass'),
        'HOST': os.getenv('POSTGRES_HOST', 'localhost'),
        'PORT': os.getenv('POSTGRES_PORT', '5432'),
    }
}

CSRF_TRUSTED_ORIGINS = ['https://pngpoint.com']

SIMPLE_JWT.update({
    "ACCESS_TOKEN_LIFETIME": timedelta(minutes=5),
    "REFRESH_TOKEN_LIFETIME": timedelta(days=1),
    "SIGNING_KEY": os.getenv('DJANGO_SECRET_KEY'),
})

CORS_ALLOW_ALL_ORIGINS = False
CORS_ALLOWED_ORIGINS = [
    "https://pngpoint.com",
]

LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'formatters': {
        'verbose': {
            'format': '{levelname} {asctime} {module} {message}',
            'style': '{',
        },
    },
    'handlers': {
        'file': {
            'level': 'WARNING',
            'class': 'logging.FileHandler',
            'filename': os.path.join(BASE_DIR, 'logs', 'django.log'),
            'formatter': 'verbose',
        },
    },
    'root': {
        'handlers': ['file'],
        'level': 'WARNING',
    },
}
