from django.urls import path
from .views import CalculateResultView, ViewResultView

urlpatterns = [
    path('calculate/<int:exam_id>/', CalculateResultView.as_view(), name='calculate-result'),
    path('view/<int:exam_id>/', ViewResultView.as_view(), name='view-result'),
]