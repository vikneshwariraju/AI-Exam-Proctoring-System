from django.db import models
from users.models import User
from exams.models import Exam
from questions.models import Question

class StudentAnswer(models.Model):
    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='answers')
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE, related_name='student_answers')
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='student_responses')
    selected_option = models.CharField(max_length=255)
    submitted_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('student', 'exam', 'question')  # one answer per question per student per exam

    def __str__(self):
        return f"{self.student.name} - {self.exam.title} - Q{self.question.id}"