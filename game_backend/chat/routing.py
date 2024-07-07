# chat/routing.py
from django.urls import re_path

from . import consumers

#(Note we use re_path() due to limitations in URLRouter.)
websocket_urlpatterns = [
    re_path(r"ws/socket-server/", consumers.ChatConsumer.as_asgi()),
]