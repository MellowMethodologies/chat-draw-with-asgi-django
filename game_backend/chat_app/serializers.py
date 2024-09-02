from rest_framework import serializers
from .models import ChatMessage, CustomUser

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'profile_picture', 'name', 'description', 'friends']
    def get_friends(self, obj):
        return UserSerializer(obj.friends.all(), many=True).data

class ChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = '__all__'

class FriendSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'name', 'profile_picture']