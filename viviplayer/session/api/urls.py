from django.urls import path
from session.api.views import ListSessions, ListShots, CreateSession, DetailSession, CreateShot

# URLs for all authentication views
urlpatterns = [
    path('sessions/', ListSessions.as_view(), name="rest_sessions"),
    path('shots/<pk>', ListShots.as_view(), name="rest_shots"),
    path('create', CreateSession.as_view(), name="rest_create_session"),
    path('view/<pk>', DetailSession.as_view(), name="rest_view_session"),
    path('create_shot/<pk>', CreateShot.as_view(), name="rest_create_shot"),
]
