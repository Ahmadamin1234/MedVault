from django.contrib.auth.models import User
from django.db import models


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    phone_number = models.CharField(max_length=30)
    pharmacy_name = models.CharField(max_length=150)

    def __str__(self):
        return self.user.username
