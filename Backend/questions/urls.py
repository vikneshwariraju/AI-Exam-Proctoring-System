from django.urls import path
from .views import AddQuestionView, ListQuestionsView, UpdateQuestionView, DeleteQuestionView

urlpatterns = [
    path('add/', AddQuestionView.as_view(), name='add-question'),
    path('list/<int:exam_id>/', ListQuestionsView.as_view(), name='list-questions'),
    path('update/<int:question_id>/', UpdateQuestionView.as_view(), name='update-question'),
    path('delete/<int:question_id>/', DeleteQuestionView.as_view(), name='delete-question'),
]