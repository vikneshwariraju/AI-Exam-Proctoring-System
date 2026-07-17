from django.db import models
from users.models import User
from exams.models import Exam


class AILog(models.Model):
    WARNING_TYPES = (
        ('face_missing', 'Face Missing'),
        ('multiple_faces', 'Multiple Faces'),
        ('tab_switch', 'Tab Switch'),
    )

    student = models.ForeignKey(User, on_delete=models.CASCADE, related_name='ai_logs')
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE, related_name='ai_logs')
    warning_type = models.CharField(max_length=20, choices=WARNING_TYPES)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.student.name} - {self.exam.title} - {self.warning_type}"