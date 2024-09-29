from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
#from django.contrib.auth.models import User


# THE EXTENDED USER CHANGES
from .models import ExtendedUser

class CustomUserAdmin(UserAdmin):
    model = ExtendedUser
    #fields = ('username', 'email', 'first_name', 'last_name', 'phone_number', 'profile_picture', 'is_staff')
    fieldsets = (
         (None, {'fields': ('username', 'password')}),
         ('Personal info', {'fields': ('first_name', 'last_name', 'email', 'phone_number', 'profile_picture')}),
         ('Permissions', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
         ('Important dates', {'fields': ('last_login', 'date_joined')}),
     )
    readonly_fields = ('last_login', 'date_joined')
    list_display = ('username', 'email', 'phone_number', 'is_staff', 'is_active')
    search_fields = ('username', 'email')

admin.site.register(ExtendedUser, CustomUserAdmin)

