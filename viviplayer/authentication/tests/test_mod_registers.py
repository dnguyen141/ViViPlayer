from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.test import APITestCase

from authentication.models import CustomUser


class ModRegisterTestCase(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.existed_mod_user = CustomUser.objects.create_user(
            username="max.mustermann",
            password="qwertz$123",
            is_mod=True
        )

    def test_mod_register_success(self):
        mod_data = {
            "username": "jianwei.shi",
            "password1": "Xo73#&CP",
            "password2": "Xo73#&CP",
        }
        response = self.client.post("/api/auth/register/mod/", data=mod_data)
        new_user = CustomUser.objects.get(username="jianwei.shi")
        expected_response_data = {
            "key": Token.objects.get(user=new_user).key,
        }
        self.assertEqual(new_user.is_mod, False)
        self.assertEqual(Token.objects.get(user=new_user).key, response.data["key"])
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data, expected_response_data)

    def test_mod_register_username_exists(self):
        mod_data = {
            "username": "max.mustermann",
            "password1": "Xo73#&CP",
            "password2": "Xo73#&CP",
        }
        response = self.client.post("/api/auth/register/mod/", data=mod_data)
        expected_response_data = {
            "errors": [
                {
                    "field": "username",
                    "message": [
                        "A user with that username already exists."
                    ]
                }
            ]
        }
        self.assertEqual(Token.objects.count(), 0)
        self.assertEqual(CustomUser.objects.count(), 1)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, expected_response_data)

    def test_mod_register_passwords_doesnt_match(self):
        mod_data = {
            "username": "jianwei.shi",
            "password1": "Xo73#&CP",
            "password2": "Xo73&#CP",
        }
        response = self.client.post("/api/auth/register/mod/", data=mod_data)
        expected_response_data = {
            "errors": [
                {
                    "field": "non_field_errors",
                    "message": [
                        "The two password fields didn't match."
                    ]
                }
            ]
        }
        self.assertEqual(Token.objects.count(), 0)
        self.assertEqual(CustomUser.objects.count(), 1)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, expected_response_data)

    def test_mod_register_passwords_not_secured(self):
        mod_data = {
            "username": "jianwei.shi",
            "password1": "12345678",
            "password2": "12345678",
        }
        response = self.client.post("/api/auth/register/mod/", data=mod_data)
        expected_response_data = {
            "errors": [
                {
                    "field": "password1",
                    "message": [
                        "Password must contains at least 8 and at most 20 characters, with at least one special "
                        "characters and no white space characters."
                    ]
                },
                {
                    "field": "password2",
                    "message": [
                        "Password must contains at least 8 and at most 20 characters, with at least one special "
                        "characters and no white space characters."
                    ]
                }
            ]
        }
        self.assertEqual(Token.objects.count(), 0)
        self.assertEqual(CustomUser.objects.count(), 1)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, expected_response_data)

    def test_mod_register_passwords_too_short(self):
        mod_data = {
            "username": "jianwei.shi",
            "password1": "qwe$123",
            "password2": "qwe$123",
        }
        response = self.client.post("/api/auth/register/mod/", data=mod_data)
        expected_response_data = {
            "errors": [
                {
                    "field": "password1",
                    "message": [
                        "Password must contains at least 8 and at most 20 characters, with at least one special "
                        "characters and no white space characters."
                    ]
                },
                {
                    "field": "password2",
                    "message": [
                        "Password must contains at least 8 and at most 20 characters, with at least one special "
                        "characters and no white space characters."
                    ]
                }
            ]
        }
        self.assertEqual(Token.objects.count(), 0)
        self.assertEqual(CustomUser.objects.count(), 1)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, expected_response_data)

    def test_mod_register_passwords_contain_white_space(self):
        mod_data = {
            "username": "jianwei.shi",
            "password1": "qwer$ 678",
            "password2": "qwer$ 678",
        }
        response = self.client.post("/api/auth/register/mod/", data=mod_data)
        expected_response_data = {
            "errors": [
                {
                    "field": "password1",
                    "message": [
                        "Password must contains at least 8 and at most 20 characters, with at least one special "
                        "characters and no white space characters."
                    ]
                },
                {
                    "field": "password2",
                    "message": [
                        "Password must contains at least 8 and at most 20 characters, with at least one special "
                        "characters and no white space characters."
                    ]
                }
            ]
        }
        self.assertEqual(Token.objects.count(), 0)
        self.assertEqual(CustomUser.objects.count(), 1)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, expected_response_data)
