from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from users.permissions import IsFaculty
from exams.models import Exam
from .models import AILog
from .serializers import AILogSerializer


class LogWarningView(APIView):
    """Called by the frontend whenever it detects suspicious activity."""
    permission_classes = [IsAuthenticated]

    def post(self, request):
        exam_id = request.data.get('exam')
        warning_type = request.data.get('warning_type')

        try:
            exam = Exam.objects.get(id=exam_id)
        except Exam.DoesNotExist:
            return Response({'error': 'Exam not found'}, status=status.HTTP_404_NOT_FOUND)

        log = AILog.objects.create(
            student=request.user,
            exam=exam,
            warning_type=warning_type
        )

        warning_count = AILog.objects.filter(student=request.user, exam=exam).count()

        flagged = warning_count >= 3

        serializer = AILogSerializer(log)
        return Response({
            'log': serializer.data,
            'warning_count': warning_count,
            'flagged': flagged
        }, status=status.HTTP_201_CREATED)


class StudentWarningsView(APIView):
    """Faculty views all warnings for a specific exam (all students)."""
    permission_classes = [IsFaculty]

    def get(self, request, exam_id):
        try:
            exam = Exam.objects.get(id=exam_id)
        except Exam.DoesNotExist:
            return Response({'error': 'Exam not found'}, status=status.HTTP_404_NOT_FOUND)

        if exam.faculty != request.user:
            return Response({'error': 'You can only view warnings for your own exam'}, status=status.HTTP_403_FORBIDDEN)

        logs = AILog.objects.filter(exam=exam)

        student_warnings = {}
        for log in logs:
            key = log.student.id
            if key not in student_warnings:
                student_warnings[key] = {
                    'student_id': log.student.id,
                    'student_name': log.student.name,
                    'warning_count': 0,
                    'warnings': []
                }
            student_warnings[key]['warning_count'] += 1
            student_warnings[key]['warnings'].append({
                'type': log.warning_type,
                'timestamp': log.timestamp
            })

        for data in student_warnings.values():
            data['flagged'] = data['warning_count'] >= 3

        return Response(list(student_warnings.values()), status=status.HTTP_200_OK)