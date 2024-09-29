#from django.contrib.auth.models import User
from rest_framework import serializers

# CUSTOM USER MODEL
from .models import ExtendedUser

class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExtendedUser
        fields = ['id', 'username', 'email', 'phone_number','first_name','last_name', 'profile_picture', 'password']
        extra_kwargs = {'password': {'write_only': True}}
    
    # Checks if the email already exists in the data-base
    def validate(self, data):
        if ExtendedUser.objects.filter(email=data['email']).exists():
            raise serializers.ValidationError("A user with that email already exists")
        
        #if data['password'] != data['passwordConfirm']:
        #    raise serializers.ValidationError("Passwords do not match")
        
        return data

    # When new user : This method is called and it uses "User.objects.create_user" to securely create the user with hashed passwords
    def create(self, validated_data):
        password = validated_data.pop('password') 
        user = ExtendedUser.objects.create_user(**validated_data)
        user.set_password(password)  # Hash password
        user.save()
        return user
