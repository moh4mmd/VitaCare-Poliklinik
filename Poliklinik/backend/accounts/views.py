from django.conf import settings
from django.contrib.auth import get_user_model
from django.db import transaction, IntegrityError
from rest_framework import status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import RegisterSerializer, CustomTokenObtainPairSerializer, DoctorTokenObtainPairSerializer

User = get_user_model()

class RegisterView(APIView):
    permission_classes = [AllowAny]
    authentication_classes = []
    throttle_scope = 'anon' # Apply 5/min limit

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        if serializer.is_valid():
            email = serializer.validated_data['email']
            
            # Concurrency protection using atomic transactions and catching IntegrityError
            try:
                with transaction.atomic():
                    # We rely on the database's UNIQUE constraint on email for concurrent requests
                    user = serializer.save()
                    
                    # Generate tokens for the new user
                    refresh = RefreshToken.for_user(user)
                    
                    response = Response({
                        "message": "User registered successfully.",
                        "user": {
                            "email": user.email,
                            "first_name": user.first_name,
                            "last_name": user.last_name
                        }
                    }, status=status.HTTP_201_CREATED)
                    
                    # Set HttpOnly Cookies
                    response.set_cookie(
                        key=settings.SIMPLE_JWT['AUTH_COOKIE'], 
                        value=str(refresh.access_token),
                        max_age=int(settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'].total_seconds()),
                        secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
                        httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
                        samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE']
                    )
                    response.set_cookie(
                        key=settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'], 
                        value=str(refresh),
                        max_age=int(settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'].total_seconds()),
                        secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
                        httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
                        samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE']
                    )
                    return response
                    
            except IntegrityError:
                return Response({
                    "email": ["A user with this email already exists."]
                }, status=status.HTTP_400_BAD_REQUEST)
                
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class LoginView(TokenObtainPairView):
    permission_classes = [AllowAny]
    authentication_classes = []
    serializer_class = CustomTokenObtainPairSerializer
    throttle_scope = 'anon'

    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        
        if response.status_code == 200:
            access_token = response.data.get('access')
            refresh_token = response.data.get('refresh')
            role = response.data.get('role', 'patient')
            user_name = response.data.get('user_name', 'Doktor')

            res = Response({
                "access": access_token,
                "refresh": refresh_token,
                "role": role,
                "user_name": user_name
            }, status=status.HTTP_200_OK)

            res.set_cookie(
                key=settings.SIMPLE_JWT['AUTH_COOKIE'], 
                value=access_token,
                max_age=int(settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'].total_seconds()),
                secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
                httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
                samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE']
            )
            res.set_cookie(
                key=settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'], 
                value=refresh_token,
                max_age=int(settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'].total_seconds()),
                secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
                httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
                samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE']
            )
            return res
            
        return response

class LogoutView(APIView):
    def post(self, request):
        response = Response({"message": "Successfully logged out."}, status=status.HTTP_200_OK)
        response.delete_cookie(settings.SIMPLE_JWT['AUTH_COOKIE'])
        response.delete_cookie(settings.SIMPLE_JWT['AUTH_COOKIE_REFRESH'])
        return response
