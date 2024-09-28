from django.shortcuts import render
#from django.contrib.auth.models import User
from rest_framework import generics
#from .serializers import UserSerializer, NoteSerializer
from itertools import chain
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from .models import Note
from django.contrib.auth import authenticate
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
import re


# For new user model
from .models import ExtendedUser , Message , Article , Comment , PersonalDetails , Notifications , Jobs
from .serializers import CustomUserSerializer, NoteSerializer
from rest_framework.decorators import api_view
from django.db.models import Q
from django.conf import settings


# CreateAPIView is used for creating a new object in the database
# it connects to the user model via the serializer (UserSerializer) and when a POST request is made to this view, 
# it uses the data passed through the request to create a new user based on the validation rules in the serializer.
class CreateUserView(generics.CreateAPIView):
    # retrieves all instances of the User model from the database and returns a queryset containing all users.
    queryset = ExtendedUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [AllowAny]



# APIView is a more basic, low-level view 
# Unlike the generic views (like CreateAPIView), it does not have predefined behavior 
# APIView gives you full control over how you handle requests (e.g., GET, POST, PUT, DELETE).
# Function LoginView : Takes login data (username, password, role) from the form.jsx and returns an access/refresh token if the user is authenticated.
class LoginView(APIView):
    # Allows anyone to enter this class even if you are authenticated or not
    permission_classes = [AllowAny]

    # post method is defined to handle authentication. 
    # When the view receives a POST request, it uses the provided data (username, password, role) to authenticate the user and return a token.
    # const res = await api.post(route , data); <-- this is from the form.jsx route represents login or sign up data represents data
    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")
        role = request.data.get("role")
        

        # Get the username from the user and authenticate
        user = authenticate(username=username, password=password)


        if user is not None:
            # If the user is an admin
            if role == 'admin' and user.is_superuser:
                # creating both access and refresh tokens
                refresh = RefreshToken.for_user(user)
                return Response({
                    # returning access and refresh token values
                    'access': str(refresh.access_token),
                    'refresh': str(refresh),
                }, status=status.HTTP_200_OK)

            # If the user is a professional
            elif role == 'professional' and not user.is_superuser:
                refresh = RefreshToken.for_user(user)
                return Response({
                    'access': str(refresh.access_token),
                    'refresh': str(refresh),
                }, status=status.HTTP_200_OK)

            else:
                return Response({"error": "Role mismatch."}, status=status.HTTP_400_BAD_REQUEST)
        
        return Response({"error": "Invalid credentials."}, status=status.HTTP_401_UNAUTHORIZED)


######################################################################
# I will delete this classes soon we dont need them
class NoteListCreate(generics.ListCreateAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author=user)

    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(author=self.request.user)
        else:
            print(serializer.errors)


class NoteDelete(generics.DestroyAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author=user)

## CLASSES ABOUT USERS
#######################################################################################################

# A list of all the users for the admin only
class UserListView(APIView):
    # only admins have access to this class
    permission_classes = [IsAdminUser]

    def get(self, request):
        # getting all users of the user model 
        users = ExtendedUser.objects.all().values('id', 'username', 'email' ,'phone_number')
        # sending response back
        return Response(users)

# A list of all the users
class UsernamesListView(APIView):
    # only admins have access to this class
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # getting all users of the user model 
        users = ExtendedUser.objects.all().values('id','username')
        # sending response back
        return Response(users)
    

