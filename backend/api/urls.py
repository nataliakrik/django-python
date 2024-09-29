from django.urls import path
from . import views

urlpatterns = [
    path("comments/<int:article_id>/", views.Commenting.as_view(), name="commenting"),
    path("user/details/", views.AddPersonalDetails.as_view(), name="user-details"),
    path("notifications/", views.NotificationView.as_view(), name="user-notifications"),
    path("jobs/", views.Job_offers.as_view(), name="job-offers"),
    path("jobs/options/", views.User_options_jobs.as_view() ,name="job-extension"),
]