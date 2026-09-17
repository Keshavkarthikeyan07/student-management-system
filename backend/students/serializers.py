"""
Serializer for the Student model.

Validation rules
----------------
name        : required, non-empty, max 200 chars
email       : required, valid email format, unique across all students
phone       : required, 7-20 digits (allows +, -, spaces, parentheses)
department  : required, non-empty, max 200 chars
year        : required, integer between 1 and 6 (inclusive)
"""

import re
from rest_framework import serializers
from .models import Student


class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = [
            "id",
            "name",
            "email",
            "phone",
            "department",
            "year",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "created_at", "updated_at"]

    # ------------------------------------------------------------------ #
    # Field-level validators
    # ------------------------------------------------------------------ #

    def validate_name(self, value):
        value = value.strip()
        if not value:
            raise serializers.ValidationError("Name cannot be empty.")
        if len(value) > 200:
            raise serializers.ValidationError("Name cannot exceed 200 characters.")
        return value

    def validate_email(self, value):
        value = value.strip().lower()
        if not value:
            raise serializers.ValidationError("Email cannot be empty.")

        # Check uniqueness, excluding the current instance on updates
        qs = Student.objects.filter(email=value)
        if self.instance:
            qs = qs.exclude(pk=self.instance.pk)
        if qs.exists():
            raise serializers.ValidationError(
                "A student with this email already exists."
            )
        return value

    def validate_phone(self, value):
        value = value.strip()
        if not value:
            raise serializers.ValidationError("Phone number cannot be empty.")
        # Allow digits, spaces, +, -, ( )
        cleaned = re.sub(r"[\s\-\+\(\)]", "", value)
        if not cleaned.isdigit():
            raise serializers.ValidationError(
                "Phone number must contain only digits (spaces, +, - and parentheses are allowed)."
            )
        if len(cleaned) < 7 or len(cleaned) > 15:
            raise serializers.ValidationError(
                "Phone number must be between 7 and 15 digits."
            )
        return value

    def validate_department(self, value):
        value = value.strip()
        if not value:
            raise serializers.ValidationError("Department cannot be empty.")
        if len(value) > 200:
            raise serializers.ValidationError(
                "Department name cannot exceed 200 characters."
            )
        return value

    def validate_year(self, value):
        if value is None:
            raise serializers.ValidationError("Year is required.")
        if not (1 <= value <= 6):
            raise serializers.ValidationError(
                "Year must be between 1 and 6."
            )
        return value
