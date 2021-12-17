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
    owner = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="sessions")
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
    session = models.ForeignKey(ViViSession, on_delete=models.CASCADE, related_name="shots")
    time = models.FloatField()
    title = models.CharField(max_length=15, null=False, blank=False)
    image = models.URLField(max_length=200, null=True)


# Create Screenshot when a Shot is created
@receiver(post_save, sender=Shot)
def get_screenshot(sender, instance, created, *args, **kwargs):
    if created:
        vid = ViViSession.objects.get(shots=instance)
        imageextractor.extract(vid.video_path.path, vid.id, [instance.time])
        instance.image = 'screenshots/' + str(instance.id) + str(instance.time) + '.jpg'
        instance.save()


class UserStory(models.Model):
    session = models.ForeignKey(ViViSession, on_delete=models.CASCADE, related_name="userstories")
    author = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="userstories")
    shot = models.ForeignKey(Shot, on_delete=models.CASCADE, related_name="userstories")
    desc = models.CharField(max_length=500, null=False, blank=False)


class Sentence(models.Model):
    session = models.ForeignKey(ViViSession, on_delete=models.CASCADE, related_name="sentence")
    shot = models.ForeignKey(Shot, on_delete=models.CASCADE, related_name="sentence")
    author = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="sentence")
    text = models.CharField(max_length=500, null=False, blank=False)


class MultipleChoiceQuestion(models.Model):
    MCQ_TYPE = (
        ("question", "Question"),
        ("survey", "Survey"),
    )

    session = models.ForeignKey(ViViSession, on_delete=models.CASCADE, related_name="questions")
    shot = models.ForeignKey(Shot, on_delete=models.CASCADE, related_name="questions")
    author = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="questions")
    desc = models.CharField(max_length=500, null=False, blank=False)
    type = models.CharField(max_length=8, choices=MCQ_TYPE)


class Answer(models.Model):
    question = models.ForeignKey(MultipleChoiceQuestion, on_delete=models.CASCADE, related_name="answers")
    text = models.CharField(max_length=100)
    votes = models.IntegerField()
