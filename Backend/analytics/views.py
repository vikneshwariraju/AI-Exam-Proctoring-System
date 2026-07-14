from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from users.permissions import IsFaculty
from exams.models import Exam
from questions.models import Question
from submissions.models import StudentAnswer
from results.models import Result


class StudentPerformanceView(APIView):
    """Shows a student their own performance breakdown by difficulty for one exam."""
    permission_classes = [IsAuthenticated]

    def get(self, request, exam_id):
        try:
            exam = Exam.objects.get(id=exam_id)
        except Exam.DoesNotExist:
            return Response({'error': 'Exam not found'}, status=status.HTTP_404_NOT_FOUND)

        answers = StudentAnswer.objects.filter(student=request.user, exam=exam)

        if not answers.exists():
            return Response({'error': 'No submission found for this exam'}, status=status.HTTP_404_NOT_FOUND)

        difficulty_stats = {
            'easy': {'total': 0, 'correct': 0},
            'medium': {'total': 0, 'correct': 0},
            'hard': {'total': 0, 'correct': 0},
        }

        for ans in answers:
            diff = ans.question.difficulty
            difficulty_stats[diff]['total'] += 1
            if ans.selected_option.strip().lower() == ans.question.answer.strip().lower():
                difficulty_stats[diff]['correct'] += 1

        weak_areas = []
        for diff, stats in difficulty_stats.items():
            if stats['total'] > 0:
                accuracy = (stats['correct'] / stats['total']) * 100
                stats['accuracy'] = round(accuracy, 2)
                if accuracy < 50:
                    weak_areas.append(diff)
            else:
                stats['accuracy'] = None

        result = Result.objects.filter(student=request.user, exam=exam).first()

        return Response({
            'exam_id': exam.id,
            'exam_title': exam.title,
            'marks': result.marks if result else None,
            'percentage': result.percentage if result else None,
            'difficulty_breakdown': difficulty_stats,
            'weak_areas': weak_areas
        }, status=status.HTTP_200_OK)


class ExamAnalyticsView(APIView):
    """Shows faculty class-wide performance for their exam."""
    permission_classes = [IsFaculty]

    def get(self, request, exam_id):
        try:
            exam = Exam.objects.get(id=exam_id)
        except Exam.DoesNotExist:
            return Response({'error': 'Exam not found'}, status=status.HTTP_404_NOT_FOUND)

        if exam.faculty != request.user:
            return Response({'error': 'You can only view analytics for your own exam'}, status=status.HTTP_403_FORBIDDEN)

        results = Result.objects.filter(exam=exam)

        if not results.exists():
            return Response({'error': 'No results yet for this exam'}, status=status.HTTP_404_NOT_FOUND)

        total_students = results.count()
        avg_marks = sum(r.marks for r in results) / total_students
        avg_percentage = sum(r.percentage for r in results) / total_students
        highest = max(r.marks for r in results)
        lowest = min(r.marks for r in results)

        questions = Question.objects.filter(exam=exam)
        difficulty_class_stats = {'easy': {'total': 0, 'correct': 0}, 'medium': {'total': 0, 'correct': 0}, 'hard': {'total': 0, 'correct': 0}}

        all_answers = StudentAnswer.objects.filter(exam=exam)
        for ans in all_answers:
            diff = ans.question.difficulty
            difficulty_class_stats[diff]['total'] += 1
            if ans.selected_option.strip().lower() == ans.question.answer.strip().lower():
                difficulty_class_stats[diff]['correct'] += 1

        for diff, stats in difficulty_class_stats.items():
            stats['accuracy'] = round((stats['correct'] / stats['total']) * 100, 2) if stats['total'] > 0 else None

        return Response({
            'exam_id': exam.id,
            'exam_title': exam.title,
            'total_students': total_students,
            'average_marks': round(avg_marks, 2),
            'average_percentage': round(avg_percentage, 2),
            'highest_marks': highest,
            'lowest_marks': lowest,
            'class_difficulty_breakdown': difficulty_class_stats
        }, status=status.HTTP_200_OK)
