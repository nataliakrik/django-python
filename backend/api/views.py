from django.shortcuts import render
#from django.contrib.auth.models import User
from rest_framework import generics
#from .serializers import UserSerializer, NoteSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser
from .models import Note
from django.contrib.auth import authenticate
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken


# For new user model
from .models import ExtendedUser , Message , Article , Comment , PersonalDetails
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
        username = request.data.get('username')
        #email = request.data.get('email')
        password = request.data.get('password')
        role = request.data.get('role')

        # Checks if the user exist and authenticates them
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
    # View follows list of user with the user_id
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
            # Return the data as a dictionary
            response = {
                "following": serialized_follows,
                "followers": serialized_followers
            }
            return Response(response, status=status.HTTP_200_OK)
        except ExtendedUser.DoesNotExist:
            # if the try failed there are no users being followed by the user_id
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    # Add a new following to user_id
    # the connection is going to be one way like a follow
    # user_id following connection_id
    def post(self, request, user_id):
        try:
            # get information about the user_id
            user = ExtendedUser.objects.get(id=user_id)
            # get the id of the user that the user_id is trying to connect with
            connection_id = request.data.get("connection_id")
            # get the information of that user
            connection = ExtendedUser.objects.get(id=connection_id)
            # add the information of the connected user to the list of connected users
            user.follows.add(connection)
            # add the follower to the connection_id users followers list
            connection.follower.add(user)
            # return a message that the connection was successful
            return Response({"message": "Connection added successfully"}, status=status.HTTP_201_CREATED)
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
            
            
            return Response({"message": "Unfollow was successfull"}, status=status.HTTP_201_CREATED)
        except ExtendedUser.DoesNotExist:
            # in case the try did not go through with the connection
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)


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
            articles = Article.objects.all()
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
                for article in articles
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

            author_id = request.data.get("author")

            comment_author = ExtendedUser.objects.get(id=author_id)

            # Create a new comment object and associate it with the article
            new_comment = Comment.objects.create(sender=comment_author, content=comment_content)

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
        
            return Response("comment was deleted", status=status.HTTP_200_OK)\

        except Article.DoesNotExist:
            # if the article is not found
            return Response({"error": "Article not found"}, status=status.HTTP_404_NOT_FOUND)


##########################################################################################################
