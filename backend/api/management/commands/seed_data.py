import uuid
from datetime import date

from api.models import Prescription
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = "Seeds DB with simple, clean data for frontend dev"

    def handle(self, *args, **kwargs):
        Prescription.objects.all().delete()

        p1 = "patient_1"

        # Completed Medication Record
        Prescription.objects.create(
            patient_id=p1,
            medication_name="Amoxicillin",
            dosage="500mg",
            route="Oral",
            frequency="Every 8 hours",
            start_date=date(2025, 1, 1),
            end_date=date(2025, 1, 10),
            prescribing_doctor="Dr. Smith",
            group_id=uuid.uuid4(),
            notes="Standard course for infection",
        )

        # Ongoing Medication Record
        Prescription.objects.create(
            patient_id=p1,
            medication_name="Lisinopril",
            dosage="10mg",
            route="Oral",
            frequency="Daily",
            start_date=date(2025, 2, 1),
            end_date=None,  # Ongoing
            prescribing_doctor="Dr. Jones",
            group_id=uuid.uuid4(),
            notes="Chronic condition management",
        )

        self.stdout.write(self.style.SUCCESS("Successfully seeded simple data!"))
