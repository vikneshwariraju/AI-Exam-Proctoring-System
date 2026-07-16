from rest_framework import serializers
from .models import Exam


class ExamSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exam
        fields = ['id', 'faculty', 'title', 'total_marks', 'duration', 'start_time', 'end_time', 'created_at']
        read_only_fields = ['faculty', 'created_at']