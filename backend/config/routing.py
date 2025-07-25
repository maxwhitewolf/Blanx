from channels.auth import AuthMiddlewareStack
from channels.routing import URLRouter
from django.urls import re_path
from dm.consumers import ChatConsumer
from notifications.consumers import NotificationConsumer

websocket_urlpatterns = [
    re_path(r"^ws/chat/(?P<conversation_id>\d+)/$", ChatConsumer.as_asgi()),
    re_path(r"^ws/notifications/$", NotificationConsumer.as_asgi()),
]

application = AuthMiddlewareStack(URLRouter(websocket_urlpatterns))
