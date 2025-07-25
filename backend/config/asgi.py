import os
from django.core.asgi import get_asgi_application

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')

django_asgi_app = get_asgi_application()
from channels.routing import ProtocolTypeRouter
from config.routing import application as websocket_application

application = ProtocolTypeRouter({
    "http": django_asgi_app,
    "websocket": websocket_application,
})
