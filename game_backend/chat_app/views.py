from django.shortcuts import render
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import ChatMessage
from .serializers import ChatMessageSerializer, UserSerializer
from django.contrib.auth.models import User
from django.shortcuts import get_object_or_404
from .models import CustomUser
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import parser_classes
from django.contrib.auth import get_user_model

User = get_user_model()

@api_view(['GET', 'POST'])
@parser_classes([MultiPartParser, FormParser])
def get_chat_messages(request):
    if request.method == 'GET':
        chat_messages = ChatMessage.objects.all().order_by('-timestamp')
        serializer = ChatMessageSerializer(chat_messages, many=True)
        return Response(serializer.data)
    elif request.method == 'POST':
        serializer = ChatMessageSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

@api_view(['GET'])
def get_all_users(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)

# ############################ #
@api_view(['POST'])
def add_friend(request, user_id, friend_id):
    user = get_object_or_404(CustomUser, id=user_id)
    friend = get_object_or_404(CustomUser, id=friend_id)
    user.friends.add(friend)
    user.save()
    return Response({'message': f'{friend.username} added as a friend of {user.username}'})

@api_view(['POST'])
def remove_friend(request, user_id, friend_id):
    user = get_object_or_404(CustomUser, id=user_id)
    friend = get_object_or_404(CustomUser, id=friend_id)
    user.friends.remove(friend)
    user.save()
    return Response({'message': f'{friend.username} removed as a friend of {user.username}'})

@api_view(['GET'])
def get_friends(request, user_id):
    user = get_object_or_404(CustomUser, id=user_id)
    friends = user.friends.all()
    serializer = UserSerializer(friends, many=True)
    return Response(serializer.data)
# ############################ #


# @api_view(['POST'])
# def create_chat_message(request):
#     serializer = ChatMessageSerializer(data=request.data)
#     if serializer.is_valid():
#         serializer.save()
#         return Response(serializer.data, status=201)
#     return Response(serializer.errors, status=400)