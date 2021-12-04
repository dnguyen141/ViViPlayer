from django.urls import path, include
from rest_framework import routers

from .views import UserStoryViewSet

router = routers.DefaultRouter()
router.register(r'userstory', UserStoryViewSet, basename='rest_userstory')

urlpatterns = [
    path('', include(router.urls)),
]