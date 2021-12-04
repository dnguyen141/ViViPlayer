from rest_framework import serializers, viewsets

from .models import UserStory


# Serializer for getting or updating user's details APIs
class CustomUserSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserStory
        fields = '__all__'


class UserStoryViewSet(viewsets.ModelViewSet):
    """
    A viewset for viewing and editing user instances.
    """
    serializer_class = CustomUserSerializer
    queryset = UserStory.objects.all()
