from django.db import models
from authentication.models import CustomUser


class ViViSessionManager(models.Manager):
    use_in_migrations = True


# Create your models here.
class ViViSession(models.Model):
    name = models.CharField(max_length=255, null=False, blank=False, unique=True)
    owner = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="owner_session")
    current_users = models.ManyToManyField(CustomUser, related_name="current_users", blank=True)
    tan = models.CharField(max_length=20, null=True, blank=False)
    video_path = models.URLField(max_length=200)
    is_opened = models.BooleanField(default=False)

    class Meta:
        verbose_name = "ViViPlayer Session"


class Shot(models.Model):
    session = models.ForeignKey(ViViSession, on_delete=models.CASCADE, related_name="session_shot")
    time = models.FloatField()
    title = models.CharField(max_length=15, null=False, blank=False)


class UserStory(models.Model):
    shot = models.ForeignKey(Shot, on_delete=models.CASCADE, related_name="shot_userstory")
    author = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="author_userstory")
    text = models.CharField(max_length=500, null=False, blank=False)


class Sentence(models.Model):
    shot = models.ForeignKey(Shot, on_delete=models.CASCADE, related_name="shot_sentence")
    author = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="author_sentence")
    text = models.CharField(max_length=500, null=False, blank=False)


class MultipleChoiceQuestion(models.Model):
    MCQ_TYPE = (
        ("question", "Question"),
        ("survey", "Survey"),
    )

    shot = models.ForeignKey(Shot, on_delete=models.CASCADE, related_name="shot_mcq")
    author = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="author_mcq")
    desc = models.CharField(max_length=500, null=False, blank=False)
    type = models.CharField(max_length=8, choices=MCQ_TYPE)


class Answer(models.Model):
    question = models.ForeignKey(MultipleChoiceQuestion, on_delete=models.CASCADE, related_name="mcq_answer")
    text = models.CharField(max_length=100)
    votes = models.IntegerField(max_length=2)

