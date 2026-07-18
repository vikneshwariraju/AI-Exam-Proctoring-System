from django.urls import path
from .views import LogWarningView, StudentWarningsView

urlpatterns = [
    path('log/', LogWarningView.as_view(), name='log-warning'),
    path('warnings/<int:exam_id>/', StudentWarningsView.as_view(), name='student-warnings'),
]