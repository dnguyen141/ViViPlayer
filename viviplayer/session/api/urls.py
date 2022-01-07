from django.urls import path

from django.urls import path, include
from rest_framework import routers

from .views import UserStoryViewSet, SentenceViewSet, QuestionViewSet, ShotViewSet, SessionViewSet, ExportODT, ExportCSV

router = routers.DefaultRouter()
router.register(r'userstories', UserStoryViewSet, basename='rest_userstory')
router.register(r'sentences', SentenceViewSet, basename='rest_sentence')
router.register(r'questions', QuestionViewSet, basename='rest_question')
router.register(r'shots', ShotViewSet, basename='rest_shot')
router.register(r'', SessionViewSet, basename='rest_session')

# URLs for all authentication views
urlpatterns = [
    path('', include(router.urls)),
    path('export/odt', ExportODT.as_view(), name="rest_odt"),
    path('export/csv', ExportCSV.as_view(), name="rest_csv"),
]
