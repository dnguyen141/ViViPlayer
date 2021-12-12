from django.db import models

# Create your models here.
from session.models import ViViSession


class UserStory(models.Model):
    desc = models.CharField(max_length=240)
    session = models.ForeignKey(ViViSession, default=1, verbose_name="Session", on_delete=models.SET_DEFAULT, related_name="userstory")