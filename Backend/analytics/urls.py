from django.urls import path
from .views import StudentPerformanceView, ExamAnalyticsView

urlpatterns = [
    path('student-performance/<int:exam_id>/', StudentPerformanceView.as_view(), name='student-performance'),
    path('exam-analytics/<int:exam_id>/', ExamAnalyticsView.as_view(), name='exam-analytics'),
]