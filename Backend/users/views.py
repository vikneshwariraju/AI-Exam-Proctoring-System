from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .models import User
from .serializers import UserSerializer
from .permissions import IsAdmin

class RegisterView(APIView):
    def post(self, request):
        data = request.data.copy()
        data['role'] = 'student'  # force role to student, ignore whatever was sent

        serializer = UserSerializer(data=data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                'id': user.id,
                'name': user.name,
                'email': user.email,
                'role': user.role
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(APIView):
    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')

        user = authenticate(request, email=email, password=password)

        if user is None:
            return Response({'error': 'Invalid email or password'}, status=status.HTTP_400_BAD_REQUEST)

        refresh = RefreshToken.for_user(user)

        return Response({
            'token': str(refresh.access_token),
            'refresh': str(refresh),
            'role': user.role,
            'name': user.name,
            'user_id': user.id
        }, status=status.HTTP_200_OK)


class TestProtectedView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({'message': f'Hello {request.user}, you are authenticated!'})
    
class CreateFacultyView(APIView):
    permission_classes = [IsAdmin]

    def post(self, request):
        data = request.data.copy()
        data['role'] = 'faculty'  # force role to faculty

        serializer = UserSerializer(data=data)
        if serializer.is_valid():
            user = serializer.save()
            return Response({
                'id': user.id,
                'name': user.name,
                'email': user.email,
                'role': user.role
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)