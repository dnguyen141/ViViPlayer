import csv
import io
import os
import random
import string
import zipfile

from django.http import HttpResponse
from odf.draw import Frame, Image
from odf.opendocument import OpenDocumentText
from odf.style import Style, ParagraphProperties, TextProperties
from odf.text import P
from rest_framework import generics, status, viewsets
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from authentication.models import CustomUser
from authentication.permissions import IsModerator
from session.models import ViViSession, Shot, UserStory, Sentence, Question
from .serializers import (
    SessionSerializer,
    UserStorySerializer,
    SentenceSerializer,
    QuestionSerializer,
    ShotSerializer,
    AnswerSerializer,
)


def tan_generator():
    pwd_chars = [
        random.choice(string.ascii_lowercase + string.ascii_uppercase)
        for _ in range(random.randint(5, 6))
    ]
    pwd_digits = [random.choice(string.digits) for _ in range(random.randint(0, 2))]
    special_chars = ["!", "#", "$", "%", "&", "(", ")", "*", "+"]
    pwd_special_chars = [
        random.choice(special_chars) for _ in range(random.randint(1, 2))
    ]
    pwd_list = pwd_chars + pwd_digits + pwd_special_chars
    random.shuffle(pwd_list)
    return "".join(pwd_list)


def get_error_message(field_text, message_text):
    msg = {"errors": [{"field": field_text, "message": [message_text]}]}
    return msg


# Create your views here.
class SessionViewSet(viewsets.ModelViewSet):
    serializer_class = SessionSerializer
    queryset = ViViSession.objects.all()
    parser_classes = [FormParser, MultiPartParser]
    http_method_names = ["get", "post", "put", "delete"]

    def get_permissions(self):
        if self.action == "list" or self.action == "retrieve":
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [IsModerator]
        return [permission() for permission in permission_classes]

    def perform_create(self, serializer):
        serializer.save(owner=self.request.user, tan=tan_generator())

    def create(self, request, *args, **kwargs):
        if ViViSession.objects.count() > 0:
            error = get_error_message(
                "non_field_errors",
                "Es daft nur maximal ein Session gleichzeitig geben!",
            )
            return Response(data=error, status=status.HTTP_403_FORBIDDEN)
        return super().create(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        CustomUser.objects.filter(is_mod=False).delete()
        return super().destroy(request, *args, **kwargs)


class ShotViewSet(viewsets.ModelViewSet):
    serializer_class = ShotSerializer
    queryset = Shot.objects.all()
    http_method_names = ["get", "post", "put", "delete"]

    class Meta:
        model = Shot
        fields = "__all__"

    def get_permissions(self):
        if self.action == "list" or self.action == "retrieve":
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [IsModerator]
        return [permission() for permission in permission_classes]

    def perform_create(self, serializer):
        serializer.save(session=ViViSession.objects.first())

    def create(self, request, *args, **kwargs):
        for shot in Shot.objects.all():
            if shot.time == float(request.data["time"]):
                error = get_error_message(
                    "time", "Es gibt schon ein Shot mit dem gleichen Zeitstempel!"
                )
                return Response(
                    data=error, status=status.HTTP_403_FORBIDDEN, headers={}
                )
        return super().create(request, *args, **kwargs)


class UserStoryViewSet(viewsets.ModelViewSet):
    serializer_class = UserStorySerializer
    queryset = UserStory.objects.all()
    permission_classes = [IsAuthenticated]
    http_method_names = ["get", "post", "put", "delete"]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user, session=ViViSession.objects.first())


class SentenceViewSet(viewsets.ModelViewSet):
    serializer_class = SentenceSerializer
    queryset = Sentence.objects.all()
    permission_classes = [IsAuthenticated]
    http_method_names = ["get", "post", "put", "delete"]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user, session=ViViSession.objects.first())


class QuestionViewSet(viewsets.ModelViewSet):
    serializer_class = QuestionSerializer
    queryset = Question.objects.all()

    http_method_names = ["get", "post", "put", "delete"]

    def get_permissions(self):
        if self.action == "list" or self.action == "retrieve":
            permission_classes = [IsAuthenticated]
        else:
            permission_classes = [IsModerator]
        return [permission() for permission in permission_classes]

    def perform_create(self, serializer):
        serializer.save(
            author=self.request.user, session=ViViSession.objects.first(), answers=[]
        )


