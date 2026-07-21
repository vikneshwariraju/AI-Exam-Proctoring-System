from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from exams.models import Exam
from questions.models import Question
from submissions.models import StudentAnswer
from .models import Result
from .serializers import ResultSerializer
from django.utils import timezone
from django.utils.timesince import timesince
from .models import Result, Notification
from exams.models import Exam


class CalculateResultView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, exam_id):
        try:
            exam = Exam.objects.get(id=exam_id)
        except Exam.DoesNotExist:
            return Response({'error': 'Exam not found'}, status=status.HTTP_404_NOT_FOUND)

        existing = Result.objects.filter(student=request.user, exam=exam).first()
        if existing:
            serializer = ResultSerializer(existing)
            return Response(serializer.data, status=status.HTTP_200_OK)

        answers = StudentAnswer.objects.filter(student=request.user, exam=exam)
        total_questions = Question.objects.filter(exam=exam).count()

        marks_per_question = exam.total_marks / total_questions if total_questions > 0 else 0
        marks = 0

        for ans in answers:
            if ans.selected_option.strip().lower() == ans.question.answer.strip().lower():
                marks += marks_per_question

        percentage = (marks / exam.total_marks) * 100 if exam.total_marks > 0 else 0

        result = Result.objects.create(
            student=request.user,
            exam=exam,
            marks=round(marks),
            percentage=round(percentage, 2)
        )
        Notification.objects.create(
        student=request.user,
        message=f"Your result for {exam.title} is out",
        type='success'
        )

        serializer = ResultSerializer(result)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class ViewResultView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, exam_id):
        try:
            result = Result.objects.get(student=request.user, exam_id=exam_id)
        except Result.DoesNotExist:
            return Response({'error': 'Result not found. Please submit the exam first.'}, status=status.HTTP_404_NOT_FOUND)

        serializer = ResultSerializer(result)
        return Response(serializer.data, status=status.HTTP_200_OK)
class StudentDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        total_exams = Exam.objects.count()
        results = Result.objects.filter(student=request.user)
        completed_exams = results.count()
        average_score = round(sum(r.percentage for r in results) / completed_exams) if completed_exams > 0 else 0

        return Response({
            'total_exams': total_exams,
            'completed_exams': completed_exams,
            'average_score': average_score
        })


class RecentResultsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        results = Result.objects.filter(student=request.user).order_by('-created_at')[:5]
        data = [{
            'id': r.id,
            'title': r.exam.title,
            'score': r.marks,
            'total_marks': r.exam.total_marks,
            'percentage': r.percentage
        } for r in results]
        return Response(data)


class StudentNotificationsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        notifications = Notification.objects.filter(student=request.user).order_by('-created_at')[:10]
        data = [{
            'id': n.id,
            'message': n.message,
            'time': f"{timesince(n.created_at)} ago",
            'type': n.type
        } for n in notifications]
        return Response(data)