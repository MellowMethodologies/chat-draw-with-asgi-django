import json
from channels.generic.websocket import AsyncWebsocketConsumer
from asgiref.sync import sync_to_async
from .models import ChatMessage
from django.utils import timezone   

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.channel_layer.group_add("chat", self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard("chat", self.channel_name)

    async def receive(self, text_data):
        text_data_json = json.loads(text_data)
        message_type = text_data_json['type']
        username = text_data_json['username']

        if message_type == 'message':
            message = text_data_json['message']
            timestamp = timezone.now().isoformat()
            await self.save_message(username, message)
            await self.channel_layer.group_send(
                "chat",
                {
                    'type': 'chat_message',
                    'username': username,
                    'message': message,
                    'timestamp': timestamp
                }
            )
        elif message_type == 'username':
            await self.channel_layer.group_send(
                "chat",
                {
                    'type': 'user_joined',
                    'username': username
                }
            )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            'type': 'message',
            'username': event['username'],
            'content': event['message'],
            'timestamp': event['timestamp']
        }))

    async def user_joined(self, event):
        await self.send(text_data=json.dumps({
            'type': 'notification',
            'content': f"{event['username']} has joined the chat.",
            'timestamp': timezone.now().isoformat()
        }))

    @sync_to_async
    def save_message(self, username, message):
        ChatMessage.objects.create(username=username, content=message)