# API View for download a session as a .odt file
class ExportODT(APIView):
    # Public for testing. Should only be accessed by a Moderator
    permission_classes = [IsModerator]

    def get(self, request, format=None):

        # New odt document
        textdoc = OpenDocumentText()

        # ODF Styles
        withbreak = Style(name="WithBreak", parentstylename="Standard", family="paragraph")
        withbreak.addElement(ParagraphProperties(breakbefore="page"))
        textdoc.automaticstyles.addElement(withbreak)

        pstyle = Style(name="Paragraph 1", family="paragraph", defaultoutlinelevel="1")
        pstyle.addElement(
            TextProperties(attributes={"fontsize": "10pt", "fontfamily": "Arial"})
        )
        textdoc.automaticstyles.addElement(pstyle)

        h1style = Style(name="Heading 1", family="paragraph", defaultoutlinelevel="1")
        h1style.addElement(
            TextProperties(
                attributes={"fontsize": "20pt", "fontweight": "bold", "fontfamily": "Arial"}
            )
        )
        textdoc.automaticstyles.addElement(h1style)

        h2style = Style(name="Heading 2", family="paragraph", defaultoutlinelevel="1")
        h2style.addElement(
            TextProperties(
                attributes={"fontsize": "16pt", "fontweight": "bold", "fontfamily": "Arial"}
            )
        )
        textdoc.automaticstyles.addElement(h2style)

        h3style = Style(name="Heading 3", family="paragraph", defaultoutlinelevel="1")
        h3style.addElement(
            TextProperties(
                attributes={"fontsize": "12pt", "fontweight": "bold", "fontfamily": "Arial"}
            )
        )
        textdoc.automaticstyles.addElement(h3style)

        # Get session and add to document
        ses = ViViSession.objects.get()
        p = P(text=ses.name, stylename=h1style)
        textdoc.text.addElement(p)
        textdoc.text.addElement(P())

        # Get Shots
        for (i, s) in enumerate(Shot.objects.all()):

            # Add Shot images to document
            href = textdoc.addPicture(s.image)
            photoframe = Frame(
                width="300pt",
                height="200pt",
                x="56pt",
                y="56pt",
                anchortype="character",
            )
            photoframe.addElement(Image(href=href))
            p = P(stylename=h1style)
            p.addElement(photoframe)
            textdoc.text.addElement(p)

            # Add shot title
            p = P(text=s.title, stylename=h2style)
            textdoc.text.addElement(p)

            # Add linebreak
            textdoc.text.addElement(P())

            # Add User Stories for Shot
            p = P(text="User Stories:", stylename=h3style)
            textdoc.text.addElement(p)
            textdoc.text.addElement(P())

            for (j, us) in enumerate(UserStory.objects.filter(shot=s)):
                userstorytext = (
                    "Damit " + us.damit + " möchte ich als " + us.moechteichals1 + " " + us.moechteichals2
                )
                p = P(text=userstorytext, stylename=pstyle)
                textdoc.text.addElement(p)
                textdoc.text.addElement(P())

            # Add Sentences for Shot
            p = P(text="Sätze:", stylename=h3style)
            textdoc.text.addElement(p)
            textdoc.text.addElement(P())

            for (j, sent) in enumerate(Sentence.objects.filter(shot=s)):
                p = P(text=sent.text, stylename=pstyle)
                textdoc.text.addElement(p)
                textdoc.text.addElement(P())

            # Add Questions for Shot
            p = P(text="Fragen:", stylename=h3style)
            textdoc.text.addElement(p)
            textdoc.text.addElement(P())

            for (j, q) in enumerate(Question.objects.filter(shot=s)):
                textdoc.text.addElement(P(text=q.title, stylename=pstyle))

                # Add Answers for Question
                textdoc.text.addElement(
                    P(text=f'- Antwortmöglichkeiten: {", ".join(q.choices)}', stylename=pstyle)
                )
                if q.typeOfQuestion == "question":
                    p = P(text="- Richtige Antwort: " + str(q.correct_answer), stylename=pstyle)
                    textdoc.text.addElement(p)

                for choice in q.choices:
                    stat = "-- " + str(choice) + ": " + str(q.answers.count(choice)) + " Stimmen"
                    p = P(text=stat, stylename=pstyle)
                    textdoc.text.addElement(p)

                # Add blank line
                textdoc.text.addElement(P())

            # Add page break
            p = P(stylename=withbreak)
            textdoc.text.addElement(p)

        # save document to server
        textdoc.save("media/" + str(ses.id) + ".odt")

        # Return document
        data = open("media/" + str(ses.id) + ".odt", "rb")
        response = HttpResponse(
            data, content_type="application/vnd.oasis.opendocument.text"
        )
        response["Content-Disposition"] = 'attachment; filename="export.odt"'
        response["Content-Length"] = os.path.getsize("media/" + str(ses.id) + ".odt")
        return response


