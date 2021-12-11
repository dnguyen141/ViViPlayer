from django.urls import path
from session.api.views import ListSessions, ListShots

# URLs for all authentication views
urlpatterns = [
    path('sessions/', ListSessions.as_view(), name="rest_sessions"),
    path('shots/<pk>', ListShots.as_view(), name="rest_shots"),
]
