from django.urls import path
from session.api.views import ListShots, CreateShot

from django.urls import path, include
from rest_framework import routers

from .views import UserStoryViewSet, SentenceViewSet, QuestionViewSet, ShotViewSet, SessionViewSet

router = routers.SimpleRouter()
router.register(r'', SessionViewSet, basename='rest_session')
router.register(r'userstory', UserStoryViewSet, basename='rest_userstory')
router.register(r'sentence', SentenceViewSet, basename='rest_sentence')
router.register(r'question', QuestionViewSet, basename='rest_question')
router.register(r'shot', ShotViewSet, basename='rest_shot')

# URLs for all authentication views
urlpatterns = [
    path('', include(router.urls)),
    path('shots/<pk>', ListShots.as_view(), name="rest_shots"),
    path('create_shot/<pk>', CreateShot.as_view(), name="rest_create_shot"),
]
