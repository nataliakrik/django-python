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
from .models import ExtendedUser , Message , Article
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




# A list of all the users
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
    

# Return username and photo
class UserInfo(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        # Get username and photo of the authenticated user
        user_data = ExtendedUser.objects.filter(id=request.user.id).values('id', 'username', 'profile_picture','email', 'phone_number', 'my_articles')
        for user in user_data:
            if user['profile_picture']:
                # REturn the full path for the image 
                user['profile_picture'] = request.build_absolute_uri(settings.MEDIA_URL + user['profile_picture'])
        # Send back information
        return Response(user_data)


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


class Articles(APIView):
    # Everyone who is authenticated has access
    permission_classes=[IsAuthenticated]

    def get(self, request, user_id):
        try:
            # Get all articles
            articles = Article.objects.all()
            
            # serialize the list to return
            serialized_Articles = [
            {
                "title": article.title, 
                "content": article.content, 
                "created_at": article.created_at, 
                "author": article.author.username  # Access author's username
            } 
            for article in articles]   
            # Return the data as a dictionary
            # response = serialized_Articles
            return Response(serialized_Articles, status=status.HTTP_200_OK)
        except Article.DoesNotExist:
            # if the try failed there are no users being followed by the user_id
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)

    # creating a new article    
    def post(self, request, user_id):
        # data from request will have object title , object content and object photo , 
        author = ExtendedUser.objects.get(id=user_id)
        title = request.data.get("title")
        content = request.data.get("content")
        # if there is a photo save it
        photo = request.data.get("photo")
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
            article = Article.objects.create(title=title, content=content, author=author, public=public)
        author.my_articles.add(article)
        
        return Response({"article": "Article was created successfully"}, status=status.HTTP_201_CREATED)

    def delete(self, request, user_id):
        try:
            # get information about the user_id
            user = ExtendedUser.objects.get(id=user_id)
            # get the id of the user that the user_id is trying to unfollow
            article_title = request.query_params.get("article_title")
        
            # get the information of that user
            article = Article.objects.get(title=article_title)

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

            return Response({"article": "liked article"}, status=status.HTTP_200_OK)
        except ExtendedUser.DoesNotExist:
            # in case the try did not go through with the connection
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
    
    def delete(self , request, user_id):
        try:
            user = ExtendedUser.objects.get(id=user_id)

            article_title = request.query_params.get("article_title")

            article = Article.objects.get(title=article_title)

            user.liked_articles.remove(article)
            
            article.likes.remove(user)

            return Response({"article": "unliked article"}, status=status.HTTP_200_OK)
        except ExtendedUser.DoesNotExist:
            # in case the try did not go through with the connection
            return Response({"error": "User not found"}, status=status.HTTP_404_NOT_FOUND)
        

# commit on git