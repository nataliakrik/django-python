from django.db import models
#from django.contrib.auth.models import User

#"""
# CUSTOM USER MODEL CHANGES
# AbstractUser adds fields to the standard user model
from django.contrib.auth.models import AbstractUser
from django.conf import settings # Import settings for AUTH_USER_MODEL

# extending default user model
class ExtendedUser(AbstractUser):
    #adding phone num to the user
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    # adding picture to the user
    profile_picture = models.ImageField(upload_to='profiles/', blank=True, null=True)
    # A list of all the users that current user follows
    follows = models.ManyToManyField('self', symmetrical=False, related_name='following', blank=True)
    # A list of all the users that are following current user
    follower = models.ManyToManyField('self', symmetrical=False, related_name='followers', blank=True)

# change the line in the notes class to this
# author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="notes")

#"""
    
# Note model as before
class Note(models.Model):
    title = models.CharField(max_length=100)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="notes")

    def __str__(self):
        return self.title

# Messages base model 
# This model tracks who sent the message who received it and the content of the message
# we can adjust it to include read status or attachments
class Message(models.Model):
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, related_name="sent_messages", on_delete=models.CASCADE)
    receiver = models.ForeignKey(settings.AUTH_USER_MODEL, related_name="received_messages", on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return f"From {self.sender} to {self.receiver} at {self.created_at}"
