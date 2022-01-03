from allauth.socialaccount.models import (
    SocialToken,
    SocialAccount,
    SocialApp,
    EmailAddress,
)
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from django.contrib.sites.models import Site
from django.utils.translation import gettext_lazy as _

from .forms import CustomUserCreationForm
from .models import CustomUser


# Custom Admin Model
class CustomUserAdmin(UserAdmin):
    list_display = ("username", "is_staff")
    fieldsets = (
        (None, {"fields": ("username", "password")}),
        (
            _("Permissions"),
            {
                "fields": (
                    "is_active",
                    "is_mod",
                    "is_staff",
                    "is_superuser",
                    "groups",
                    "user_permissions",
                ),
            },
        ),
        (_("Important dates"), {"fields": ("last_login", "date_joined")}),
    )
    list_filter = ("is_mod", "is_active", "groups")
    add_form = CustomUserCreationForm
    model = CustomUser


# Custom User Model
admin.site.register(CustomUser, CustomUserAdmin)
admin.site.unregister(Site)
admin.site.unregister(SocialToken)
admin.site.unregister(SocialAccount)
admin.site.unregister(SocialApp)
admin.site.unregister(EmailAddress)
