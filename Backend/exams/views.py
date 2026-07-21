from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from users.permissions import IsFaculty
from questions.models import Question
from .models import Exam
from .serializers import ExamSerializer
from results.models import Result


class CreateExamView(APIView):
    permission_classes = [IsFaculty]

    def post(self, request):
        serializer = ExamSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(faculty=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ListExamsView(APIView):
    def get(self, request):
        exams = Exam.objects.all()
        serializer = ExamSerializer(exams, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
class UpdateExamView(APIView):
    permission_classes = [IsFaculty]

    def put(self, request, exam_id):
        try:
            exam = Exam.objects.get(id=exam_id)
        except Exam.DoesNotExist:
            return Response({'error': 'Exam not found'}, status=status.HTTP_404_NOT_FOUND)

        if exam.faculty != request.user:
            return Response({'error': 'You can only edit your own exam'}, status=status.HTTP_403_FORBIDDEN)

        serializer = ExamSerializer(exam, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DeleteExamView(APIView):
    permission_classes = [IsFaculty]

    def delete(self, request, exam_id):
        try:
            exam = Exam.objects.get(id=exam_id)
        except Exam.DoesNotExist:
            return Response({'error': 'Exam not found'}, status=status.HTTP_404_NOT_FOUND)

        if exam.faculty != request.user:
            return Response({'error': 'You can only delete your own exam'}, status=status.HTTP_403_FORBIDDEN)

        exam.delete()
        return Response({'message': 'Exam deleted successfully'}, status=status.HTTP_200_OK)    
class UpcomingExamsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        now = timezone.now()
        exams = Exam.objects.filter(end_time__gte=now)
        data = []
        for e in exams:
            done = Result.objects.filter(student=request.user, exam=e).exists()
            if done:
                exam_status = 'completed'
            elif e.start_time <= now <= e.end_time:
                exam_status = 'available'
            else:
                exam_status = 'upcoming'
            data.append({
                'id': e.id,
                'title': e.title,
                'subject': e.title,
                'duration': e.duration,
                'total_marks': e.total_marks,
                'start_time': e.start_time,
                'status': exam_status
            })
        return Response(data)
class FacultyDashboardView(APIView):
    permission_classes = [IsFaculty]

    def get(self, request):
        now = timezone.now()
        my_exams = Exam.objects.filter(faculty=request.user)
        total_exams = my_exams.count()
        total_questions = Question.objects.filter(exam__faculty=request.user).count()
        upcoming_exams = my_exams.filter(start_time__gt=now).count()

        return Response({
            'total_exams': total_exams,
            'total_questions': total_questions,
            'upcoming_exams': upcoming_exams
        })


class FacultyExamsView(APIView):
    permission_classes = [IsFaculty]

    def get(self, request):
        exams = Exam.objects.filter(faculty=request.user)
        data = []
        for e in exams:
            q_count = Question.objects.filter(exam=e).count()
            data.append({
                'id': e.id,
                'title': e.title,
                'subject': e.title,
                'duration': e.duration,
                'total_marks': e.total_marks,
                'question_count': q_count,
                'status': 'published'
            })
        return Response(data)