from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.utils import timezone
from exams.models import Exam
from questions.models import Question
from .models import StudentAnswer
from .serializers import StudentAnswerSerializer


class StartExamView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, exam_id):
        try:
            exam = Exam.objects.get(id=exam_id)
        except Exam.DoesNotExist:
            return Response({'error': 'Exam not found'}, status=status.HTTP_404_NOT_FOUND)

        now = timezone.now()
        if now < exam.start_time:
            return Response({'error': 'Exam has not started yet'}, status=status.HTTP_400_BAD_REQUEST)
        if now > exam.end_time:
            return Response({'error': 'Exam has already ended'}, status=status.HTTP_400_BAD_REQUEST)

        questions = Question.objects.filter(exam=exam)
        questions_data = [{
            'id': q.id,
            'question_text': q.question_text,
            'option1': q.option1,
            'option2': q.option2,
            'option3': q.option3,
            'option4': q.option4,
            'difficulty': q.difficulty,
        } for q in questions]

        return Response({
            'exam_id': exam.id,
            'title': exam.title,
            'duration': exam.duration,
            'total_marks': exam.total_marks,
            'questions': questions_data
        }, status=status.HTTP_200_OK)


class SubmitAnswerView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        data = request.data.copy()

        exam_id = data.get('exam')
        question_id = data.get('question')

        try:
            exam = Exam.objects.get(id=exam_id)
        except Exam.DoesNotExist:
            return Response({'error': 'Exam not found'}, status=status.HTTP_404_NOT_FOUND)

        now = timezone.now()
        if now > exam.end_time:
            return Response({'error': 'Exam time is over, cannot submit'}, status=status.HTTP_400_BAD_REQUEST)

        existing = StudentAnswer.objects.filter(
            student=request.user, exam_id=exam_id, question_id=question_id
        ).first()

        if existing:
            existing.selected_option = data.get('selected_option')
            existing.save()
            serializer = StudentAnswerSerializer(existing)
            return Response(serializer.data, status=status.HTTP_200_OK)

        serializer = StudentAnswerSerializer(data=data)
        if serializer.is_valid():
            serializer.save(student=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)