import os
from django.contrib import admin
from django.urls import path, include, re_path
from django.http import JsonResponse, FileResponse
from django.views.static import serve
from django.conf import settings

DIST_DIR = settings.BASE_DIR.parent / "frontend" / "dist"

def serve_index(request):
    index_path = DIST_DIR / "index.html"
    if os.path.exists(index_path):
        return FileResponse(open(index_path, "rb"))
    return JsonResponse({
        "message": "Student Management System API",
        "version": "1.0.0",
        "endpoints": {
            "students_list": "/api/students/",
            "student_detail": "/api/students/{id}/",
            "admin": "/admin/",
        },
    })


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/students/", include("students.urls")),
    path("assets/<path:path>", serve, {"document_root": DIST_DIR / "assets"}),
    path("favicon.svg", serve, {"document_root": DIST_DIR, "path": "favicon.svg"}),
    re_path(r"^(?!api/|admin/).*$", serve_index),
]

