"""
Student data model.

Fields
------
id          : Auto-increment primary key (BigAutoField via DEFAULT_AUTO_FIELD)
name        : Student's full name (required)
email       : Unique, valid email address (required)
phone       : Contact phone number (required)
department  : Academic department (required)
year        : Year of study 1-6 (required, validated in serializer)
created_at  : Timestamp set automatically on creation
updated_at  : Timestamp updated automatically on every save
"""

from django.db import models


class Student(models.Model):
    name = models.CharField(max_length=200)
    email = models.EmailField(unique=True, max_length=254)
    phone = models.CharField(max_length=20)
    department = models.CharField(max_length=200)
    year = models.PositiveSmallIntegerField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        db_table = "students"
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.name} ({self.email})"
