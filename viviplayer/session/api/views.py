
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


class DetailSession(generics.RetrieveAPIView):
    serializer_class = SessionSerializer
    queryset = ViViSession.objects.all()
    permission_classes = [IsAdminUser, IsAuthenticated]

    def get_queryset(self):
        ses = self.kwargs['pk']
        return ViViSession.objects.filter(id=ses)


class CreateSession(generics.CreateAPIView):
    serializer_class = SessionSerializer
    queryset = ViViSession.objects.all()
    permission_classes = [IsAdminUser]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)


class ListShots(generics.ListAPIView):
    serializer_class = ShotSerializer
    queryset = Shot.objects.all()
    permission_classes = [IsAdminUser, IsAuthenticated]

    def get_queryset(self):
        ses = self.kwargs['pk']
        return Shot.objects.filter(session_id=ses)
