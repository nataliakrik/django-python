from django.urls import path
from . import views

urlpatterns = [
    path("notes/", views.NoteListCreate.as_view(), name="note-list"),
    path("notes/delete/<int:pk>/", views.NoteDelete.as_view(), name="delete-note"),
    path("comments/<int:article_id>/", views.Commenting.as_view(), name="commenting"),
    path("user/details/", views.AddPersonalDetails.as_view(), name="user-details"),
    path("notifications/", views.NotificationView.as_view(), name="user-notifications"),
    path("jobs/", views.Job_offers.as_view(), name="job-offers"),
    path("jobs/options/", views.User_options_jobs.as_view() ,name="job-extension"),
]