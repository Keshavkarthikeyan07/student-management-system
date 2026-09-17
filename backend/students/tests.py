"""
Automated tests for the Student Management System API.

Run with:
    python manage.py test students

Test cases
----------
1.  Create student — success
2.  Create student — duplicate email
3.  Create student — missing required fields
4.  Create student — invalid email format
5.  Create student — invalid year (out of range)
6.  Create student — invalid phone
7.  List students — success
8.  List students — search by name
9.  List students — search by department
10. Retrieve student — success
11. Retrieve student — invalid ID
12. Retrieve student — not found
13. Update student (PUT) — success
14. Update student (PATCH) — partial
15. Update student — duplicate email
16. Delete student — success
17. Delete student — not found
"""

from django.test import TestCase
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status

from .models import Student


# ============================================================
# Helper data
# ============================================================

VALID_STUDENT = {
    "name": "Alice Johnson",
    "email": "alice@example.com",
    "phone": "+1-555-0100",
    "department": "Computer Science",
    "year": 2,
}

VALID_STUDENT_2 = {
    "name": "Bob Smith",
    "email": "bob@example.com",
    "phone": "5550200",
    "department": "Mathematics",
    "year": 3,
}

LIST_URL = "/api/students/"


def detail_url(pk):
    return f"/api/students/{pk}/"


# ============================================================
# Test: Create Student
# ============================================================

class CreateStudentTests(APITestCase):

    def test_create_student_success(self):
        response = self.client.post(LIST_URL, VALID_STUDENT, format="json")
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Student.objects.count(), 1)
        self.assertEqual(response.data["student"]["name"], "Alice Johnson")
        self.assertEqual(response.data["message"], "Student created successfully.")

    def test_create_student_duplicate_email(self):
        Student.objects.create(**VALID_STUDENT)
        duplicate = {**VALID_STUDENT, "name": "Another Alice"}
        response = self.client.post(LIST_URL, duplicate, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("email", response.data)

    def test_create_student_missing_name(self):
        data = {**VALID_STUDENT}
        del data["name"]
        response = self.client.post(LIST_URL, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("name", response.data)

    def test_create_student_missing_email(self):
        data = {**VALID_STUDENT}
        del data["email"]
        response = self.client.post(LIST_URL, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_create_student_invalid_email(self):
        data = {**VALID_STUDENT, "email": "not-an-email"}
        response = self.client.post(LIST_URL, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("email", response.data)

    def test_create_student_invalid_year_too_low(self):
        data = {**VALID_STUDENT, "year": 0}
        response = self.client.post(LIST_URL, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("year", response.data)

    def test_create_student_invalid_year_too_high(self):
        data = {**VALID_STUDENT, "year": 7}
        response = self.client.post(LIST_URL, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("year", response.data)

    def test_create_student_invalid_phone(self):
        data = {**VALID_STUDENT, "phone": "abc-not-a-phone"}
        response = self.client.post(LIST_URL, data, format="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("phone", response.data)


# ============================================================
# Test: List Students
# ============================================================

class ListStudentsTests(APITestCase):

    def setUp(self):
        Student.objects.create(**VALID_STUDENT)
        Student.objects.create(**VALID_STUDENT_2)

    def test_list_students_success(self):
        response = self.client.get(LIST_URL)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 2)

    def test_search_by_name(self):
        response = self.client.get(LIST_URL, {"search": "Alice"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 1)
        self.assertEqual(response.data["results"][0]["name"], "Alice Johnson")

    def test_search_by_department(self):
        response = self.client.get(LIST_URL, {"search": "Math"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 1)
        self.assertEqual(response.data["results"][0]["department"], "Mathematics")

    def test_search_no_match(self):
        response = self.client.get(LIST_URL, {"search": "XYZ_NOT_EXIST"})
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["count"], 0)


# ============================================================
# Test: Retrieve Single Student
# ============================================================

class RetrieveStudentTests(APITestCase):

    def setUp(self):
        self.student = Student.objects.create(**VALID_STUDENT)

    def test_retrieve_student_success(self):
        response = self.client.get(detail_url(self.student.pk))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["email"], "alice@example.com")

    def test_retrieve_student_not_found(self):
        response = self.client.get(detail_url(99999))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


# ============================================================
# Test: Update Student
# ============================================================

class UpdateStudentTests(APITestCase):

    def setUp(self):
        self.student = Student.objects.create(**VALID_STUDENT)
        self.student2 = Student.objects.create(**VALID_STUDENT_2)

    def test_put_update_success(self):
        data = {
            "name": "Alice Updated",
            "email": "alice@example.com",
            "phone": "+1-555-9999",
            "department": "Data Science",
            "year": 3,
        }
        response = self.client.put(detail_url(self.student.pk), data, format="json")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["student"]["department"], "Data Science")

    def test_patch_update_success(self):
        response = self.client.patch(
            detail_url(self.student.pk), {"year": 4}, format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["student"]["year"], 4)

    def test_update_duplicate_email(self):
        data = {"email": "bob@example.com"}
        response = self.client.patch(
            detail_url(self.student.pk), data, format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("email", response.data)


# ============================================================
# Test: Delete Student
# ============================================================

class DeleteStudentTests(APITestCase):

    def setUp(self):
        self.student = Student.objects.create(**VALID_STUDENT)

    def test_delete_student_success(self):
        response = self.client.delete(detail_url(self.student.pk))
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(Student.objects.count(), 0)

    def test_delete_student_not_found(self):
        response = self.client.delete(detail_url(99999))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
