from django.db import models
#from django.contrib.auth.models import User

#"""
# CUSTOM USER MODEL CHANGES
# AbstractUser adds fields to the standard user model
from django.contrib.auth.models import AbstractUser
from django.conf import settings # Import settings for AUTH_USER_MODEL


class Comment(models.Model):
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, related_name="sent_comments", on_delete=models.CASCADE)  # Changed related_name
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    # the id of the article that the comment was made in
    article_id = models.IntegerField()
    def __str__(self):
        return f"From {self.sender} at {self.created_at}"
    

class Jobs(models.Model):
    FULL_TIME = 'full_time'
    PART_TIME = 'part_time'
    # Available options for the job type
    TYPE_CHOICES =[
        (FULL_TIME , 'full time job'),
        (PART_TIME , 'part time job'),
    ]
    # job title
    title = models.CharField(max_length=100 , unique=True)
    # user who created the job offer
    job_creator = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="jobs")
    # the company of the job 
    company = models.TextField()
    # location
    location = models.TextField()
    # time the job was created
    created_at = models.DateTimeField(auto_now_add=True)
    # full time or part time job
    job_type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    # job qualifications
    requested_skills = models.TextField()
    requested_education = models.TextField()
    # general information about the job 
    general_information = models.TextField()
    # a list of users who applied for this job
    applicants = models.ManyToManyField(settings.AUTH_USER_MODEL, symmetrical=False, related_name='job_aplicants', blank=True) 


# Article model as before
class Article(models.Model):
    title = models.CharField(max_length=100 , unique=True)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="articles")
    public = models.BooleanField()
    comments = models.ManyToManyField(Comment, symmetrical=False, related_name='comments', blank=True) 
    likes = models.ManyToManyField(settings.AUTH_USER_MODEL, symmetrical=False, related_name='likes', blank=True) 
    image = models.ImageField(upload_to='article_images/', blank=True, null=True)  

    def __str__(self):
        return self.title

class Notifications(models.Model):
    FOLLOW_REQUEST = 'follow_request'
    NEW_LIKE = 'new_like'
    NEW_COMMENT = 'new_comment'
    
    NOTIFICATION_TYPE_CHOICES = [
        (FOLLOW_REQUEST, 'New Follow Request'),
        (NEW_LIKE, 'New Like'),
        (NEW_COMMENT, 'New Comment'),
    ]
    # the notification type has to be one of these:
    # 1) new follow request 2) new like 3)new comment
    type = models.CharField(max_length=20, choices=NOTIFICATION_TYPE_CHOICES)
    # time of notification
    created_at = models.DateTimeField(auto_now_add=True)
    # id of the object that this notification is about
    type_id = models.IntegerField()

# A class that will be contained by the extended user class
class PersonalDetails(models.Model):
    experience = models.TextField()
    education = models.TextField()
    skills = models.TextField()
    isExperiencePublic = models.BooleanField()
    isEducationPublic = models.BooleanField()
    isSkillsPublic = models.BooleanField()


# extending default user model
class ExtendedUser(AbstractUser):
    #adding phone num to the user
    phone_number = models.CharField(max_length=20, blank=True, null=True)
    # adding picture to the user
    profile_picture = models.ImageField(upload_to='profiles/', blank=True, null=True)
    # class for the personal details of the user
    personal_details = models.ForeignKey(PersonalDetails, on_delete=models.CASCADE, related_name="further_details", blank=True, null=True)
    # A list of all the users that current user follows
    follows = models.ManyToManyField('self', symmetrical=False, related_name='following', blank=True)
    # A list of all the users that are following current user
    follower = models.ManyToManyField('self', symmetrical=False, related_name='followers', blank=True)
    # A list of all the users that the current user requested to follow
    request_to_others = models.ManyToManyField('self', symmetrical=False, related_name='follow_to_others', blank=True)
    # A list of all the users that requested to follow current user
    request_from_others = models.ManyToManyField('self', symmetrical=False, related_name='follow_from_others', blank=True)
    # A list of articles published by user
    my_articles = models.ManyToManyField(Article, symmetrical=False, related_name='Articles_by_user', blank=True)
    # A list of all the articles the user liked
    liked_articles = models.ManyToManyField(Article, symmetrical=False, related_name='liked', blank=True)
    # A list of all the comments the user made
    my_comments = models.ManyToManyField(Comment, symmetrical=False, related_name='comments_by_user', blank=True)
    # A list for users notifications
    notifications = models.ManyToManyField(Notifications, symmetrical=False, related_name='notifications', blank=True)
    # A list of jobs that user published
    my_jobs = models.ManyToManyField(Jobs, symmetrical=False, related_name='Jobs_by_user', blank=True)
    # A list of jobs the user has aplied
    applications = models.ManyToManyField(Jobs, symmetrical=False, related_name='applications', blank=True)

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
