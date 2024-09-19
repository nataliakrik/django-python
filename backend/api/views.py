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

#"""
# EXTENDED USER CHANGES

# For new user model
from .models import ExtendedUser , Message
from .serializers import CustomUserSerializer, NoteSerializer
from rest_framework.decorators import api_view
from django.db.models import Q
from django.conf import settings

#this was the create user view for the extended user

# CreateAPIView is used for creating a new object in the database
# it connects to the user model via the serializer (UserSerializer) and when a POST request is made to this view, 
# it uses the data passed through the request to create a new user based on the validation rules in the serializer.
class CreateUserView(generics.CreateAPIView):
    # retrieves all instances of the User model from the database and returns a queryset containing all users.
    queryset = ExtendedUser.objects.all()
    serializer_class = CustomUserSerializer
    permission_classes = [AllowAny]


# change the user in the UserListView class too

#"""



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


"""
# CreateAPIView is used for creating a new object in the database
# it connects to the user model via the serializer (UserSerializer) and when a POST request is made to this view, 
# it uses the data passed through the request to create a new user based on the validation rules in the serializer.
class CreateUserView(generics.CreateAPIView):
    # retrieves all instances of the User model from the database and returns a queryset containing all users.
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]


"""


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
class Usename_Photo(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        # Get username and photo of the authenticated user
        user_data = ExtendedUser.objects.filter(id=request.user.id).values('id', 'username', 'profile_picture')
        for user in user_data:
            if user['profile_picture']:
                # REturn the full path for the image 
                user['profile_picture'] = request.build_absolute_uri(settings.MEDIA_URL + user['profile_picture'])
        # Send back information
        return Response(user_data)


##############################################
# Send and get messages

class MessagesBetweenUsers(APIView):
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