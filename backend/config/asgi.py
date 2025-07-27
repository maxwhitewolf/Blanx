import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

# Standard Django ASGI application
django_asgi_app = get_asgi_application()

import config.routing

# Route HTTP requests to Django and WebSocket connections to the
# existing Channels URL router.
application = ProtocolTypeRouter({
    "http": django_asgi_app,
    "websocket": config.routing.application,
})
