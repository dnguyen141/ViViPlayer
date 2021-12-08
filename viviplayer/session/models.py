from django.db import models
from authentication.models import CustomUser


class ViViSessionManager(models.Manager):
    use_in_migrations = True


# Create your models here.
class ViViSession(models.Model):
    name = models.CharField(max_length=255, null=False, blank=False, unique=True)
    owner = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="owner_ref")
    current_users = models.ManyToManyField(CustomUser, related_name="current_users", blank=True)
    tan = models.CharField(min_length=8, max_length=20, null=True, blank=False)
    video_path = models.URLField(max_length=200)
    is_opened = models.BooleanField(default=False)


class Shot(models.Model):
    session = models.ForeignKey(ViViSession, on_delete=models.CASCADE, related_name="session_ref")
    time = models.FloatField()
    title = models.CharField(max_length=15, null=False, blank=False)


class UserStory(models.Model):
    session = models.ForeignKey(ViViSession, on_delete=models.CASCADE, related_name="session_ref")
    author = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="author_ref")
    shot = models.ForeignKey(Shot, on_delete=models.CASCADE, related_name="shot_ref")
    desc = models.CharField(max_length=500, null=False, blank=False)


class Sentence(models.Model):
    session = models.ForeignKey(ViViSession, on_delete=models.CASCADE, related_name="session_ref")
    author = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="author_ref")
    text = models.CharField(max_length=500, null=False, blank=False)


class MultipleChoiceQuestion(models.Model):
    MCQ_TYPE = (
        ("question", "Question"),
        ("survey", "Survey"),
    )

    session = models.ForeignKey(ViViSession, on_delete=models.CASCADE, related_name="session_ref")
    author = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="author_ref")
    desc = models.CharField(max_length=500, null=False, blank=False)
    type = models.CharField(max_length=8, choices=MCQ_TYPE)


class Answer(models.Model):
    question = models.ForeignKey(MultipleChoiceQuestion, on_delete=models.CASCADE, related_name="mcq_ref")
    text = models.CharField(max_length=100)
    votes = models.IntegerField(max_length=2)

