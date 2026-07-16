from rest_framework import serializers
from .models import StudentAnswer


class StudentAnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentAnswer
        fields = ['id', 'student', 'exam', 'question', 'selected_option', 'submitted_at']
        read_only_fields = ['student', 'submitted_at']