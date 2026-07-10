from django.urls import path
from .views import AddQuestionView, ListQuestionsView

urlpatterns = [
    path('add/', AddQuestionView.as_view(), name='add-question'),
    path('list/<int:exam_id>/', ListQuestionsView.as_view(), name='list-questions'),
]