# API View for downloading User Stories as .csv
class ExportCSV(APIView):
    # Public for testing. Should only be accessed by a Moderator
    permission_classes = [IsModerator]

    def get(self, request, format=None):

        # Get session
        ses = ViViSession.objects.get()

        # Add Screenshots to .zip
        buffer = io.BytesIO()
        response = zipfile.ZipFile(buffer, "w")
        for dirname, subdirs, files in os.walk("media/screenshots/" + str(ses.id)):
            for filename in files:
                response.write(os.path.join(dirname, filename), filename)

        # Add User Stories to .csv
        csvf = io.StringIO()
        writer = csv.writer(csvf)
        writer.writerow(["Titel", "Beschreibung", "Bild"])
        for (i, us) in enumerate(UserStory.objects.all()):
            row = [
                f"User Story {i + 1}",
                f"{us.damit} {us.moechteichals1} {us.moechteichals2}",
                str(us.shot.image).split("/")[-1],
            ]
            writer.writerow(row)

        # Add .csv to .zip
        response.writestr("export.csv", csvf.getvalue())
        response.close()

        # Save .zip on server - If needed
        f = open("media/" + str(ses.id) + ".zip", "wb")
        f.write(buffer.getvalue())
        f.close()

        # Return .zip in response
        response = HttpResponse(buffer.getvalue())
        response["Content-type"] = "application/x-zip-compressed"
        response["Content-Disposition"] = 'attachment; filename="export.zip"'

        return response


# API for member to send their answer for question to server
class PostAnswerAPIView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = AnswerSerializer

    def post(self, request, *args, **kwargs):
        serializer = AnswerSerializer(data=request.data)
        serializer.is_valid()
        question_id = serializer.data["question_id"]
        answer = serializer.data["answer"]

        if Question.objects.filter(id=question_id).count() == 0:
            msg = get_error_message(
                "question_id", "Frage/Umfrage kann nicht gefunden werden!"
            )
            return Response(data=msg, status=status.HTTP_404_NOT_FOUND)

        if len(answer) == 0:
            msg = get_error_message("answer", "Antwort darf nicht leer sein!")
            return Response(data=msg, status=status.HTTP_404_NOT_FOUND)

        question = Question.objects.get(id=question_id)
        for choice in answer:
            if choice not in question.choices:
                msg = get_error_message(
                    "answer", f"Ungültige Antwort für die eingegebene Frage/Umfrage"
                )
                return Response(data=msg, status=status.HTTP_400_BAD_REQUEST)

        question.answers += answer
        question.save()
        data = {"success": {"message": ["Successfully sent the answer!"]}}
        return Response(data=data, status=status.HTTP_200_OK)


# API for moderator to get statistics data
class GetStatisticsAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        if "question_id" not in self.kwargs:
            msg = get_error_message("question_id", "question_id ist nötig!")
            return Response(data=msg, status=status.HTTP_400_BAD_REQUEST)

        question_id = self.kwargs.get("question_id")

        if Question.objects.filter(id=question_id).count() == 0:
            msg = get_error_message(
                "question_id", "Frage/Umfrage kann nicht gefunden werden!"
            )
            return Response(data=msg, status=status.HTTP_404_NOT_FOUND)

        statistics = []
        question = Question.objects.get(id=question_id)
        for choice in question.choices:
            stat = dict()
            stat["choice"] = choice
            stat["quantity"] = question.answers.count(choice)
            statistics.append(stat)
        data = {
            "question_id": question_id,
            "question_title": question.title,
            "data": statistics,
        }
        return Response(data=data, status=status.HTTP_200_OK)
