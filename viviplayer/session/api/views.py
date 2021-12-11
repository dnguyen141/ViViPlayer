
from rest_framework import generics, permissions
from session.models import ViViSession, Shot
from django.http import Http404
from rest_framework.response import Response
from session.api.serializers import SessionSerializer, ShotSerializer
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework import status


# Create your views here.
class ListSessions(generics.ListAPIView):
    serializer_class = SessionSerializer
    queryset = ViViSession.objects.all()
    permission_classes = [IsAdminUser, IsAuthenticated]


class ListShots(generics.ListAPIView):
    serializer_class = ShotSerializer
    queryset = Shot.objects.all()
    permission_classes = [IsAdminUser, IsAuthenticated]
