from django.contrib import admin

from session.models import *


# Admin for all session's models
class ViViSessionAdmin(admin.ModelAdmin):
    model = ViViSession


class ShotAdmin(admin.ModelAdmin):
    model = Shot


class QuestionAdmin(admin.ModelAdmin):
    model = Question


class SentenceAdmin(admin.ModelAdmin):
    model = Sentence


class UserStoryAdmin(admin.ModelAdmin):
    model = UserStory


# Register your models here.
admin.site.register(ViViSession, ViViSessionAdmin)
admin.site.register(Shot, ShotAdmin)
admin.site.register(Question, QuestionAdmin)
admin.site.register(UserStory, UserStoryAdmin)
admin.site.register(Sentence, SentenceAdmin)
