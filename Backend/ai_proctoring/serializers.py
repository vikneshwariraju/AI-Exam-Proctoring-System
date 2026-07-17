from rest_framework import serializers
from .models import AILog


class AILogSerializer(serializers.ModelSerializer):
    class Meta:
        model = AILog
        fields = ['id', 'student', 'exam', 'warning_type', 'timestamp']
        read_only_fields = ['student', 'timestamp']