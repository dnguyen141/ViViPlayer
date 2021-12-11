from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.admin import UserAdmin
from django.contrib.sites.models import Site
from session.models import *

from allauth.socialaccount.models import SocialToken, SocialAccount, SocialApp, EmailAddress

from .forms import CustomUserCreationForm
from .models import CustomUser


# Custom Admin Model
class CustomUserAdmin(UserAdmin):
    list_display = ('username', 'is_staff')
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        (_('Permissions'), {
            'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions'),
        }),
        (_('Important dates'), {'fields': ('last_login', 'date_joined')}),
    )
    add_form = CustomUserCreationForm
    model = CustomUser


class ViViSessionAdmin(admin.ModelAdmin):
    model = ViViSession


class ShotAdmin(admin.ModelAdmin):
    model = Shot


class MultipleChoiceQuestionAdmin(admin.ModelAdmin):
    model = MultipleChoiceQuestion


class AnswerAdmin(admin.ModelAdmin):
    model = Answer


class SentenceAdmin(admin.ModelAdmin):
    model = Sentence


class UserStoryAdmin(admin.ModelAdmin):
    model = UserStory


# Register your models here.
admin.site.register(ViViSession, ViViSessionAdmin)
admin.site.register(Shot, ShotAdmin)
admin.site.register(MultipleChoiceQuestion, MultipleChoiceQuestionAdmin)
admin.site.register(Answer, AnswerAdmin)
admin.site.register(UserStory, UserStoryAdmin)
admin.site.register(Sentence, SentenceAdmin)

# Custom User Model
admin.site.register(CustomUser, CustomUserAdmin)
admin.site.unregister(Site)
admin.site.unregister(SocialToken)
admin.site.unregister(SocialAccount)
admin.site.unregister(SocialApp)
admin.site.unregister(EmailAddress)
