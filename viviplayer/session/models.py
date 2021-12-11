from django.db import models
from authentication.models import CustomUser
from session import autosegment, imageextractor
from django.db.models.signals import post_save
from django.dispatch import receiver


class ViViSessionManager(models.Manager):
    use_in_migrations = True


# Create your models here.
class ViViSession(models.Model):
    name = models.CharField(max_length=255, null=False, blank=False, unique=True)
    owner = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="owner_session")
    current_users = models.ManyToManyField(CustomUser, related_name="current_users", blank=True)
    tan = models.CharField(max_length=20, blank=False)
    video_path = models.FileField(max_length=200)
    is_opened = models.BooleanField(default=False)

    class Meta:
        verbose_name = "ViViPlayer Session"


# Segment video and create Shots
@receiver(post_save, sender=ViViSession)
def segment_video(sender, instance, created, *args, **kwargs):
    if created:
        time_stamps = autosegment.find_scenes(instance.video_path.path, instance.name)
        for t in time_stamps:
            s = Shot(session=instance, title='No title', time=t)
            s.save()
        instance.segmented = True
        instance.save()


class Shot(models.Model):
    session = models.ForeignKey(ViViSession, on_delete=models.CASCADE, related_name="session_shot")
    time = models.FloatField()
    title = models.CharField(max_length=15, null=False, blank=False)
    image = models.URLField(max_length=200, null=True)


# Create Screenshot when a Shot is created
@receiver(post_save, sender=Shot)
def get_screenshot(sender, instance, created, *args, **kwargs):
    vid = ViViSession.objects.get(session_shot = instance)
    imageextractor.extract(vid.video_path.path, vid.id, [instance.time])
    instance.image = 'screenshots/' + str(instance.id) + str(instance.time)


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

