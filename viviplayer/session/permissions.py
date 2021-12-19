from rest_framework.permissions import BasePermission
from rest_framework import permissions


class IsAuthorOrReadOnly(BasePermission):
    """
    Allows access only to users who are authors of the object.
    """
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return bool(request.user and request.user.is_authenticated and request.user == obj.author)
