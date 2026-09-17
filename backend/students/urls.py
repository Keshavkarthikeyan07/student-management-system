"""URL routing for the students app."""

from django.urls import path
from . import views

urlpatterns = [
    path("", views.student_list_create, name="student-list-create"),
    path("<int:pk>/", views.student_detail, name="student-detail"),
]
