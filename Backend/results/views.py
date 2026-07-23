from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from django.utils.timesince import timesince
from users.permissions import IsFaculty
from exams.models import Exam
from questions.models import Question
from submissions.models import StudentAnswer
from .models import Result, Notification
from .serializers import ResultSerializer


class CalculateResultView(APIView):
    """Called automatically after submission - calculates marks but does NOT reveal them to student yet."""
    permission_classes = [IsAuthenticated]

    def post(self, request, exam_id):
        try:
            exam = Exam.objects.get(id=exam_id)
        except Exam.DoesNotExist:
            return Response({'error': 'Exam not found'}, status=status.HTTP_404_NOT_FOUND)

        existing = Result.objects.filter(student=request.user, exam=exam).first()
        if existing:
            return Response({'message': 'Exam submitted successfully'}, status=status.HTTP_200_OK)

        answers = StudentAnswer.objects.filter(student=request.user, exam=exam)
        total_questions = Question.objects.filter(exam=exam).count()

        marks_per_question = exam.total_marks / total_questions if total_questions > 0 else 0
        marks = 0

        for ans in answers:
            if ans.selected_option.strip().lower() == ans.question.answer.strip().lower():
                marks += marks_per_question

        percentage = (marks / exam.total_marks) * 100 if exam.total_marks > 0 else 0

        Result.objects.create(
            student=request.user,
            exam=exam,
            marks=round(marks),
            percentage=round(percentage, 2),
            published=False
        )

        return Response({'message': 'Exam submitted successfully'}, status=status.HTTP_201_CREATED)


class ViewResultView(APIView):
    """Student views their own result - only visible if published."""
    permission_classes = [IsAuthenticated]

    def get(self, request, exam_id):
        try:
            result = Result.objects.get(student=request.user, exam_id=exam_id)
        except Result.DoesNotExist:
            return Response({'error': 'Result not found. Please submit the exam first.'}, status=status.HTTP_404_NOT_FOUND)

        if not result.published:
            return Response({'message': 'Result not published yet. Please check back later.'}, status=status.HTTP_200_OK)

        serializer = ResultSerializer(result)
        return Response(serializer.data, status=status.HTTP_200_OK)


class FacultyViewExamResultsView(APIView):
    """Faculty sees all student results for their exam (published or not), to review before publishing."""
    permission_classes = [IsFaculty]

    def get(self, request, exam_id):
        try:
            exam = Exam.objects.get(id=exam_id)
        except Exam.DoesNotExist:
            return Response({'error': 'Exam not found'}, status=status.HTTP_404_NOT_FOUND)

        if exam.faculty != request.user:
            return Response({'error': 'You can only view results for your own exam'}, status=status.HTTP_403_FORBIDDEN)

        results = Result.objects.filter(exam=exam)
        data = [{
            'result_id': r.id,
            'student_id': r.student.id,
            'student_name': r.student.name,
            'marks': r.marks,
            'percentage': r.percentage,
            'published': r.published
        } for r in results]

        return Response(data, status=status.HTTP_200_OK)


class PublishResultView(APIView):
    """Faculty publishes a single student's result - triggers notification."""
    permission_classes = [IsFaculty]

    def post(self, request, result_id):
        try:
            result = Result.objects.get(id=result_id)
        except Result.DoesNotExist:
            return Response({'error': 'Result not found'}, status=status.HTTP_404_NOT_FOUND)

        if result.exam.faculty != request.user:
            return Response({'error': 'You can only publish results for your own exam'}, status=status.HTTP_403_FORBIDDEN)

        result.published = True
        result.save()

        Notification.objects.create(
            student=result.student,
            message=f"Your result for {result.exam.title} has been published",
            type='success'
        )

        return Response({'message': 'Result published successfully'}, status=status.HTTP_200_OK)


class PublishAllResultsView(APIView):
    """Faculty publishes ALL results for an exam at once."""
    permission_classes = [IsFaculty]

    def post(self, request, exam_id):
        try:
            exam = Exam.objects.get(id=exam_id)
        except Exam.DoesNotExist:
            return Response({'error': 'Exam not found'}, status=status.HTTP_404_NOT_FOUND)

        if exam.faculty != request.user:
            return Response({'error': 'You can only publish results for your own exam'}, status=status.HTTP_403_FORBIDDEN)

        results = Result.objects.filter(exam=exam, published=False)
        count = 0

        for result in results:
            result.published = True
            result.save()
            Notification.objects.create(
                student=result.student,
                message=f"Your result for {exam.title} has been published",
                type='success'
            )
            count += 1

        return Response({'message': f'{count} result(s) published successfully'}, status=status.HTTP_200_OK)


class StudentDashboardView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        from exams.models import Exam
        total_exams = Exam.objects.count()
        results = Result.objects.filter(student=request.user, published=True)
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
        results = Result.objects.filter(student=request.user, published=True).order_by('-created_at')[:5]
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