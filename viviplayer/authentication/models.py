from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.base_user import BaseUserManager


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
        return self._create_user(username, password, **extra_kwargs)

    def create_superuser(self, username, password, **extra_kwargs):
        extra_kwargs.setdefault("is_staff", True)
        extra_kwargs.setdefault("is_superuser", True)
        return self._create_user(username, password, **extra_kwargs)


class CustomUser(AbstractUser):
    first_name = last_name = email = None
    objects = CustomUserManager()

    EMAIL_FIELD = None
    REQUIRED_FIELDS = []

    def __str__(self):
        return self.username
