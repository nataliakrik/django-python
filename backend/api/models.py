from django.db import models
from django.contrib.auth.models import User
"""
# CUSTOM USER MODEL CHANGES
# AbstractUser adds fields to the standard user model
from django.contrib.auth.models import AbstractUser
from django.conf import settings  # Import settings for AUTH_USER_MODEL

# extending default user model
class ExtendedUser(AbstractUser):
    #adding phone num to the user
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    # adding picture to the user
    profile_picture = models.ImageField(upload_to='profiles/', blank=True, null=True)

# chang the line in the notes class to this
# author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="notes")

"""
    
# Note model as before
class Note(models.Model):
    title = models.CharField(max_length=100)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notes")

    def __str__(self):
        return self.title
