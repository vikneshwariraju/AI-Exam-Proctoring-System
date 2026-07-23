from django.urls import path
from .views import (
    RegisterView, LoginView, TestProtectedView, CreateFacultyView, UserStatsView,
    ForgotPasswordView, ResetPasswordView, ChangePasswordView,
    AdminDashboardView, ListStudentsView, ListFacultyView, AdminExamsView
)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('test-protected/', TestProtectedView.as_view(), name='test-protected'),
    path('create-faculty/', CreateFacultyView.as_view(), name='create-faculty'),
    path('stats/', UserStatsView.as_view(), name='user-stats'),
    path('forgot-password/', ForgotPasswordView.as_view(), name='forgot-password'),
    path('reset-password/', ResetPasswordView.as_view(), name='reset-password'),
    path('change-password/', ChangePasswordView.as_view(), name='change-password'),
]