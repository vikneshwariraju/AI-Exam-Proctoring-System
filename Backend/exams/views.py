from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from users.permissions import IsFaculty
from .models import Exam
from .serializers import ExamSerializer


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