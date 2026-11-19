from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny

from .models import Instrument, VerificationRequest
from .serializers import (
    InstrumentSerializer,
    VerificationRequestSerializer,
    VerificationSubmissionSerializer,
)


class InstrumentListCreate(generics.ListCreateAPIView):
    """GET  /api/instruments/      → list all instruments
       POST /api/instruments/      → create one instrument"""

    queryset = Instrument.objects.all().order_by("-created_at")
    serializer_class = InstrumentSerializer
    permission_classes = [AllowAny]


class VerificationRequestListCreate(generics.ListCreateAPIView):
    """GET  /api/verification-requests/   → list all requests
       POST /api/verification-requests/   → create (needs instrument FK id)"""

    queryset = VerificationRequest.objects.select_related("instrument").order_by(
        "-created_at"
    )
    serializer_class = VerificationRequestSerializer
    permission_classes = [AllowAny]


class VerificationRequestDetail(generics.RetrieveAPIView):
    """GET /api/verification-requests/<pk>/  → single request + status"""

    queryset = VerificationRequest.objects.select_related("instrument")
    serializer_class = VerificationRequestSerializer
    permission_classes = [AllowAny]


class VerificationSubmit(generics.CreateAPIView):
    """
    POST /api/submit-verification/
    Convenience endpoint – accepts instrument info + applicant info,
    creates both Instrument (or reuses by serial_number) and
    VerificationRequest in one call.
    """

    serializer_class = VerificationSubmissionSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        vr = serializer.save()
        # Return the full verification request via the read serializer
        output = VerificationRequestSerializer(vr).data
        return Response(output, status=status.HTTP_201_CREATED)
