from django.http import JsonResponse
from .models import ChatMessage

def get_chat_history(request):
    messages = ChatMessage.objects.order_by('-timestamp')[:50]  # Get last 50 messages
    data = [{'username': msg.username, 'content': msg.content, 'timestamp': msg.timestamp} for msg in messages]
    return JsonResponse({'messages': data})