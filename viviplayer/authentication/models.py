from django.db import models
from django.contrib.auth.models import AbstractUser, AnonymousUser
from django.contrib.auth.base_user import BaseUserManager
from django.utils.translation import gettext_lazy as _


# Create your models here.
class CustomUserManager(BaseUserManager):
    use_in_migrations = True

    def _create_user(self, username, password, **extra_kwargs):
        if not username:
            raise ValueError("Username required!")
        if not password:
            raise ValueError("Password required!")

        new_user = self.model(username=username, **extra_kwargs)
        new_user.set_password(password)
        new_user.save(using=self._db)
        return new_user

    def create_user(self, username, password, **extra_kwargs):
        extra_kwargs.setdefault("is_staff", False)
        extra_kwargs.setdefault("is_superuser", False)
        extra_kwargs.setdefault("is_mod", False)
        return self._create_user(username, password, **extra_kwargs)

    def create_superuser(self, username, password, **extra_kwargs):
        extra_kwargs.setdefault("is_staff", True)
        extra_kwargs.setdefault("is_superuser", True)
        extra_kwargs.setdefault("is_mod", True)
        return self._create_user(username, password, **extra_kwargs)


class CustomUser(AbstractUser):
    first_name = last_name = email = None
    is_mod = models.BooleanField(
        _("moderator status"),
        default=False,
        help_text=_("Designates whether this user can create a ViViPlayer's session."),
    )
    objects = CustomUserManager()

    EMAIL_FIELD = None
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.username


class CustomAnonymousUser(AnonymousUser):
    is_mod = False
