from django.urls import path
from .views import CalculateResultView, ViewResultView, FacultyViewExamResultsView, PublishResultView, PublishAllResultsView

urlpatterns = [
    path('calculate/<int:exam_id>/', CalculateResultView.as_view(), name='calculate-result'),
    path('view/<int:exam_id>/', ViewResultView.as_view(), name='view-result'),
    path('faculty/exam-results/<int:exam_id>/', FacultyViewExamResultsView.as_view(), name='faculty-exam-results'),
    path('publish/<int:result_id>/', PublishResultView.as_view(), name='publish-result'),
    path('publish-all/<int:exam_id>/', PublishAllResultsView.as_view(), name='publish-all-results'),
]