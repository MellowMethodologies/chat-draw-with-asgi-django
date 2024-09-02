from django.core.management.base import BaseCommand
from django.contrib.auth import get_user_model

User = get_user_model()

class Command(BaseCommand):
    help = 'Creates sample users for the chat app'

    def handle(self, *args, **kwargs):
        users_data = [
            {'username': 'alice', 'email': 'alice@example.com', 'password': 'password123', 'profile_picture': '1.jpg'},
            {'username': 'bob', 'email': 'bob@example.com', 'password': 'password123', 'profile_picture': '2.jpg'},
            {'username': 'charlie', 'email': 'charlie@example.com', 'password': 'password123', 'profile_picture': '3.jpg'},
        ]

        for user_data in users_data:
            user, created = User.objects.get_or_create(
                username=user_data['username'],
                email=user_data['email'],
                defaults={'is_active': True}
            )
            if created:
                user.set_password(user_data['password'])
                user.save()
                self.stdout.write(self.style.SUCCESS(f'User "{user.username}" created successfully'))
            else:
                self.stdout.write(self.style.WARNING(f'User "{user.username}" already exists'))