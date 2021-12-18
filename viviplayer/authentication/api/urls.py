from django.urls import path, re_path
from authentication.api.views import (
    CustomUserListAPI,
    CustomUserRetrieveUpdateAPI,
    CustomModRegisterAPI,
    CustomMemRegisterAPI,
    CustomLoginAPI,
    CustomModChangePasswordAPI,
    CustomLogoutAPI,
    CustomUserAPI,
)

# URLs for all authentication views
urlpatterns = [
    path("login/", CustomLoginAPI.as_view(), name="rest_login"),
    path("register/mod/", CustomModRegisterAPI.as_view(), name="rest_signup_mod"),
    path("register/mem/", CustomMemRegisterAPI.as_view(), name="rest_signup_mem"),
    path("users/", CustomUserListAPI.as_view(), name="rest_get_user_list"),
    path("user/", CustomUserAPI.as_view(), name="rest_get_user"),
    re_path(
        "users/(?P<pk>[0-9]+)/",
        CustomUserRetrieveUpdateAPI.as_view(),
        name="rest_user_details_id",
    ),
    re_path(
        "users/(?P<username>[0-9A-Za-z_\\-]+)/",
        CustomUserRetrieveUpdateAPI.as_view(),
        name="rest_user_details_username",
    ),
    path(
        "change_password/", CustomModChangePasswordAPI.as_view(), name="rest_change_pwd"
    ),
    path("logout/", CustomLogoutAPI.as_view(), name="rest_logout"),
]
