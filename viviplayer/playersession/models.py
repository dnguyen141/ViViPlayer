from django.db import models

# Create your models here.

class UserStory(models.Model):
    desc = models.CharField(max_length=240)