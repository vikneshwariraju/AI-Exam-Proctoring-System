from rest_framework import serializers
from .models import Result


class ResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = Result
        fields = ['id', 'student', 'exam', 'marks', 'percentage', 'created_at']
        read_only_fields = ['created_at']