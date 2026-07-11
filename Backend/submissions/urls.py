from django.urls import path
from .views import StartExamView, SubmitAnswerView

urlpatterns = [
    path('start/<int:exam_id>/', StartExamView.as_view(), name='start-exam'),
    path('submit/', SubmitAnswerView.as_view(), name='submit-answer'),
]