"""Django admin registration for Student model."""

from django.contrib import admin
from .models import Student


@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ("id", "name", "email", "phone", "department", "year", "created_at")
    list_filter = ("department", "year")
    search_fields = ("name", "email", "phone", "department")
    ordering = ("-created_at",)
    readonly_fields = ("created_at", "updated_at")

    fieldsets = (
        ("Personal Information", {
            "fields": ("name", "email", "phone"),
        }),
        ("Academic Information", {
            "fields": ("department", "year"),
        }),
        ("Timestamps", {
            "fields": ("created_at", "updated_at"),
            "classes": ("collapse",),
        }),
    )
