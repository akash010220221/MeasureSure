from rest_framework import serializers
from .models import Instrument, VerificationRequest


class InstrumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Instrument
        fields = ["id", "name", "serial_number", "manufacturer", "created_at"]
        read_only_fields = ["id", "created_at"]


class VerificationRequestSerializer(serializers.ModelSerializer):
    instrument_detail = InstrumentSerializer(source="instrument", read_only=True)

    class Meta:
        model = VerificationRequest
        fields = [
            "id",
            "instrument",          # write: FK id
            "instrument_detail",   # read: nested object
            "applicant_name",
            "applicant_email",
            "status",
            "remarks",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["id", "status", "remarks", "created_at", "updated_at"]


class VerificationSubmissionSerializer(serializers.Serializer):
    """
    Convenience serializer that accepts instrument details + applicant info
    in a single POST and creates both records in one shot.
    """

    # Instrument fields
    instrument_name = serializers.CharField(max_length=200)
    serial_number = serializers.CharField(max_length=100)
    manufacturer = serializers.CharField(max_length=200, required=False, default="")

    # Applicant fields
    applicant_name = serializers.CharField(max_length=200)
    applicant_email = serializers.EmailField()

    def create(self, validated_data):
        instrument, _created = Instrument.objects.get_or_create(
            serial_number=validated_data["serial_number"],
            defaults={
                "name": validated_data["instrument_name"],
                "manufacturer": validated_data.get("manufacturer", ""),
            },
        )
        vr = VerificationRequest.objects.create(
            instrument=instrument,
            applicant_name=validated_data["applicant_name"],
            applicant_email=validated_data["applicant_email"],
        )
        return vr
