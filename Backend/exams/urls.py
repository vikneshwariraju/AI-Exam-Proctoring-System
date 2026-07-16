from django.urls import path
from .views import CreateExamView, ListExamsView

urlpatterns = [
    path('create/', CreateExamView.as_view(), name='create-exam'),
    path('list/', ListExamsView.as_view(), name='list-exams'),
]