# Return single users info or change users info (will be added)
class UserInfo(APIView):
    permission_classes = [IsAuthenticated]

    # Get user info and photo profile of the authenticated user
    def get(self, request):
        user_data = ExtendedUser.objects.filter(id=request.user.id).values('id', 'username', 'profile_picture','email', 'phone_number', 'my_articles')
        for user in user_data:
            if user['profile_picture']:
                # REturn the full path for the image 
                user['profile_picture'] = request.build_absolute_uri(settings.MEDIA_URL + user['profile_picture'])
        # Send back information
        return Response(user_data)

    # change email and password for current user
    def put(self, request):
        try:    
            # Old password check
            old_password = request.data.get("old_password")
            # New password
            password = request.data.get("new_password")
            # New email
            email =  request.data.get("new_email")

            if not password or not email:
                return Response({"error": "New password and email are required"}, status=status.HTTP_400_BAD_REQUEST)


            # Gets the current user from the request
            user = request.user

            # Check if user entered the correct password
            if user.check_password(old_password):
                # Step 2: Update password and email
                user.set_password(password)  # This automatically hashes the new password
                user.email = email
                
                # Step 3: Save changes
                user.save()
            
                # Send back information   
                return Response({"message": "Email and password updated"}, status=status.HTTP_202_ACCEPTED)
            else:
                return Response({"error": "Incorrect old password"}, status=status.HTTP_400_BAD_REQUEST)
                
            
        except ExtendedUser.DoesNotExist:
            # if the try failed there are no users being followed by the user_id
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

###########################################
## Adding personal details to the current user

class AddPersonalDetails(APIView):
    permission_classes = [IsAuthenticated]
    def get(self , request):
        user = request.user
        user_details = user.personal_details
        details = {"experience": user_details.experience ,"education": user_details.education , "skills": user_details.skills, "experience_public": user_details.isExperiencePublic, "education_public": user_details.isEducationPublic , "skills_public": user_details.isSkillsPublic }
        return Response(details)

    def post(self , request):
        # if field is empty keep it empty
        experience = request.data.get("experience", "")
        education = request.data.get("education", "")
        skills = request.data.get("skills", "")
        experience_public = request.data.get("experience_public", "false").lower() == "true"
        education_public = request.data.get("education_public", "false").lower() == "true"
        skills_public = request.data.get("skills_public", "false").lower() == "true"
        
        details = PersonalDetails.objects.create(experience= experience ,education= education , skills= skills, isExperiencePublic= experience_public, isEducationPublic= education_public , isSkillsPublic= skills_public )
        user = request.user
        if user.personal_details == None:
            user.personal_details=details
        else:
            old_details = user.personal_details
            old_details.delete()
            user.personal_details=details

        user.save()
        return Response({"article": "Article was created successfully"}, status=status.HTTP_201_CREATED)


################################################################################################
##############################################
# Send and get messages

