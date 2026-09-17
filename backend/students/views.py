"""
Student API views.

Endpoints
---------
GET    /api/students/          → list all students (supports ?search=)
POST   /api/students/          → create student
GET    /api/students/{id}/     → retrieve single student
PUT    /api/students/{id}/     → full update
PATCH  /api/students/{id}/     → partial update
DELETE /api/students/{id}/     → delete student

HTTP Status Codes
-----------------
200  OK
201  Created
204  No Content (delete)
400  Bad Request (validation errors)
404  Not Found
500  Internal Server Error (handled by DRF exception handler)
"""

from django.db.models import Q
from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response

from .models import Student
from .serializers import StudentSerializer


# ============================================================
# Helper
# ============================================================

def _get_student_or_404(pk):
    """Return (student, None) or (None, error_response)."""
    try:
        pk_int = int(pk)
    except (ValueError, TypeError):
        return None, Response(
            {"error": "Invalid student ID."},
            status=status.HTTP_400_BAD_REQUEST,
        )

    try:
        student = Student.objects.get(pk=pk_int)
        return student, None
    except Student.DoesNotExist:
        return None, Response(
            {"error": f"Student with id {pk} not found."},
            status=status.HTTP_404_NOT_FOUND,
        )


# ============================================================
# List & Create
# ============================================================

@api_view(["GET", "POST"])
def student_list_create(request):
    """
    GET  → list all students, optionally filtered by ?search=<term>
    POST → create a new student
    """
    if request.method == "GET":
        search = request.query_params.get("search", "").strip()
        students = Student.objects.all()

        if search:
            students = students.filter(
                Q(name__icontains=search)
                | Q(email__icontains=search)
                | Q(department__icontains=search)
            )

        serializer = StudentSerializer(students, many=True)
        return Response(
            {
                "count": len(serializer.data),
                "results": serializer.data,
            },
            status=status.HTTP_200_OK,
        )

    # POST
    serializer = StudentSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(
            {
                "message": "Student created successfully.",
                "student": serializer.data,
            },
            status=status.HTTP_201_CREATED,
        )
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ============================================================
# Retrieve, Update & Delete
# ============================================================

@api_view(["GET", "PUT", "PATCH", "DELETE"])
def student_detail(request, pk):
    """
    GET    → retrieve single student
    PUT    → full update
    PATCH  → partial update
    DELETE → delete student
    """
    student, error = _get_student_or_404(pk)
    if error:
        return error

    if request.method == "GET":
        serializer = StudentSerializer(student)
        return Response(serializer.data, status=status.HTTP_200_OK)

    if request.method in ["PUT", "PATCH"]:
        partial = request.method == "PATCH"
        serializer = StudentSerializer(student, data=request.data, partial=partial)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {
                    "message": "Student updated successfully.",
                    "student": serializer.data,
                },
                status=status.HTTP_200_OK,
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # DELETE
    student_name = student.name
    student.delete()
    return Response(
        {"message": f'Student "{student_name}" deleted successfully.'},
        status=status.HTTP_204_NO_CONTENT,
    )
