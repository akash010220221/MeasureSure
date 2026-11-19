"""
URL configuration for config project.
"""
from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse


def api_status(request):
    return JsonResponse({
        "message": "Django Backend Connected Successfully",
        "status": "success"
    })


urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/status/", api_status),
    path("api/", include("certificates.urls")),
]
