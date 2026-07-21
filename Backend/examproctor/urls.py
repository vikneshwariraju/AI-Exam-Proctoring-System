from django.contrib import admin
from django.urls import path, include

from results.views import StudentDashboardView, RecentResultsView, StudentNotificationsView
from exams.views import UpcomingExamsView, FacultyDashboardView, FacultyExamsView
from users.views import AdminDashboardView, ListStudentsView, ListFacultyView, AdminExamsView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/users/', include('users.urls')),
    path('api/exams/', include('exams.urls')),
    path('api/questions/', include('questions.urls')),
    path('api/submissions/', include('submissions.urls')),
    path('api/results/', include('results.urls')),
    path('api/analytics/', include('analytics.urls')),
    path('api/ai-proctoring/', include('ai_proctoring.urls')),

    # Dashboard-specific endpoints (Vikneshwari's requested paths)
    path('api/student/dashboard/', StudentDashboardView.as_view()),
    path('api/student/upcoming-exams/', UpcomingExamsView.as_view()),
    path('api/student/recent-results/', RecentResultsView.as_view()),
    path('api/student/notifications/', StudentNotificationsView.as_view()),

    path('api/faculty/dashboard/', FacultyDashboardView.as_view()),
    path('api/faculty/exams/', FacultyExamsView.as_view()),

    path('api/admin/dashboard/', AdminDashboardView.as_view()),
    path('api/admin/students/', ListStudentsView.as_view()),
    path('api/admin/faculty/', ListFacultyView.as_view()),
    path('api/admin/exams/', AdminExamsView.as_view()),
]