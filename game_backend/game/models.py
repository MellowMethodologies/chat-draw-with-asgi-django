from django.db import models

# Create your models here.
class gameSession(models.Model):
        session_id = models.CharField(max_length=100, unique=True)
        created_at = models.DateTimeField(auto_now_add=True)