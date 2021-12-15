from rest_framework import generics, permissions
from session.models import ViViSession, Shot, UserStory, Sentence, MultipleChoiceQuestion
from session.api.serializers import SessionSerializer, ShotSerializer, CreateShotSerializer
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework import viewsets
from authentication.permissions import IsModerator
from .serializers import UserStorySerializer, SentenceSerializer, QuestionSerializer
from rest_framework.parsers import FormParser,MultiPartParser

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
    parser_classes = (MultiPartParser, FormParser)
    serializer_class = SessionSerializer
    queryset = ViViSession.objects.all()
    permission_classes = [IsModerator]


class ListShots(generics.ListAPIView):
    serializer_class = ShotSerializer
    queryset = Shot.objects.all()
    permission_classes = [IsAdminUser, IsAuthenticated]

    def get_queryset(self):
        ses = self.kwargs['pk']
        return Shot.objects.filter(session_id=ses)


class CreateShot(generics.CreateAPIView):
    serializer_class = CreateShotSerializer
    queryset = Shot.objects.all()
    permission_classes = [IsAdminUser]

    def perform_create(self, serializer):
        ses = ViViSession.objects.get(id=self.kwargs['pk'])
        serializer.save(session=ses)


class UserStoryViewSet(viewsets.ModelViewSet):
    serializer_class = UserStorySerializer
    queryset = UserStory.objects.all()


class SentenceViewSet(viewsets.ModelViewSet):
    serializer_class = SentenceSerializer
    queryset = Sentence.objects.all()


class QuestionViewSet(viewsets.ModelViewSet):
    serializer_class = QuestionSerializer
    queryset = MultipleChoiceQuestion.objects.all()
