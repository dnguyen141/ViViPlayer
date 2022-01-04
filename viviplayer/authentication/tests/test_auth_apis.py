from rest_framework.authtoken.models import Token
from rest_framework.test import APITestCase

from authentication.models import CustomUser


class ModAuthAPITestCase(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.mod_user = CustomUser.objects.create_user(
            username="mod.mustermann",
            password="qwertz$123",
            is_mod=True,
            is_active=True
        )
        cls.mod_token = Token.objects.create(user=cls.mod_user)
        cls.temp_mod_user = CustomUser.objects.create_user(
            username="jianwei.shi",
            password="Xo73#&CP"
        )
        cls.mem_user = CustomUser.objects.create_user(
            username="member_q1w2e3r4",
            password="asdfgh%456",
            is_active=True
        )

    def test_mod_get_user_lists(self):
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {self.mod_token.key}")
        response = self.client.get("/api/auth/users/")
        expected_response_data = [
            {
                "id": 1,
                "username": "mod.mustermann",
                "is_mod": True
            },
            {
                "id": 2,
                "username": "jianwei.shi",
                "is_mod": False
            },
            {
                "id": 3,
                "username": "member_q1w2e3r4",
                "is_mod": False
            }
        ]
        self.assertEqual(CustomUser.objects.count(), 3)
        self.assertEqual(Token.objects.count(), 1)
        self.assertEqual(response.data, expected_response_data)

    def test_mod_get_user_details(self):
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {self.mod_token.key}")
        response = self.client.get("/api/auth/users/2/")
        expected_response_data = {
            "id": 2,
            "username": "jianwei.shi",
            "is_mod": False
        }
        self.assertEqual(CustomUser.objects.count(), 3)
        self.assertEqual(Token.objects.count(), 1)
        self.assertEqual(response.data, expected_response_data)

    def test_mod_change_user_right(self):
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {self.mod_token.key}")
        data = {
            "is_mod": True
        }
        response = self.client.patch("/api/auth/users/2/", data=data)
        expected_response_data = {
            "id": 2,
            "username": "jianwei.shi",
            "is_mod": True
        }
        self.assertEqual(CustomUser.objects.count(), 3)
        self.assertEqual(Token.objects.count(), 1)
        self.assertEqual(response.data, expected_response_data)

    def test_mod_get_account_details(self):
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {self.mod_token.key}")
        response = self.client.get("/api/auth/user/")
        expected_response_data = {
            "id": 1,
            "username": "mod.mustermann",
            "is_mod": True
        }
        self.assertEqual(CustomUser.objects.count(), 3)
        self.assertEqual(Token.objects.count(), 1)
        self.assertEqual(response.data, expected_response_data)

    def test_mod_change_password_success(self):
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {self.mod_token.key}")
        data = {
            "new_password1": "qwertz$123",
            "new_password2": "qwertz$123"
        }
        response = self.client.post("/api/auth/change_password/", data=data)
        expected_response_data = {
            "detail": "New password has been saved."
        }
        self.assertEqual(CustomUser.objects.count(), 3)
        self.assertEqual(Token.objects.count(), 1)
        self.assertEqual(response.data, expected_response_data)

    def test_mod_change_password_passwords_not_match(self):
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {self.mod_token.key}")
        data = {
            "new_password1": "qwertz$123",
            "new_password2": "qwertz$1234"
        }
        response = self.client.post("/api/auth/change_password/", data=data)
        expected_response_data = {
            "errors": [
                {
                    "field": "new_password2",
                    "message": [
                        "The two password fields didn’t match."
                    ]
                }
            ]
        }
        self.assertEqual(CustomUser.objects.count(), 3)
        self.assertEqual(Token.objects.count(), 1)
        self.assertEqual(response.data, expected_response_data)

    def test_mod_logout(self):
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {self.mod_token.key}")
        response = self.client.post("/api/auth/logout/")
        expected_response_data = {
            "detail": "Successfully logged out."
        }
        self.assertEqual(CustomUser.objects.count(), 3)
        self.assertEqual(Token.objects.count(), 0)
        self.assertEqual(response.data, expected_response_data)


class MemAuthAPITestCase(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.mem_user = CustomUser.objects.create_user(
            username="member_q1w2e3r4",
            password="asdfgh%456",
            is_active=True
        )
        cls.mem_token = Token.objects.create(user=cls.mem_user)
        cls.mem_user_2 = CustomUser.objects.create_user(
            username="member_a5s6d7f8",
            password="asdfgh%456",
            is_active=True
        )

    def test_mem_get_user_lists(self):
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {self.mem_token.key}")
        response = self.client.get("/api/auth/users/")
        expected_response_data = {
            "errors": [
                {
                    "field": "detail",
                    "message": "You do not have permission to perform this action."
                }
            ]
        }
        self.assertEqual(CustomUser.objects.count(), 2)
        self.assertEqual(Token.objects.count(), 1)
        self.assertEqual(response.data, expected_response_data)

    def test_mem_get_user_details(self):
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {self.mem_token.key}")
        response = self.client.get("/api/auth/users/2/")
        expected_response_data = {
            "errors": [
                {
                    "field": "detail",
                    "message": "You do not have permission to perform this action."
                }
            ]
        }
        self.assertEqual(CustomUser.objects.count(), 2)
        self.assertEqual(Token.objects.count(), 1)
        self.assertEqual(response.data, expected_response_data)

    def test_mem_change_user_right(self):
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {self.mem_token.key}")
        data = {
            "is_mod": True
        }
        response = self.client.patch("/api/auth/users/2/")
        expected_response_data = {
            "errors": [
                {
                    "field": "detail",
                    "message": "You do not have permission to perform this action."
                }
            ]
        }
        self.assertEqual(CustomUser.objects.count(), 2)
        self.assertEqual(Token.objects.count(), 1)
        self.assertEqual(response.data, expected_response_data)

    def test_mem_get_account_details(self):
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {self.mem_token.key}")
        response = self.client.get("/api/auth/user/")
        expected_response_data = {
            "id": 1,
            "username": "member_q1w2e3r4",
            "is_mod": False
        }
        self.assertEqual(CustomUser.objects.count(), 2)
        self.assertEqual(Token.objects.count(), 1)
        self.assertEqual(response.data, expected_response_data)

    def test_mem_change_password(self):
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {self.mem_token.key}")
        data = {
            "new_password1": "qwertz$123",
            "new_password2": "qwertz$123"
        }
        response = self.client.post("/api/auth/change_password/", data=data)
        expected_response_data = {
            "errors": [
                {
                    "field": "detail",
                    "message": "You do not have permission to perform this action."
                }
            ]
        }
        self.assertEqual(CustomUser.objects.count(), 2)
        self.assertEqual(Token.objects.count(), 1)
        self.assertEqual(response.data, expected_response_data)

    def test_mem_logout(self):
        self.client.credentials(HTTP_AUTHORIZATION=f"Token {self.mem_token.key}")
        response = self.client.post("/api/auth/logout/")
        expected_response_data = {
            "detail": "Successfully logged out."
        }
        self.assertEqual(CustomUser.objects.count(), 1)
        self.assertEqual(Token.objects.count(), 0)
        self.assertEqual(response.data, expected_response_data)


class AnonymousUserAuthAPITestCase(APITestCase):
    @classmethod
    def setUpTestData(cls):
        cls.mem_user = CustomUser.objects.create_user(
            username="member_q1w2e3r4",
            password="asdfgh%456"
        )
        cls.mem_user_2 = CustomUser.objects.create_user(
            username="member_a5s6d7f8",
            password="asdfgh%456"
        )

    def test_anonymous_get_user_lists(self):
        response = self.client.get("/api/auth/users/")
        expected_response_data = {
            "errors": [
                {
                    "field": "detail",
                    "message": "Authentication credentials were not provided."
                }
            ]
        }
        self.assertEqual(CustomUser.objects.count(), 2)
        self.assertEqual(Token.objects.count(), 0)
        self.assertEqual(response.data, expected_response_data)

    def test_anonymous_get_user_details(self):
        response = self.client.get("/api/auth/users/2/")
        expected_response_data = {
            "errors": [
                {
                    "field": "detail",
                    "message": "Authentication credentials were not provided."
                }
            ]
        }
        self.assertEqual(CustomUser.objects.count(), 2)
        self.assertEqual(Token.objects.count(), 0)
        self.assertEqual(response.data, expected_response_data)

    def test_anonymous_change_user_right(self):
        data = {
            "is_mod": True
        }
        response = self.client.patch("/api/auth/users/2/")
        expected_response_data = {
            "errors": [
                {
                    "field": "detail",
                    "message": "Authentication credentials were not provided."
                }
            ]
        }
        self.assertEqual(CustomUser.objects.count(), 2)
        self.assertEqual(Token.objects.count(), 0)
        self.assertEqual(response.data, expected_response_data)

    def test_anonymous_get_account_details(self):
        response = self.client.get("/api/auth/user/")
        expected_response_data = {
            "errors": [
                {
                    "field": "detail",
                    "message": "Authentication credentials were not provided."
                }
            ]
        }
        self.assertEqual(CustomUser.objects.count(), 2)
        self.assertEqual(Token.objects.count(), 0)
        self.assertEqual(response.data, expected_response_data)

    def test_anonymous_change_password(self):
        data = {
            "new_password1": "qwertz$123",
            "new_password2": "qwertz$123"
        }
        response = self.client.post("/api/auth/change_password/", data=data)
        expected_response_data = {
            "errors": [
                {
                    "field": "detail",
                    "message": "Authentication credentials were not provided."
                }
            ]
        }
        self.assertEqual(CustomUser.objects.count(), 2)
        self.assertEqual(Token.objects.count(), 0)
        self.assertEqual(response.data, expected_response_data)
