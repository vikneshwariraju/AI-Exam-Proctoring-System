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