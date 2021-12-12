from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404

from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from authentication.permissions import IsModerator
from dj_rest_auth.registration.views import RegisterView
from dj_rest_auth.views import LoginView, PasswordChangeView, LogoutView

from authentication.models import CustomUser
from authentication.api.serializers import (
    CustomLoginSerializer,
    CustomUserSerializer,
    CustomModRegisterSerializer,
    CustomMemRegisterSerializer,
    CustomUserChangePasswordSerializer,
)


# This class comes direct from Django Rest Framework Documentation
# Apply this mixin to any view or viewset to get multiple field filtering
# based on a `lookup_fields` attribute, instead of the default single field filtering.
class MultipleFieldLookupMixin(object):
    def get_object(self):
        queryset = self.get_queryset()  # Get the base queryset
        queryset = self.filter_queryset(queryset)  # Apply any filter backends
        filter = {}
        for field in self.lookup_fields:
            try:  # Get the result with one or more fields.
                filter[field] = self.kwargs[field]
            except Exception:
                pass
        return get_object_or_404(queryset, **filter)  # Lookup the object


# Login API
# @route    GET api/auth/login/
# @desc     Authenticate user & get token
# @access   Public
class CustomLoginAPI(LoginView):
    serializer_class = CustomLoginSerializer


# Moderator's login API
# @route    POST api/auth/register/mod/
# @desc     Register user as moderator & get token
# @access   Public
class CustomModRegisterAPI(RegisterView):
    serializer_class = CustomModRegisterSerializer


# Member's login API
# @route    POST api/auth/register/mem/
# @desc     Register user as member & get token
# @access   Public
class CustomMemRegisterAPI(RegisterView):
    serializer_class = CustomMemRegisterSerializer


# Listing user's details for all users API
# @route    GET api/auth/users/
# @desc     Output a list of all users and their credentials in system
# @access   Only authenticated users
class CustomUserListAPI(generics.ListAPIView):
    permission_classes = (
        IsAuthenticated,
        IsModerator,
    )
    queryset = get_user_model().objects.filter(is_staff=False)
    serializer_class = CustomUserSerializer


# Listing user's details for all users API
# @route    GET api/auth/user/
# @desc     Output a list of current user and his credentials in system
# @access   Only authenticated users
class CustomUserAPI(generics.ListAPIView):
    permission_classes = (IsAuthenticated,)
    queryset = get_user_model().objects.filter(is_staff=False)
    serializer_class = CustomUserSerializer

    def get_queryset(self):
        return super().get_queryset().filter(id=getattr(self.request.user, "id", None))


# Listing and Updating user's details API
# @route    GET api/auth/users/<int:pk>
# @desc     Get user's credentials using pk
# @route    PUT api/auth/users/<int:pk>
# @desc     Update all user's credentials using pk
# @route    PATCH api/auth/users/<int:pk>
# @desc     Update user's credentials using pk
# @route    GET api/auth/users/<str:username>
# @desc     Get user's credentials using username
# @route    PUT api/auth/users/<str:username>
# @desc     Update all user's credentials using username
# @route    PATCH api/auth/users/<str:username>
# @desc     Update specific user's credential using username
# @access   Only authenticated users
class CustomUserRetrieveUpdateAPI(
    MultipleFieldLookupMixin, generics.RetrieveUpdateAPIView
):
    permission_classes = (
        IsAuthenticated,
        IsModerator,
    )
    queryset = get_user_model().objects.filter(is_staff=False)
    serializer_class = CustomUserSerializer
    lookup_fields = ("pk", "username")

    def get_queryset(self):
        return super().get_queryset().filter(id=getattr(self.request.user, "id", None))


# Change Password API
# @route    POST api/auth/change_password/
# @desc     Change password of current user
# @access   Only authenticated users
class CustomModChangePasswordAPI(PasswordChangeView):
    permission_classes = (
        IsAuthenticated,
        IsModerator,
    )
    serializer_class = CustomUserChangePasswordSerializer


# Logout API
# @route    POST api/auth/logout/
# @desc     Log out an user and delete account from db if it's from a member
# @access   Public
class CustomLogoutAPI(LogoutView):
    permission_classes = (IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        user = getattr(request, "user", None)
        if not getattr(user, "is_mod", True):
            get_user_model().objects.filter(id=getattr(user, "id", None)).delete()
        return self.logout(request)
