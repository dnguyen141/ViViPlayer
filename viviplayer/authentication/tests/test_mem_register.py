from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.test import APITestCase

from authentication.models import CustomUser
from session.models import ViViSession


class MemRegistrationWithNoSessionTestCase(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.mod_user = CustomUser.objects.create_user(
            username="mod.mustermann",
            password="qwertz$123",
            is_mod=True
        )
        cls.mod_token = Token.objects.create(user=cls.mod_user)

    def test_mem_register_no_session(self):
        mem_data = {
            "password1": "qwertz$123",
        }
        response = self.client.post("/api/auth/register/mem/", data=mem_data)
        expected_response_data = {
            "errors": [
                {
                    "field": "password1",
                    "message": [
                        "There are no session online yet! Please try again later!"
                    ]
                }
            ]
        }
        self.assertEqual(CustomUser.objects.count(), 1)
        self.assertEqual(Token.objects.count(), 1)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, expected_response_data)


class MemRegistrationWithOneSessionTestCase(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.mod_user = CustomUser.objects.create_user(
            username="mod.mustermann",
            password="qwertz$123",
            is_mod=True
        )
        cls.mod_token = Token.objects.create(user=cls.mod_user)
        cls.session = ViViSession.objects.create(
            name="Test Session",
            owner=cls.mod_user,
            tan="y6X2$R#N",
            video_path="../media/test_video.mp4",
            is_opened=False
        )

    def test_mem_register_closed_session(self):
        mem_data = {
            "password1": "y6X2$R#N",
        }
        response = self.client.post("/api/auth/register/mem/", data=mem_data)
        new_mem = CustomUser.objects.all()[CustomUser.objects.count() - 1]
        expected_response_data = {
            "errors": [
                {
                    "field": "password1",
                    "message": [
                        "There are no session online yet! Please try again later!"
                    ]
                }
            ]
        }
        self.assertEqual(CustomUser.objects.count(), 1)
        self.assertEqual(Token.objects.count(), 1)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, expected_response_data)

    def test_mem_register_opened_session(self):
        self.session.is_opened = True
        self.session.save()
        mem_data = {
            "password1": "y6X2$R#N",
        }
        response = self.client.post("/api/auth/register/mem/", data=mem_data)
        new_mem = CustomUser.objects.all()[CustomUser.objects.count() - 1]
        expected_response_data = {
            "key": Token.objects.get(user=new_mem).key,
        }
        self.assertEqual(CustomUser.objects.count(), 2)
        self.assertEqual(Token.objects.count(), 2)
        self.assertEqual(Token.objects.get(user=new_mem).key, response.data["key"])
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data, expected_response_data)

    def test_mem_register_opened_session_wrong_password(self):
        self.session.is_opened = True
        self.session.save()
        mem_data = {
            "password1": "asdfgh$456",
        }
        response = self.client.post("/api/auth/register/mem/", data=mem_data)
        expected_response_data = {
            "errors": [
                {
                    "field": "password1",
                    "message": [
                        "TAN is not correct! Please try again!"
                    ]
                }
            ]
        }
        self.assertEqual(CustomUser.objects.count(), 1)
        self.assertEqual(Token.objects.count(), 1)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, expected_response_data)

    def test_mem_register_opened_session_short_password(self):
        mem_data = {
            "password1": "as$12",
        }
        response = self.client.post("/api/auth/register/mem/", data=mem_data)
        expected_response_data = {
            "errors": [
                {
                    "field": "password1",
                    "message": [
                        "TAN is not correct! Please try again!"
                    ]
                }
            ]
        }
        self.assertEqual(CustomUser.objects.count(), 1)
        self.assertEqual(Token.objects.count(), 1)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, expected_response_data)
