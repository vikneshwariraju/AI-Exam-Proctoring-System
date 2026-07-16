from django.db import models
from users.models import User


class Exam(models.Model):
    faculty = models.ForeignKey(User, on_delete=models.CASCADE, related_name='exams')
    title = models.CharField(max_length=200)
    total_marks = models.IntegerField()
    duration = models.IntegerField(help_text="Duration in minutes")
    start_time = models.DateTimeField()
    end_time = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title