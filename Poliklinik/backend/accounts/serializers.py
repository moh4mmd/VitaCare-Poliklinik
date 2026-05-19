import re
from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})

    class Meta:
        model = User
        fields = ('email', 'password', 'first_name', 'last_name')
        extra_kwargs = {
            'first_name': {'required': True},
            'last_name': {'required': True}
        }

    def validate_password(self, value):
        # Strict Password Complexity Validation
        if len(value) < 8:
            raise serializers.ValidationError("Password must be at least 8 characters long.")
        if not re.search(r'[A-Z]', value):
            raise serializers.ValidationError("Password must contain at least one uppercase letter.")
        if not re.search(r'[a-z]', value):
            raise serializers.ValidationError("Password must contain at least one lowercase letter.")
        if not re.search(r'[0-9]', value):
            raise serializers.ValidationError("Password must contain at least one number.")
        if not re.search(r'[!@#$%^&*(),.?":{}|<>]', value):
            raise serializers.ValidationError("Password must contain at least one special character.")
        
        # Django's built-in validators
        validate_password(value)
        return value

    def create(self, validated_data):
        user = User.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        return user


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        try:
            data = super().validate(attrs)
        except Exception:
            # Generic error message to prevent user enumeration
            raise serializers.ValidationError({
                "detail": "Invalid credentials provided. Please check your email and password."
            })
        
        # We can add custom claims here if needed
        data['email'] = self.user.email
        data['role'] = getattr(self.user, 'role', 'patient')
        data['user_name'] = self.user.last_name or self.user.first_name or 'Doktor'
        return data


class DoctorTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        try:
            data = super().validate(attrs)
        except Exception:
            raise serializers.ValidationError({
                "detail": "Invalid credentials provided."
            })
        
        if getattr(self.user, 'role', '') != 'doctor':
            raise serializers.ValidationError({
                "detail": "No active doctor account found with the given credentials."
            })
            
        data['email'] = self.user.email
        data['role'] = self.user.role
        return data
