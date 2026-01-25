import uuid
from datetime import date

from api.models import Prescription
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = "Seeds DB with complex edge cases for frontend testing"

    def handle(self, *args, **kwargs):
        Prescription.objects.all().delete()

        p1 = "patient_1"

        # 1. Standard Records (Baseline)
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

        # 2. Data Issue Triggers
        # Missing start_date (Should trigger frontend warning)
        Prescription.objects.create(
            patient_id=p1,
            medication_name="Metformin",
            dosage="500mg",
            route="Oral",
            frequency="Twice daily",
            start_date=None,  # MISSING DATE
            end_date=None,
            prescribing_doctor="Dr. Endocrinology",
            group_id=uuid.uuid4(),
            notes="IMPORTED RECORD - MISSING DATE",
        )

        # Missing dosage
        Prescription.objects.create(
            patient_id=p1,
            medication_name="Vitamin D",
            dosage="Unknown",
            route="Oral",
            frequency="Daily",
            start_date=date(2025, 3, 1),
            end_date=None,
            prescribing_doctor="Dr. Wellness",
            group_id=uuid.uuid4(),
            notes="Over the counter",
        )

        # 3. Provider Conflict (Same Med, Different Doctors/Dosages)
        # Dr. Jekyll's prescription (Ongoing)
        Prescription.objects.create(
            patient_id=p1,
            medication_name="Atorvastatin",
            dosage="20mg",
            route="Oral",
            frequency="Nightly",
            start_date=date(2025, 1, 1),
            end_date=None,
            prescribing_doctor="Dr. Jekyll",
            group_id=uuid.uuid4(),
            notes="Primary prescription",
        )

        # Dr. Hyde's prescription (Overlapping, short term change)
        Prescription.objects.create(
            patient_id=p1,
            medication_name="Atorvastatin",
            dosage="40mg",
            route="Oral",
            frequency="Nightly",
            start_date=date(2025, 2, 15),
            end_date=date(2025, 3, 1),
            prescribing_doctor="Dr. Hyde",
            group_id=uuid.uuid4(),
            notes="Temporary increase",
        )

        # 4. Legacy Record (Far Past)
        Prescription.objects.create(
            patient_id=p1,
            medication_name="Ciprofloxacin",
            dosage="250mg",
            route="Oral",
            frequency="Every 12 hours",
            start_date=date(2020, 5, 1),
            end_date=date(2020, 5, 14),
            prescribing_doctor="Dr. Urgent Care",
            group_id=uuid.uuid4(),
            notes="Old UTI treatment",
        )

        # Add data for other patients to ensure filtering still works
        Prescription.objects.create(
            patient_id="patient_2",
            medication_name="Paracetamol",
            dosage="500mg",
            route="Oral",
            frequency="As needed",
            start_date=date(2025, 6, 1),
            prescribing_doctor="Dr. House"
        )

        self.stdout.write(self.style.SUCCESS("Successfully seeded complex edge case data!"))