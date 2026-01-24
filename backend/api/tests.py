import uuid
from datetime import date

from django.core.management import call_command
from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient

from .models import Prescription


class PrescriptionEndpointTest(TestCase):
    def setUp(self):
        self.client = APIClient()
        # Run the seed_data command to populate the database
        call_command("seed_data")

        # Add more patients for testing patient-ids endpoint
        Prescription.objects.create(
            patient_id="patient_2",
            medication_name="Paracetamol",
            dosage="500mg",
            route="Oral",
            frequency="Every 4 hours",
            start_date=date(2025, 3, 1),
            end_date=date(2025, 3, 5),
            prescribing_doctor="Dr. House",
            group_id=uuid.uuid4(),
            notes="Pain relief",
        )
        Prescription.objects.create(
            patient_id="patient_3",
            medication_name="Aspirin",
            dosage="75mg",
            route="Oral",
            frequency="Daily",
            start_date=date(2025, 4, 1),
            end_date=None,
            prescribing_doctor="Dr. Grey",
            group_id=uuid.uuid4(),
            notes="Blood thinner",
        )

    def test_get_prescriptions_patient_1(self):
        # The URL for the prescription list
        url = reverse("prescription-list")

        # Filter by patient_id='patient_1'
        response = self.client.get(url, {"patient_id": "patient_1"})

        # Assertions
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # We expect 2 records based on the seed_data command
        self.assertEqual(response.data["count"], 2)  # Use count for paginated results

        # Check specific data points to verify correct retrieval
        med_names = {item["medication_name"] for item in response.data["results"]}
        self.assertIn("Amoxicillin", med_names)
        self.assertIn("Lisinopril", med_names)

        # verify filtering works (assuming we had other patients)
        # Add a dummy patient to verify filtering excludes them
        Prescription.objects.create(
            patient_id="other_patient",
            medication_name="Ibuprofen",
            dosage="200mg",
            route="Oral",
            frequency="As needed",
            prescribing_doctor="Dr. House",
        )

        # Request again for patient_1, count should still be 2
        response_filtered = self.client.get(url, {"patient_id": "patient_1"})
        self.assertEqual(response_filtered.data["count"], 2)

        # Request for other_patient, count should be 1
        response_other = self.client.get(url, {"patient_id": "other_patient"})
        self.assertEqual(response_other.data["count"], 1)
        self.assertEqual(
            response_other.data["results"][0]["medication_name"], "Ibuprofen"
        )

    def test_get_patient_ids_list(self):
        url = reverse("patient-id-list")
        response = self.client.get(url)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("count", response.data)
        self.assertIn("results", response.data)

        # Expect 3 unique patient IDs: patient_1, patient_2, patient_3
        self.assertEqual(response.data["count"], 3)
        patient_ids = {item["patient_id"] for item in response.data["results"]}
        self.assertIn("patient_1", patient_ids)
        self.assertIn("patient_2", patient_ids)
        self.assertIn("patient_3", patient_ids)
