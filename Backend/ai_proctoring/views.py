from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from users.permissions import IsFaculty
from exams.models import Exam
from .models import AILog
from .serializers import AILogSerializer
from django.utils import timezone
from datetime import timedelta
import cv2
import numpy as np
import base64
import os
from django.conf import settings

class LogWarningView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        exam_id = request.data.get('exam')
        warning_type = request.data.get('warning_type')

        try:
            exam = Exam.objects.get(id=exam_id)
        except Exam.DoesNotExist:
            return Response({'error': 'Exam not found'}, status=status.HTTP_404_NOT_FOUND)

        cooldown_seconds = 10
        recent_same_warning = AILog.objects.filter(
            student=request.user,
            exam=exam,
            warning_type=warning_type,
            timestamp__gte=timezone.now() - timedelta(seconds=cooldown_seconds)
        ).exists()

        if not recent_same_warning:
            log = AILog.objects.create(
                student=request.user,
                exam=exam,
                warning_type=warning_type
            )
        else:
            log = AILog.objects.filter(student=request.user, exam=exam, warning_type=warning_type).latest('timestamp')

        warning_count = AILog.objects.filter(student=request.user, exam=exam).count()
        flagged = warning_count >= 3

        serializer = AILogSerializer(log)
        return Response({
            'log': serializer.data,
            'warning_count': warning_count,
            'flagged': flagged
        }, status=status.HTTP_201_CREATED)


class StudentWarningsView(APIView):
    """Faculty views all warnings for a specific exam (all students)."""
    permission_classes = [IsFaculty]

    def get(self, request, exam_id):
        try:
            exam = Exam.objects.get(id=exam_id)
        except Exam.DoesNotExist:
            return Response({'error': 'Exam not found'}, status=status.HTTP_404_NOT_FOUND)

        if exam.faculty != request.user:
            return Response({'error': 'You can only view warnings for your own exam'}, status=status.HTTP_403_FORBIDDEN)

        logs = AILog.objects.filter(exam=exam)

        student_warnings = {}
        for log in logs:
            key = log.student.id
            if key not in student_warnings:
                student_warnings[key] = {
                    'student_id': log.student.id,
                    'student_name': log.student.name,
                    'warning_count': 0,
                    'warnings': []
                }
            student_warnings[key]['warning_count'] += 1
            student_warnings[key]['warnings'].append({
                'type': log.warning_type,
                'timestamp': log.timestamp
            })

        for data in student_warnings.values():
            data['flagged'] = data['warning_count'] >= 3

        return Response(list(student_warnings.values()), status=status.HTTP_200_OK)


class DetectFaceView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        exam_id = request.data.get('exam')
        image_data = request.data.get('image')

        if not image_data:
            return Response({'error': 'No image provided'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            exam = Exam.objects.get(id=exam_id)
        except Exam.DoesNotExist:
            return Response({'error': 'Exam not found'}, status=status.HTTP_404_NOT_FOUND)

        try:
            if ',' in image_data:
                image_data = image_data.split(',')[1]

            image_bytes = base64.b64decode(image_data)
            np_arr = np.frombuffer(image_bytes, np.uint8)
            img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)
            if img is None or img.shape[0] < 100 or img.shape[1] < 100:
                return Response({'error': 'Image is too small or invalid for reliable detection'}, status=status.HTTP_400_BAD_REQUEST)

            frontal_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_frontalface_default.xml")
            profile_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + "haarcascade_profileface.xml")

            if frontal_cascade.empty() or profile_cascade.empty():
                raise Exception("Failed to load one or more Haar Cascade files")

            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

            frontal_faces = frontal_cascade.detectMultiScale(gray, scaleFactor=1.05, minNeighbors=5, minSize=(25, 25))
            profile_faces = profile_cascade.detectMultiScale(gray, scaleFactor=1.05, minNeighbors=5, minSize=(25, 25))

            def boxes_overlap(box1, box2):
                x1, y1, w1, h1 = box1
                x2, y2, w2, h2 = box2
                return not (x1 + w1 < x2 or x2 + w2 < x1 or y1 + h1 < y2 or y2 + h2 < y1)

            frontal_list = list(frontal_faces)
            profile_list = list(profile_faces)

            unique_profile = [
                p for p in profile_list
                if not any(boxes_overlap(p, f) for f in frontal_list)
            ]

            face_count = len(frontal_list) + len(unique_profile)

            warning_type = None
            if face_count == 0:
                warning_type = 'face_missing'
            elif face_count > 1:
                warning_type = 'multiple_faces'

            warning_count = AILog.objects.filter(student=request.user, exam=exam).count()
            flagged = warning_count >= 3

            if warning_type:
                cooldown_seconds = 30
                recent_same_warning = AILog.objects.filter(
                    student=request.user,
                    exam=exam,
                    warning_type=warning_type,
                    timestamp__gte=timezone.now() - timedelta(seconds=cooldown_seconds)
                    ).exists()

            if not recent_same_warning:
                AILog.objects.create(
                    student=request.user,
                    exam=exam,
                    warning_type=warning_type
                )
                warning_count = AILog.objects.filter(student=request.user, exam=exam).count()
                flagged = warning_count >= 3

            return Response({
                'face_count': face_count,
                'warning_type': warning_type,
                'warning_count': warning_count,
                'flagged': flagged
            }, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({'error': f'Image processing failed: {str(e)}'}, status=status.HTTP_400_BAD_REQUEST)


