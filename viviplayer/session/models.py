from django.db import models
from django.db.models.signals import post_save
from django.dispatch import receiver
from django.utils.translation import gettext_lazy as _

from authentication.models import CustomUser
from session import autosegment, imageextractor


class ViViSessionManager(models.Manager):
    use_in_migrations = True


# Create your models here.
class ViViSession(models.Model):
    name = models.CharField(max_length=255, null=False, blank=False, unique=True)
    owner = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="sessions")
    tan = models.CharField(max_length=20, blank=False)
    video_path = models.FileField(max_length=200)
    is_opened = models.BooleanField(default=False)

    class Meta:
        verbose_name = _("ViViSession")
        verbose_name_plural = _("ViViSessions")
        ordering = ['id']


# Segment video and create Shots
@receiver(post_save, sender=ViViSession)
def segment_video(sender, instance, created, *args, **kwargs):
    if created:
        time_stamps = autosegment.find_scenes(instance.video_path.path, instance.name)
        for i, time in enumerate(time_stamps):
            shot = Shot(session=instance, title=f"Unbenannter Shot {i + 1}", time=time)
            shot.save()
        instance.segmented = True
        instance.save()


class Shot(models.Model):
    session = models.ForeignKey(ViViSession, on_delete=models.CASCADE, related_name="shots")
    time = models.FloatField()
    title = models.CharField(max_length=50, null=False, blank=False)
    image = models.URLField(max_length=200, null=True)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = _("Shot")
        verbose_name_plural = _("Shots")
        ordering = ['time']


# Create Screenshot when a Shot is created
@receiver(post_save, sender=Shot)
def get_screenshot(sender, instance, created, *args, **kwargs):
    if created:
        vid = ViViSession.objects.get(shots=instance)
        imageextractor.extract(vid.video_path.path, vid.id, [instance.time])
        instance.image = ("media/screenshots/" + str(vid.id) + "/" + str(instance.time) + ".jpg")
        instance.save()


class UserStory(models.Model):
    session = models.ForeignKey(ViViSession, on_delete=models.CASCADE, related_name="userstories")
    author = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="userstories")
    shot = models.ForeignKey(Shot, on_delete=models.CASCADE, related_name="userstories")
    damit = models.CharField(max_length=500, null=False, blank=False)
    moechteichals1 = models.CharField(max_length=500, null=False, blank=False)
    moechteichals2 = models.CharField(max_length=500, null=False, blank=False)

    class Meta:
        verbose_name = _("UserStory")
        verbose_name_plural = _("UserStories")
        ordering = ['id']


class Sentence(models.Model):
    session = models.ForeignKey(ViViSession, on_delete=models.CASCADE, related_name="sentences")
    author = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="sentences")
    shot = models.ForeignKey(Shot, on_delete=models.CASCADE, related_name="sentences")
    text = models.CharField(max_length=500, null=False, blank=False)

    class Meta:
        verbose_name = _("Sentence")
        verbose_name_plural = _("Sentences")
        ordering = ['id']


def _get_default_json_for_question():
    return []


class Question(models.Model):
    RENDER_TYPE = (
        ("checkbox", _("Checkbox")),
        ("radiogroup", _("Radiogroup"))
    )
    QUESTION_TYPE = (
        ("", _("")),
        ("question", _("Question")),
        ("survey", _("Survey")),
    )

    session = models.ForeignKey(ViViSession, on_delete=models.CASCADE, related_name="questions")
    shot = models.ForeignKey(Shot, on_delete=models.CASCADE, related_name="questions")
    author = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="questions")
    title = models.CharField(max_length=500, null=False, blank=False)
    typeOfQuestion = models.CharField(max_length=10, null=False, choices=QUESTION_TYPE, default="")
    typeToRender = models.CharField(max_length=10, null=False, choices=RENDER_TYPE)
    choices = models.JSONField(default=_get_default_json_for_question, encoder=None)
    answers = models.JSONField(default=_get_default_json_for_question, encoder=None)
    correct_answer = models.CharField(max_length=500, null=False, blank=True, default="")

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = _("Question")
        verbose_name_plural = _("Questions")
        ordering = ['id']
