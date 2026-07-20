from django.urls import path
from .views import CreateExamView, ListExamsView, UpdateExamView, DeleteExamView

urlpatterns = [
    path('create/', CreateExamView.as_view(), name='create-exam'),
    path('list/', ListExamsView.as_view(), name='list-exams'),
    path('update/<int:exam_id>/', UpdateExamView.as_view(), name='update-exam'),
    path('delete/<int:exam_id>/', DeleteExamView.as_view(), name='delete-exam'),
]