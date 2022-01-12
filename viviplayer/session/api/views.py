import random
import string

from rest_framework import status
from rest_framework import viewsets
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from authentication.permissions import IsModerator
from session.models import ViViSession, Shot, UserStory, Sentence, MultipleChoiceQuestion
from .serializers import SessionSerializer, UserStorySerializer, SentenceSerializer, QuestionSerializer, ShotSerializer


def tan_generator():
    pwd_chars = [random.choice(string.ascii_lowercase + string.ascii_uppercase) for _ in range(random.randint(5, 6))]
    pwd_digits = [random.choice(string.digits) for _ in range(random.randint(0, 2))]
    special_chars = ['!', '#', '$', '%', '&', '(', ')', '*', '+']
    pwd_special_chars = [random.choice(special_chars) for _ in range(random.randint(1, 2))]
    pwd_list = pwd_chars + pwd_digits + pwd_special_chars
    random.shuffle(pwd_list)
    return "".join(pwd_list)


# Create your views here.
class SessionViewSet(viewsets.ModelViewSet):
    serializer_class = SessionSerializer
    queryset = ViViSession.objects.all()
    parser_classes = [FormParser, MultiPartParser]

    def get_permissions(self):
        if self.action == 'list' or self.action == 'retrieve':
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [IsModerator]
        return [permission() for permission in permission_classes]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user, tan=tan_generator())

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
        return super().create(request, *args, **kwargs)


class ShotViewSet(viewsets.ModelViewSet):
    serializer_class = ShotSerializer
    queryset = Shot.objects.all()

    class Meta:
        model = Shot
        fields = '__all__'

    def get_permissions(self):
        if self.action == 'list' or self.action == 'retrieve':
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [IsModerator]
        return [permission() for permission in permission_classes]

    def perform_create(self, serializer):
        serializer.save(session=ViViSession.objects.first())


class UserStoryViewSet(viewsets.ModelViewSet):
    serializer_class = UserStorySerializer
    queryset = UserStory.objects.all()
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user, session=ViViSession.objects.first())


class SentenceViewSet(viewsets.ModelViewSet):
    serializer_class = SentenceSerializer
    queryset = Sentence.objects.all()
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user, session=ViViSession.objects.first())


class QuestionViewSet(viewsets.ModelViewSet):
    serializer_class = QuestionSerializer
    queryset = MultipleChoiceQuestion.objects.all()

