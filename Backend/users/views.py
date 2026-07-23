from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import User
from .serializers import UserSerializer
from .permissions import IsAdmin
from django.utils import timezone
from django.db.models import Count
from exams.models import Exam
from ai_proctoring.models import AILog
from django.core.mail import send_mail
from .models import PasswordResetOTP

class RegisterView(APIView):
    def post(self, request):
        data = request.data.copy()
        data['role'] = 'student'

        serializer = UserSerializer(data=data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                'id': user.id,
                'name': user.name,
                'email': user.email,
                'role': user.role
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        if not email or not password:
            return Response({'error': 'Email and password are required'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = authenticate(request, email=email, password=password)
        except Exception as e:
            return Response({'error': f'Server error: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        if user is None:
            try:
                existing_user = User.objects.get(email=email)
                return Response({'error': 'Incorrect password'}, status=status.HTTP_400_BAD_REQUEST)
            except User.DoesNotExist:
                return Response({'error': 'No account found with this email'}, status=status.HTTP_404_NOT_FOUND)

        refresh = RefreshToken.for_user(user)

        return Response({
            'token': str(refresh.access_token),
            'refresh': str(refresh),
            'role': user.role,
            'name': user.name,
            'user_id': user.id
        }, status=status.HTTP_200_OK)

class TestProtectedView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({'message': f'Hello {request.user}, you are authenticated!'})

class CreateFacultyView(APIView):
    permission_classes = [IsAdmin]

    def post(self, request):
        data = request.data.copy()
        data['role'] = 'faculty'

        serializer = UserSerializer(data=data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                'id': user.id,
                'name': user.name,
                'email': user.email,
                'role': user.role
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
 

class UserStatsView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request):
        total_students = User.objects.filter(role='student').count()
        total_faculty = User.objects.filter(role='faculty').count()
        total_admins = User.objects.filter(role='admin').count()

        return Response({
            'total_students': total_students,
            'total_faculty': total_faculty,
            'total_admins': total_admins,
            'total_users': total_students + total_faculty + total_admins
        }, status=status.HTTP_200_OK)
class AdminDashboardView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request):
        now = timezone.now()
        total_students = User.objects.filter(role='student').count()
        total_faculty = User.objects.filter(role='faculty').count()
        active_exams = Exam.objects.filter(start_time__lte=now, end_time__gte=now).count()

        flagged_alerts = (
            AILog.objects.values('student', 'exam')
            .annotate(cnt=Count('id'))
            .filter(cnt__gte=3)
            .count()
        )

        return Response({
            'total_students': total_students,
            'total_faculty': total_faculty,
            'active_exams': active_exams,
            'flagged_alerts': flagged_alerts
        })


class ListStudentsView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request):
        students = list(User.objects.filter(role='student').values('id', 'name', 'email', 'created_at'))
        return Response(students)


class ListFacultyView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request):
        faculty = list(User.objects.filter(role='faculty').values('id', 'name', 'email', 'created_at'))
        return Response(faculty)


class AdminExamsView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request):
        exams = Exam.objects.select_related('faculty').all()
        data = [{
            'id': e.id,
            'title': e.title,
            'faculty_name': e.faculty.name,
            'total_marks': e.total_marks,
            'start_time': e.start_time,
            'end_time': e.end_time,
        } for e in exams]
        return Response(data)
class ForgotPasswordView(APIView):
    def post(self, request):
        email = request.data.get('email')

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'error': 'No account found with this email'}, status=status.HTTP_404_NOT_FOUND)

        otp = PasswordResetOTP.generate_otp()
        PasswordResetOTP.objects.create(user=user, otp=otp)

        send_mail(
            subject='Password Reset OTP - AI Exam Proctoring System',
            message=f'Your OTP for password reset is: {otp}\nThis OTP is valid for 10 minutes.',
            from_email=None,
            recipient_list=[email],
            fail_silently=False,
        )

        return Response({'message': 'OTP sent to your email'}, status=status.HTTP_200_OK)


class ResetPasswordView(APIView):
    def post(self, request):
        email = request.data.get('email')
        otp = request.data.get('otp')
        new_password = request.data.get('new_password')
        confirm_password = request.data.get('confirm_password')

        if new_password != confirm_password:
            return Response({'error': 'Passwords do not match'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({'error': 'No account found with this email'}, status=status.HTTP_404_NOT_FOUND)

        otp_record = PasswordResetOTP.objects.filter(user=user, otp=otp).order_by('-created_at').first()

        if not otp_record or not otp_record.is_valid():
            return Response({'error': 'Invalid or expired OTP'}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()

        otp_record.is_used = True
        otp_record.save()

        return Response({'message': 'Password reset successful'}, status=status.HTTP_200_OK)
class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        old_password = request.data.get('old_password')
        new_password = request.data.get('new_password')
        confirm_password = request.data.get('confirm_password')

        if not request.user.check_password(old_password):
            return Response({'error': 'Old password is incorrect'}, status=status.HTTP_400_BAD_REQUEST)

        if new_password != confirm_password:
            return Response({'error': 'New passwords do not match'}, status=status.HTTP_400_BAD_REQUEST)

        request.user.set_password(new_password)
        request.user.save()

        return Response({'message': 'Password changed successfully'}, status=status.HTTP_200_OK)