from django.urls import path
from session.api.views import ListSessions, ListShots, CreateSession, DetailSession, CreateShot

from django.urls import path, include
from rest_framework import routers

from .views import UserStoryViewSet, SentenceViewSet, QuestionViewSet, ShotViewSet

router = routers.DefaultRouter()
router.register(r'userstory', UserStoryViewSet, basename='rest_userstory')
router.register(r'sentence', SentenceViewSet, basename='rest_sentence')
router.register(r'question', SentenceViewSet, basename='rest_question')
router.register(r'shot', ShotViewSet, basename='rest_shot')

# URLs for all authentication views
urlpatterns = [
    path('', include(router.urls)),
    path('sessions/', ListSessions.as_view(), name="rest_sessions"),
    path('shots/<pk>', ListShots.as_view(), name="rest_shots"),
    path('create', CreateSession.as_view(), name="rest_create_session"),
    path('view/<pk>', DetailSession.as_view(), name="rest_view_session"),
    path('create_shot/<pk>', CreateShot.as_view(), name="rest_create_shot"),
]
