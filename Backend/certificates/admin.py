from django.contrib import admin
from .models import Instrument, VerificationRequest


@admin.register(Instrument)
class InstrumentAdmin(admin.ModelAdmin):
    list_display = ("name", "serial_number", "manufacturer", "created_at")
    search_fields = ("name", "serial_number")


@admin.register(VerificationRequest)
class VerificationRequestAdmin(admin.ModelAdmin):
    list_display = ("id", "instrument", "applicant_name", "status", "created_at")
    list_filter = ("status",)
    search_fields = ("applicant_name", "applicant_email")
