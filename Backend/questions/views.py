from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from users.permissions import IsFaculty
from exams.models import Exam
from .models import Question
from .serializers import QuestionSerializer


class AddQuestionView(APIView):
    permission_classes = [IsFaculty]

    def post(self, request):
        exam_id = request.data.get('exam')

        try:
            exam = Exam.objects.get(id=exam_id)
        except Exam.DoesNotExist:
            return Response({'error': 'Exam not found'}, status=status.HTTP_404_NOT_FOUND)

        if exam.faculty != request.user:
            return Response({'error': 'You can only add questions to your own exam'}, status=status.HTTP_403_FORBIDDEN)

        serializer = QuestionSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ListQuestionsView(APIView):
    def get(self, request, exam_id):
        questions = Question.objects.filter(exam_id=exam_id)
        serializer = QuestionSerializer(questions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
class UpdateQuestionView(APIView):
    permission_classes = [IsFaculty]

    def put(self, request, question_id):
        try:
            question = Question.objects.get(id=question_id)
        except Question.DoesNotExist:
            return Response({'error': 'Question not found'}, status=status.HTTP_404_NOT_FOUND)

        if question.exam.faculty != request.user:
            return Response({'error': 'You can only edit questions in your own exam'}, status=status.HTTP_403_FORBIDDEN)

        serializer = QuestionSerializer(question, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DeleteQuestionView(APIView):
    permission_classes = [IsFaculty]

    def delete(self, request, question_id):
        try:
            question = Question.objects.get(id=question_id)
        except Question.DoesNotExist:
            return Response({'error': 'Question not found'}, status=status.HTTP_404_NOT_FOUND)

        if question.exam.faculty != request.user:
            return Response({'error': 'You can only delete questions in your own exam'}, status=status.HTTP_403_FORBIDDEN)

        question.delete()
        return Response({'message': 'Question deleted successfully'}, status=status.HTTP_200_OK)