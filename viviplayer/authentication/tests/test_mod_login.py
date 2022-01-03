from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.test import APITestCase

from authentication.models import CustomUser


class ModLoginTestCase(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.existed_mod_user = CustomUser.objects.create_user(
            username="max.mustermann",
            password="qwertz$123",
            is_mod=True
        )

    def test_login_success(self):
        login_data = {
            "username": "max.mustermann",
            "password": "qwertz$123",
        }
        response = self.client.post("/api/auth/login/", login_data)
        expected_response_data = {
            "key": Token.objects.get(user=self.existed_mod_user).key,
        }
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["key"], Token.objects.get(user=self.existed_mod_user).key)
        self.assertEqual(response.data, expected_response_data)

    def test_login_nonexistent_username(self):
        login_data = {
            "username": "max.musterman",
            "password": "qwertz$123",
        }
        response = self.client.post("/api/auth/login/", login_data)
        expected_response_data = {
            "errors": [
                {
                    "field": "non_field_errors",
                    "message": [
                        "Unable to log in with provided credentials."
                    ]
                }
            ]
        }
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, expected_response_data)
        self.assertEqual(Token.objects.count(), 0)

    def test_login_wrong_password(self):
        login_data = {
            "username": "max.mustermann",
            "password": "qwertz$1234",
        }
        response = self.client.post("/api/auth/login/", login_data)
        expected_response_data = {
            "errors": [
                {
                    "field": "non_field_errors",
                    "message": [
                        "Unable to log in with provided credentials."
                    ]
                }
            ]
        }
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, expected_response_data)
        self.assertEqual(Token.objects.count(), 0)
