from rest_framework.permissions import BasePermission


class IsModerator(BasePermission):
    """
    Allows access only to users with moderator roles.
    """

    def has_permission(self, request, view):
        return bool(request.user and request.user.is_mod)
