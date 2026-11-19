from django.urls import path
from . import views

urlpatterns = [
    path("instruments/", views.InstrumentListCreate.as_view(), name="instrument-list"),
    path(
        "verification-requests/",
        views.VerificationRequestListCreate.as_view(),
        name="vr-list",
    ),
    path(
        "verification-requests/<int:pk>/",
        views.VerificationRequestDetail.as_view(),
        name="vr-detail",
    ),
    path(
        "submit-verification/",
        views.VerificationSubmit.as_view(),
        name="submit-verification",
    ),
]