class MessagesBetweenUsers(APIView):
    permission_classes = [IsAuthenticated]
    # Function to get a list if all the messages that were exchanged between logged in user and selected user
    def get(self, request, user_id):

        try:
            other_user = ExtendedUser.objects.get(id=user_id)
        except ExtendedUser.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        # List of all the messages either 
        # from logged in user that were sent to selected user or 
        # from selected user that were sent to logged in user
        # ordered by the time they were created
        messages = Message.objects.filter(
            (Q(sender=request.user) & Q(receiver=other_user)) |
            (Q(sender=other_user) & Q(receiver=request.user))
        ).order_by('created_at')
        
        # Serialize messages and return the full list
        serialized_messages = [
            {"sender": msg.sender.username, "receiver": msg.receiver.username, "content": msg.content, "created_at": msg.created_at}
            for msg in messages
        ]
        return Response(serialized_messages, status=status.HTTP_200_OK)

    # Function to create and save a new message from logged in user to the selected user
    def post(self, request, user_id):
        # Search for selected user
        try:
            receiver = ExtendedUser.objects.get(id=user_id)
        except ExtendedUser.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        
        # Content of the message
        content = request.data.get("content")
        if not content:
            return Response({"error": "Content cannot be empty"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Create new message
        message = Message.objects.create(sender=request.user, receiver=receiver, content=content)
        return Response({"message": "Message sent successfully"}, status=status.HTTP_201_CREATED)
    

########################################################################################################
# Connections between users

class ConnectionView(APIView):
    permission_classes = [IsAuthenticated]
    # View follows and followers list of user with the user_id
    def get(self, request, user_id):
        try:
            # Get user inforamtion of the user with id = user_id
            user = ExtendedUser.objects.get(id=user_id)
            # Get all the connected users
            follows = user.follows.all()
            # serialize the list to return
            serialized_follows = [{"id": conn.id, "username": conn.username, "email": conn.email, "phone_number": conn.phone_number} for conn in follows]

            followers = user.follower.all()
            serialized_followers = [{"id": conn.id, "username": conn.username, "email": conn.email, "phone_number": conn.phone_number} for conn in followers]
            requested = user.request_to_others.all()
            serialized_requested = [{"id": conn.id, "username": conn.username, "email": conn.email, "phone_number": conn.phone_number} for conn in requested]
            # Return the data as a dictionary
            response = {
                "following": serialized_follows,
                "followers": serialized_followers,
                "requested": serialized_requested
            }
            return Response(response, status=status.HTTP_200_OK)
        except ExtendedUser.DoesNotExist:
            # if the try failed there are no users being followed by the user_id
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    # A new request to follow a user 
    # the connection is going to be one way like a follow if the other user accepts it
    # user_id requst to follow connection_id
    def post(self, request, user_id):
        try:
            # get information about the user_id
            user = ExtendedUser.objects.get(id=user_id)
            # get the id of the user that the user_id is trying to connect with
            connection_id = request.data.get("connection_id")
            # get the information of that user
            connection = ExtendedUser.objects.get(id=connection_id)
            # add the information of the connected user to the list of connected users
            user.request_to_others.add(connection)
            # add the follower to the connection_id users followers list
            # Add that id to notification
            connection.request_from_others.add(user)

            # CREATE NOTIFICATION!!!! 
            # article = Article.objects.create(title=title, content=content, author=author, image=photo, public=public)
            notification = Notifications.objects.create(type="follow_request" , type_id=user_id)
            # Add the notification to the user's list that we want to follow
            connection.notifications.add(notification)
            

            # return a message that the connection was successful
            return Response({"message": "follow request was sent successfully"}, status=status.HTTP_201_CREATED)
        except ExtendedUser.DoesNotExist:
            # in case the try did not go through with the connection
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    # Unfollow a user
    def delete(self, request, user_id):
        try:
            # get information about the user_id
            user = ExtendedUser.objects.get(id=user_id)
            # get the id of the user that the user_id is trying to unfollow
            connection_ID = request.query_params.get("connection_id")
        
            # get the information of that user
            connection = ExtendedUser.objects.get(id=connection_ID)
            if connection in user.follows.all():
                user.follows.remove(connection)
                connection.follower.remove(user)
            elif connection in user.request_to_others.all():
                user.request_to_others.remove(connection)
                connection.request_from_others.remove(user)
            
            return Response({"message": "Unfollow was successfull"}, status=status.HTTP_201_CREATED)
        except ExtendedUser.DoesNotExist:
            # in case the try did not go through with the connection
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)


######################################################################


class NotificationView(APIView):
    permission_classes = [IsAuthenticated]
    # A list of all the notifications for connected user
    def get(self, request ):
        try:
            # current connected user
            user = request.user
            # notifications of the user
            notifications = user.notifications.all()

            serialized_notifications = [{"id": notification.id, "type": notification.type, "type_id": notification.type_id, "created_at": notification.created_at} for notification in notifications]
            # return the list of dictionaries
            return Response(serialized_notifications, status=status.HTTP_200_OK)
        
        except ExtendedUser.DoesNotExist:
            # if the try failed there are no users being followed by the user_id
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    # Since new notifications are created in totally different categories
    # We will accept or deny connections through the notification page
    def post(self, request ):
        try:
            print("Entered post function")
            # Accepts or denies a follow request
            user = request.user
            print(f"User ID: {user.id}")
            # if option is accepted we get the type id to find the the connection 
            # in the request from user list in the current user
            # the id is the user that made the folllow request and current user decides to accept or not
            print(f"Request data: {request.data}")
            decision = request.data.get("decision")
            # id from user that wants to follow
            follower_id = request.data.get("type_id")
            # id to delete the notification later
            notification_id = request.data.get("notification_id")
            print(f"Decision: {decision}, Follower ID: {follower_id}, Notification ID: {notification_id}")

            # profile of the user that wants to follow current user
            new_follower = user.request_from_others.filter(id=follower_id).first()
            if not new_follower:
                return Response({"error": "Follower not found"}, status=status.HTTP_404_NOT_FOUND)
            #print(new_follower)
            print(f"new_follower ID: {new_follower.id}")

            if decision.lower() == 'accept' :
                
                # users model modified
                user.follower.add(new_follower)
                user.request_from_others.remove(new_follower)
                # new follower model modified
                new_follower.follows.add(user)
                new_follower.request_to_others.remove(user)
            else:
                # Remove the connection from both requested lists
                user.request_from_others.remove(new_follower)
                new_follower.request_to_other.remove(user)

            # Get the notification object and delete
            notification = Notifications.objects.get(id=notification_id)
            notification.delete()
            return Response("Notification process was sucessfull" , status=status.HTTP_200_OK)
        except ExtendedUser.DoesNotExist:
            # if the try failed there are no users being followed by the user_id
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
    # if the notification id is empty it removes all notifications 
    # if the notification id is not empty we remove that notification 
    def delete(self , request):
        try:
            notification_id = request.query_params.get("notification_id")
            if notification_id :
                notification = Notifications.objects.get(id=notification_id)
                notification.delete()
                return Response({"notification": "notification was deleted"}, status=status.HTTP_200_OK)
            else:
                
                Notifications.objects.all().delete()
                return Response({"notification" : "all notifications were deleted"}, status=status.HTTP_200_OK)

        except Notifications.DoesNotExist:
            # if the try failed there are no users being followed by the user_id
            return Response({"error": "Notifications not found"}, status=status.HTTP_404_NOT_FOUND)




#########################################################################################################
"""
    I will change that to just public and every user has a list of all the shared with them articles 
    that other users connected with them liked

    i Will create a function that will return all articles that other users who are connected with current user liked
"""
class Articles(APIView):
    # Everyone who is authenticated has access
    permission_classes=[IsAuthenticated]

    # If the frontend sent an article_id it will send back information of that article else it will
    # Returns a list of all articles that are made public or private 
    def get(self, request, user_id):
        # Check if a specific article title is passed in the request
        article_id = request.query_params.get('article_id')

        if article_id:
            # If article_title is provided, return the specific article
            try:
                article = Article.objects.get(id=article_id)
                serialized_article = {
                    "id": article.id,
                    "title": article.title,
                    "content": article.content,
                    "created_at": article.created_at,
                    "author": article.author.username,
                    "image": request.build_absolute_uri(article.image.url) if article.image else None,
                    "likes": [{"id": like.id, "username": like.username} for like in article.likes.all()]
                }
                return Response(serialized_article, status=status.HTTP_200_OK)
            except Article.DoesNotExist:
                return Response({"error": "Article not found"}, status=status.HTTP_404_NOT_FOUND)
        
        # If no specific article_id is passed, return all articles as before
        try:
            # All public articles
            # Get all public articles
            public_articles = Article.objects.filter(public=True)
            
            # Get the current user and their followed users
            current_user = request.user
            follows = current_user.follows.all()

            # get current users private articles
            my_private_articles = current_user.my_articles.filter(public=False)
            
            # A list for private articles
            private_articles = list(my_private_articles)
            
            # Collect private articles for each followed user
            for user in follows:
                users_private_articles = user.articles.filter(public=False)
                private_articles = list(chain(private_articles, users_private_articles))  # Merge private articles

            # Combine public and private articles
            all_articles = list(chain(public_articles, private_articles))

            serialized_articles = [
                {
                    "id": article.id,
                    "title": article.title,
                    "content": article.content,
                    "created_at": article.created_at,
                    "author": article.author.username,
                    "image": request.build_absolute_uri(article.image.url) if article.image else None,
                    "likes": [{"id": like.id, "username": like.username} for like in article.likes.all()]
                }
                for article in all_articles
            ]
            return Response(serialized_articles, status=status.HTTP_200_OK)
        except Article.DoesNotExist:
            return Response({"error": "Articles not found"}, status=status.HTTP_404_NOT_FOUND)


    # creating a new article    
    def post(self, request, user_id):
        # data from request will have object title , object content and object photo , 
        author = ExtendedUser.objects.get(id=user_id)
        title = request.data.get("title")
        content = request.data.get("content")
        # if there is a photo save it
        photo = request.data.get("image")
        # if it is not public its private
        public = request.data.get("public")
        # Convert string to boolean if necessary
        public = request.data.get("public")
        if public in ['true', 'True', '1']:
            public = True
        elif public in ['false', 'False', '0']:
            public = False
        else:
            public = True  # Default value if not specified

        if photo :
            article = Article.objects.create(title=title, content=content, author=author, image=photo, public=public)
        else:
            article = Article.objects.create(title=title, content=content, author=author,image=None, public=public)
        author.my_articles.add(article)
        
        return Response({"article": "Article was created successfully"}, status=status.HTTP_201_CREATED)

    # Only the author gets to delete the article
    def delete(self, request, user_id):
        try:
            # get information about the user_id
            user = ExtendedUser.objects.get(id=user_id)
            # get the id of the user that the user_id is trying to unfollow
            article_id = request.query_params.get("article_id")
        
            # get the information of that article
            article = Article.objects.get(id=article_id)

            if user == article.author:
            # If the user is the author, delete the article
                article.delete()

                return Response({"message": "Article was deleted"}, status=status.HTTP_200_OK)
            else:
                return Response({"error": "User is not the author of the article"}, status=status.HTTP_403_FORBIDDEN)

        except ExtendedUser.DoesNotExist:
            # if the user is not found
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        except Article.DoesNotExist:
            # if the article is not found
            return Response({"error": "Article not found"}, status=status.HTTP_404_NOT_FOUND)
    
##################################################################################################################


# Adding likes on articles or removing likes off articles
class Likes_on_Articles(APIView):
    permission_classes=[IsAuthenticated]
    # when liking an article
    def post(self , request , user_id):
        try:
            user = ExtendedUser.objects.get(id=user_id)

            article_title = request.data.get("article_title")

            article = Article.objects.get(title=article_title)

            user.liked_articles.add(article)
            
            article.likes.add(user)

            # Add notification about a new_like on the article's author notification list as new like
            article_author = article.author
            # Except if the creator liked it
            if article_author.id != user_id :
                notification = Notifications.objects.create(type="new_like" , type_id=user_id)
                article_author.notifications.add(notification)

            likes_list = article.likes.all()

            serialized_Likes = [
            {
                "id": like.id, 
                "username": like.username, 
            } for like in likes_list ]
            return Response(serialized_Likes, status=status.HTTP_200_OK)
        except ExtendedUser.DoesNotExist:
            # in case the try did not go through with the connection
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
    
    # Unliking article removing it from the liked articles list 
    def delete(self , request, user_id):
        try:
            user = ExtendedUser.objects.get(id=user_id)

            article_title = request.query_params.get("article_title")

            article = Article.objects.get(title=article_title)

            user.liked_articles.remove(article)
            
            article.likes.remove(user)
            likes_list = article.likes.all()
            serialized_Likes = [
            {
                "id": like.id, 
                "username": like.username, 
            } for like in likes_list ]
            return Response(serialized_Likes, status=status.HTTP_200_OK)
        except ExtendedUser.DoesNotExist:
            # in case the try did not go through with the connection
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        
#####################################################################################################

# Comments on articles
class Commenting(APIView):
    permission_classes=[IsAuthenticated]
    # List of coments on an article
    def get(self , request , article_id):
        try:
            article = Article.objects.get(id= article_id)
            article_comments = article.comments.all()  

            # Serializing the comments
            serialized_comments = [
                {
                    "id": comment.id,
                    "sender": comment.sender.username, 
                    "sender_id": comment.sender.id,
                    "content": comment.content,
                    "created_at": comment.created_at
                } 
                for comment in article_comments
            ]
            
            return Response(serialized_comments , status=status.HTTP_200_OK)
        except Article.DoesNotExist:
            # if the article is not found
            return Response({"error": "Article not found"}, status=status.HTTP_404_NOT_FOUND)

    # Creating a comment on article with article_id
    def post(self , request , article_id):
        try:
            
            article = Article.objects.get(id=article_id)

            comment_content = request.data.get("content")

            author_id = int(request.data.get("author"))

            comment_author = ExtendedUser.objects.get(id=author_id)

            # Create a new comment object and associate it with the article
            new_comment = Comment.objects.create(sender=comment_author, content=comment_content)

            # Add notification about comment on the authors notification list as new_comment
            article_author = article.author
            print(article_author.id , author_id)
            print(f"article_author.id: {article_author.id} (type: {type(article_author.id)})")
            print(f"author_id: {author_id} (type: {type(author_id)})")
            if article_author.id != author_id :
                print(article_author.id , author_id)
                notification = Notifications.objects.create(type="new_comment" , type_id=author_id)
                article_author.notifications.add(notification)

            article.comments.add(new_comment)
            return Response("Comment was uploaded", status=status.HTTP_200_OK)
        except ExtendedUser.DoesNotExist:
            # if the user is not found
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        except Article.DoesNotExist:
            # if the article is not found
            return Response({"error": "Article not found"}, status=status.HTTP_404_NOT_FOUND)

    # Deleting comment on article_id only if the user connected is the author
    def delete(self , request , article_id):
        try:
            article = Article.objects.get(id=article_id)

            comment_id = request.query_params.get("comment_id")

            comment = Comment.objects.get(id=comment_id)

            article.comments.remove(comment)

            comment.delete()
        
            return Response("comment was deleted", status=status.HTTP_200_OK)

        except Article.DoesNotExist:
            # if the article is not found
            return Response({"error": "Article not found"}, status=status.HTTP_404_NOT_FOUND)


##########################################################################################################

class Job_offers(APIView):
    permission_classes=[IsAuthenticated]
    # get a list of jobs for current user
    def get(self , request):
        # return all jobs
        user_id = request.data.get("user_id")
        # if user_id exists we return user_id uploaded jobs
        if user_id :
            user = ExtendedUser.objects.get(id=user_id)
            jobs =  user.my_jobs.all()
            serialized_jobs = [
                {
                "title": job.title,
                "job_creator": {
                        "id": job.job_creator.id,
                        "username": job.job_creator.username,  # Or any field you prefer
                        "email": job.job_creator.email,
                    },
                "company": job.company,
                "location": job.location,
                "created_at": job.created_at,
                "job_type": job.job_type,
                "requested_skills": job.requested_skills,
                "requested_education": job.requested_education,
                "general_information": job.general_information,
                "applicants": [applicant.username for applicant in job.applicants.all()],  # Assuming applicants is a ManyToManyField
                } 
                for job in jobs
            ]
            return Response(serialized_jobs , status=status.HTTP_200_OK)
        # in this case we return all the job offers for the user
        else:
            # We return a list of all jobs filtered in an order according to user skills
            jobs =  Jobs.objects.all()
            user = request.user

            if user.personal_details:
                user_skills = user.personal_details.skills

                if user_skills: 

                    calculated_jobs =[]
                    # Create a list to iterate and search all the words for matches with jobs
                    user_skills_list = re.findall(r'\b\w+\b', user_skills.lower())
                    print(user_skills_list)
                    for job in jobs:
                        job_skills_list = re.findall(r'\b\w+\b', job.requested_skills.lower())
                        print(job_skills_list)
                        match_count = sum(1 for skill in user_skills_list if skill in job_skills_list)
                        
                        # Does not add field to database it just for the calculated_jobs
                        job.match_count = match_count
                        calculated_jobs.append(job)
                    # bring back the sorted list to jobs for serialization
                    jobs = sorted(calculated_jobs , key=lambda job: job.match_count, reverse=True)
                
                        

            # the final list shall be replaced with jobs to be serialized
            serialized_jobs = [
                {
                "id":job.id,
                "title": job.title,
                "job_creator": {
                        "id": job.job_creator.id,
                        "username": job.job_creator.username,  # Or any field you prefer
                        "email": job.job_creator.email,
                    },
                "company": job.company,
                "location": job.location,
                "created_at": job.created_at,
                "job_type": job.job_type,
                "requested_skills": job.requested_skills,
                "requested_education": job.requested_education,
                "general_information": job.general_information,
                "applicants": [applicant.username for applicant in job.applicants.all()],  # Assuming applicants is a ManyToManyField
                } 
                for job in jobs
            ]
            return Response(serialized_jobs , status=status.HTTP_200_OK)
       
    # Creating a new job
    def post(self , request ):
        try:
            # Get data from frontend
            job_creator = request.user
            title = request.data.get('job_title')
            company = request.data.get('company')
            requested_skill = request.data.get('requested_skills')
            requested_education = request.data.get('requested_education')
            location =  request.data.get('location')
            general_info = request.data.get('general_information')
            
            job_type = request.data.get('job_type')
            # ensure the job_type was accepted
            if job_type not in [Jobs.FULL_TIME, Jobs.PART_TIME]:
                return Response("Job type is not acsepted" , status= status.HTTP_404_NOT_FOUND)
            
            # creating a new Job offer
            new_job = Jobs.objects.create(
                job_creator=job_creator,
                title=title,
                company=company,
                requested_skills=requested_skill,
                requested_education=requested_education,
                location=location,
                general_information=general_info,
                job_type=job_type
            )
            # add the job to users jobs
            job_creator.my_jobs.add(new_job)

            return Response({"job_id": new_job.id, "message": "Job offer created successfully"}, status=status.HTTP_201_CREATED)
        except Jobs.DoesNotExist:
            # if the job is not found
            return Response({"error": "Job not found"}, status=status.HTTP_404_NOT_FOUND)

class User_options_jobs(APIView):
    permission_classes = [IsAuthenticated]
    # function to apply for a job {show interest}
    def post(self , request):
        try:
            job_id = request.data.get("job_id")
            print(job_id)
            current_user = request.user
            print(current_user.username)    
            job = Jobs.objects.get(id=job_id)
            print(job)
            job.applicants.add(current_user)
            return Response("job application was applied" , status=status.HTTP_200_OK)
        except Jobs.DoesNotExist:
            return Response({"error": "Job not found"}, status=status.HTTP_404_NOT_FOUND)
        except ExtendedUser.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
    def delete(self , request):
        try:
            job_id = request.query_params.get("job_id")
            job = Jobs.objects.get(id=job_id)
            user = request.user
            if job.job_creator.id == user.id :
                job.delete()
                return Response("job was deleted" , status=status.HTTP_200_OK)
            return Response("user is not creator" , status=status.HTTP_404_NOT_FOUND)
        except Jobs.DoesNotExist:
            return Response({"error": "Job not found"}, status=status.HTTP_404_NOT_FOUND)
        except ExtendedUser.DoesNotExist:
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

        