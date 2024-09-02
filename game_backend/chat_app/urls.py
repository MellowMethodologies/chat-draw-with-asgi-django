from django.urls import path
from . import views

urlpatterns = [
    path('messages/', views.get_chat_messages),
    path('users/', views.get_all_users),
    path('users/<int:user_id>/add_friend/<int:friend_id>/', views.add_friend, name='add_friend'),
    path('users/<int:user_id>/remove_friend/<int:friend_id>/', views.remove_friend, name='remove_friend'),
    path('users/<int:user_id>/friends/', views.get_friends, name='get_friends'),
]