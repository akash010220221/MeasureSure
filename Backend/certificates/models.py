from django.db import models


class Instrument(models.Model):
    """Minimal instrument record – enough for the first end-to-end slice."""

    name = models.CharField(max_length=200, help_text="e.g. Electronic Weighing Scale")
    serial_number = models.CharField(max_length=100, unique=True)
    manufacturer = models.CharField(max_length=200, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.serial_number})"


class VerificationRequest(models.Model):
    """A request to verify / certify an instrument."""

    STATUS_CHOICES = [
        ("submitted", "Submitted"),
        ("under_review", "Under Review"),
        ("inspection_scheduled", "Inspection Scheduled"),
        ("approved", "Approved"),
        ("rejected", "Rejected"),
    ]

    instrument = models.ForeignKey(
        Instrument,
        on_delete=models.CASCADE,
        related_name="verification_requests",
    )
    applicant_name = models.CharField(max_length=200)
    applicant_email = models.EmailField()
    status = models.CharField(
        max_length=25, choices=STATUS_CHOICES, default="submitted"
    )
    remarks = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"VR-{self.pk} | {self.instrument.name} | {self.status}"
