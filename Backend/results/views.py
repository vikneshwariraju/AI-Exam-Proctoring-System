from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from exams.models import Exam
from questions.models import Question
from submissions.models import StudentAnswer
from .models import Result
from .serializers import ResultSerializer


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