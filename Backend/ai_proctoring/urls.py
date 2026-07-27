from django.urls import path
from .views import LogWarningView, StudentWarningsView, DetectFaceView

urlpatterns = [
    path('log/', LogWarningView.as_view(), name='log-warning'),
    path('warnings/<int:exam_id>/', StudentWarningsView.as_view(), name='student-warnings'),
    path('detect-face/', DetectFaceView.as_view(), name='detect-face'),
]