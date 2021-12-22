from django.contrib.auth import get_user_model
from django.core.validators import RegexValidator

import uuid
from rest_framework import serializers
from dj_rest_auth.serializers import LoginSerializer, PasswordChangeSerializer
from dj_rest_auth.registration.serializers import RegisterSerializer
from session.models import ViViSession


MOD_USERNAME_REGEX = RegexValidator(
    regex=r"^(?!member)[a-zA-Z0-9@#$%^&-_+=()]{8,20}$",
    message="Invalid username for moderator!",
)
MEM_USERNAME_REGEX = RegexValidator(
    regex=r"^member_[a-zA-Z0-9@#$%^&-+=()]{8}$",
    message='Invalid username for member!. It should begin with "member".',
)
PASSWORD_REGEX = RegexValidator(
    regex=r"^(?=.{8,20}$)(?!.*\s)(?=.*[a-zA-Z0-9])(?=.*\W).*$",
    message="Password must contains at least 8 and at most 20 characters, "
    "with at least one special characters and no white space characters.",
)


# Serializer for Login API
class CustomLoginSerializer(LoginSerializer):
    email = None


# Serializer for Moderator's Register API
class CustomModRegisterSerializer(RegisterSerializer):
    username = serializers.CharField(
        min_length=8,
        max_length=20,
        required=True,
        validators=[MOD_USERNAME_REGEX],
    )
    email = None
    password1 = serializers.CharField(
        style={"input_type": "password"}, write_only=True, validators=[PASSWORD_REGEX]
    )
    password2 = serializers.CharField(
        style={"input_type": "password"}, write_only=True, validators=[PASSWORD_REGEX]
    )

    def validate_email(self, email):
        pass


# Serializer for Member's Register API
class CustomMemRegisterSerializer(RegisterSerializer):
    username = email = password2 = None
    password1 = serializers.CharField(
        min_length=8,
        max_length=20,
        style={"input_type": "password"},
        write_only=True,
        validators=[PASSWORD_REGEX],
    )

    def validate_username(self, username):
        pass

    def validate_email(self, email):
        pass

    def validate_password1(self, password):
        session_queryset = ViViSession.objects.filter(is_opened=True)
        if session_queryset.count() > 1:
            raise serializers.ValidationError(_("Something is wrong with sessions! Please try again later!"))
        if session_queryset.count() < 1 or (session_queryset.count() == 1 and not session_queryset.first().is_opened):
            raise serializers.ValidationError(_("There are no session online yet! Please try again later!"))
        if session_queryset.first().is_opened and session_queryset.first().tan != password:
            raise serializers.ValidationError(_("TAN is not correct! Please try again!"))
        return password

    def validate(self, data):
        return data

    def get_cleaned_data(self):
        return {
            "username": f"member_{uuid.uuid4().hex[:8]}",
            "password1": self.validated_data.get("password1", ""),
        }


# Serializer for getting or updating user's details APIs
class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = get_user_model()
        fields = (
            "id",
            "username",
            "is_mod",
        )


# Serializer for changing password
class CustomUserChangePasswordSerializer(PasswordChangeSerializer):
    new_password1 = serializers.CharField(
        min_length=8,
        max_length=20,
        style={"input_type": "password"},
        write_only=True,
        validators=[PASSWORD_REGEX],
    )
    new_password2 = serializers.CharField(
        min_length=8,
        max_length=20,
        style={"input_type": "password"},
        write_only=True,
        validators=[PASSWORD_REGEX],
    )
