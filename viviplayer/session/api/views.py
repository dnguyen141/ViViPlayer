from rest_framework import generics, permissions
from session.models import ViViSession, Shot, UserStory, Sentence, MultipleChoiceQuestion
from session.api.serializers import SessionSerializer, ShotSerializer, CreateShotSerializer
from rest_framework.permissions import IsAuthenticated
from authentication.permissions import IsModerator
from rest_framework import viewsets, mixins
from authentication.permissions import IsModerator
from .serializers import SessionSerializer, UserStorySerializer, SentenceSerializer, QuestionSerializer
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework import status
from rest_framework.response import Response
from session.permissions import IsAuthorOrReadOnly


# Create your views here.
class SessionViewSet(viewsets.ModelViewSet):
    serializer_class = SessionSerializer
    queryset = ViViSession.objects.all()

    def get_permissions(self):
        if self.action == 'list' or self.action == 'retrieve':
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [IsModerator]
        return [permission() for permission in permission_classes]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user)

    def create(self, request, *args, **kwargs):
        if ViViSession.objects.count() > 0:
            error = {
                "errors": [
                    {
                        "message": "Another session has already been created!"
                    }
                ]
            }
            return Response(error, status=status.HTTP_403_FORBIDDEN, headers={})
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    # def update(self, request, *args, **kwargs):


class ListShots(generics.ListAPIView):
    serializer_class = ShotSerializer
    queryset = Shot.objects.all()
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        ses = self.kwargs['pk']
        return Shot.objects.filter(session_id=ses)


class CreateShot(generics.CreateAPIView):
    serializer_class = CreateShotSerializer
    queryset = Shot.objects.all()
    permission_classes = [IsModerator]

    def perform_create(self, serializer):
        ses = ViViSession.objects.get(id=self.kwargs['pk'])
        serializer.save(session=ses)


# Update and Destroy Shots
class ShotViewSet(viewsets.GenericViewSet, mixins.UpdateModelMixin, mixins.DestroyModelMixin):
    serializer_class = ShotSerializer
    queryset = Shot.objects.all()
    http_method_names = ['patch', 'delete']


class UserStoryViewSet(viewsets.ModelViewSet):
    serializer_class = UserStorySerializer
    queryset = UserStory.objects.all()
    permission_classes = [IsAuthorOrReadOnly]

    def get_permissions(self):
        if self.action == 'list' or self.action == 'retrieve':
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = []
        return [permission() for permission in permission_classes]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user, session=ViViSession.objects.first())


class SentenceViewSet(viewsets.ModelViewSet):
    serializer_class = SentenceSerializer
    queryset = Sentence.objects.all()
    permission_classes = [IsAuthorOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user, session=ViViSession.objects.first())


class QuestionViewSet(viewsets.ModelViewSet):
    serializer_class = QuestionSerializer
    queryset = MultipleChoiceQuestion.objects.all()
