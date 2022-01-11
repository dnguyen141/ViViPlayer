from session.models import ViViSession, Shot, UserStory, Sentence, MultipleChoiceQuestion, Answer
from rest_framework.permissions import IsAuthenticated
from rest_framework import viewsets
from authentication.permissions import IsModerator
from .serializers import SessionSerializer, UserStorySerializer, SentenceSerializer, QuestionSerializer, ShotSerializer
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework import status
from rest_framework.response import Response
import random
import string
from odf.opendocument import OpenDocumentText
from odf.draw import Frame, Image
from odf.text import P
from odf.style import Style, ParagraphProperties, TextProperties
from django.http import HttpResponse
from rest_framework import generics
import os, io
import csv
import zipfile


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


# API View for download a session as a .odt file
class ExportODT(generics.ListAPIView):

    # Public for testing. Should only be accessed by a Moderator
    permission_classes = []

    # New odt document
    textdoc = OpenDocumentText()

    # ODF Styles
    withbreak = Style(name="WithBreak", parentstylename="Standard", family="paragraph")
    withbreak.addElement(ParagraphProperties(breakbefore="page"))
    textdoc.automaticstyles.addElement(withbreak)

    pstyle = Style(name="Paragraph 1", family="paragraph", defaultoutlinelevel="1")
    pstyle.addElement(TextProperties(attributes={'fontsize': "10pt", 'fontfamily': "Arial"}))
    textdoc.automaticstyles.addElement(pstyle)

    h1style = Style(name="Heading 1", family="paragraph", defaultoutlinelevel="1")
    h1style.addElement(TextProperties(attributes={'fontsize': "20pt", 'fontweight': "bold", 'fontfamily': "Arial"}))
    textdoc.automaticstyles.addElement(h1style)

    h2style = Style(name="Heading 2", family="paragraph", defaultoutlinelevel="1")
    h2style.addElement(TextProperties(attributes={'fontsize': "16pt", 'fontweight': "bold", 'fontfamily': "Arial"}))
    textdoc.automaticstyles.addElement(h2style)

    h3style = Style(name="Heading 3", family="paragraph", defaultoutlinelevel="1")
    h3style.addElement(TextProperties(attributes={'fontsize': "12pt", 'fontweight': "bold", 'fontfamily': "Arial"}))
    textdoc.automaticstyles.addElement(h3style)

    def get(self, request):

        # Get session and add to document
        ses = ViViSession.objects.get()
        p = P(text=ses.name, stylename=self.h1style)
        self.textdoc.text.addElement(p)
        self.textdoc.text.addElement(P())

        # Get Shots
        for (i, s) in enumerate(Shot.objects.all()):

            # Add Shot images to document
            p = P(text=s.title, stylename=self.h2style)
            self.textdoc.text.addElement(p)
            self.textdoc.text.addElement(P())
            href = self.textdoc.addPicture(s.image)
            photoframe = Frame(width="300pt", height="200pt", x="56pt", y="56pt", anchortype="paragraph")
            photoframe.addElement(Image(href=href))
            p.addElement(photoframe)

            # Add User Stories for Shot
            p = P(text="User Stories:", stylename=self.h3style)
            self.textdoc.text.addElement(p)
            self.textdoc.text.addElement(P())

            for (j, us) in enumerate(UserStory.objects.filter(shot=s)):
                p = P(text=us.desc, stylename=self.pstyle)
                self.textdoc.text.addElement(p)
                self.textdoc.text.addElement(P())

            # Add Sentences for Shot
            p = P(text="Sentences:", stylename=self.h3style)
            self.textdoc.text.addElement(p)
            self.textdoc.text.addElement(P())

            for (j, sent) in enumerate(Sentence.objects.filter(shot=s)):
                p = P(text=sent.text, stylename=self.pstyle)
                self.textdoc.text.addElement(p)
                self.textdoc.text.addElement(P())

            # Add Questions for Shot
            p = P(text="Questions:", stylename=self.h3style)
            self.textdoc.text.addElement(p)
            self.textdoc.text.addElement(P())

            for (j, q) in enumerate(MultipleChoiceQuestion.objects.filter(shot=s)):
                p = P(text=q.desc, stylename=self.pstyle)
                self.textdoc.text.addElement(p)

                # Add Answers for Question
                for (k, ans) in enumerate(Answer.objects.filter(question=q)):
                    p = P(text=ans.text + ': ' + str(ans.votes), stylename=self.pstyle)
                    self.textdoc.text.addElement(p)

            # Add page break
            p = P(stylename=self.withbreak)
            self.textdoc.text.addElement(p)

        # Save document to server
        self.textdoc.save('media/' + str(ses.id) + '.odt')

        # Return document
        data = open('media/' + str(ses.id) + '.odt', 'rb')
        response = HttpResponse(data, content_type='application/vnd.oasis.opendocument.text')
        response['Content-Disposition'] = 'attachment; filename="export.odt"'
        response['Content-Length'] = os.path.getsize('media/' + str(ses.id) + '.odt')
        return response


# API View for downloading User Stories as .csv
class ExportCSV(generics.ListAPIView):

    # Public for testing. Should only be accessed by a Moderator
    permission_classes = []

    def get(self, request, *args, **kwargs):

        # Get session
        ses = ViViSession.objects.get()

        # Add Screenshots to .zip
        buffer = io.BytesIO()
        response = zipfile.ZipFile(buffer, "w")
        for dirname, subdirs, files in os.walk('media/screenshots/'+str(ses.id)):
            for filename in files:
                response.write(os.path.join(dirname, filename), filename)

        # Add User Stories to .csv
        csvf = io.StringIO()
        writer = csv.writer(csvf)
        writer.writerow(["Title", "Description", "Image"])
        for (i, us) in enumerate(UserStory.objects.all()):

            row = ["User Story " + str(i+1), us.desc, str(us.shot.image).split("/")[-1]]
            writer.writerow(row)

        # Add .csv to .zip
        response.writestr('export.csv', csvf.getvalue())
        response.close()

        # Save .zip on server - If needed
        f = open("media/"+str(ses.id)+".zip", "wb")
        f.write(buffer.getvalue())
        f.close()

        # Return .zip in response
        response = HttpResponse(buffer.getvalue())
        response['Content-type'] = 'application/x-zip-compressed'
        response['Content-Disposition'] = 'attachment; filename="export.zip"'

        return response