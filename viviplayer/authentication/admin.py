from django.contrib import admin
from django.utils.translation import gettext_lazy as _
from django.contrib.auth.admin import UserAdmin
from django.contrib.sites.models import Site

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


# Register your models here.

# Custom User Model
admin.site.register(CustomUser, CustomUserAdmin)
admin.site.unregister(Site)
admin.site.unregister(SocialToken)
admin.site.unregister(SocialAccount)
admin.site.unregister(SocialApp)
admin.site.unregister(EmailAddress)