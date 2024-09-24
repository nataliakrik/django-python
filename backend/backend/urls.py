from django.contrib import admin
from django.urls import path, include
from api.views import CreateUserView, LoginView, UserListView, UsernamesListView , MessagesBetweenUsers , UserInfo , ConnectionView, Articles, Likes_on_Articles
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/user/register/", CreateUserView.as_view(), name="register"),
    path("api/token/", TokenObtainPairView.as_view(), name="get_token"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="refresh"),
    path("api-auth/", include("rest_framework.urls")),
    path("api/", include("api.urls")),
    path('api/login/', LoginView.as_view(), name='login'),
    path('api/admin/users/', UserListView.as_view(), name='user-list'),
    path('api/usernames/', UsernamesListView.as_view(), name='username-list'),
    path('messages/<int:user_id>/', MessagesBetweenUsers.as_view(), name='messages_between_users'),
    path('api/usernameAndPhoto/', UserInfo.as_view(), name='username-photo'),
    path('api/connections/<int:user_id>/', ConnectionView.as_view()),
    path("api/articles/<int:user_id>/", Articles.as_view(), name='articles_list'),
    path("api/articles/likes/<int:user_id>/", Likes_on_Articles.as_view(), name='articles_likes'),
]


# Handle media files during development
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)