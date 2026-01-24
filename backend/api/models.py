import uuid

from django.db import models


class Prescription(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    patient_id = models.CharField(max_length=100, db_index=True)
    group_id = models.UUIDField(null=True, db_index=True)

    medication_name = models.CharField(max_length=255)
    dosage = models.CharField(max_length=100)
    # Oral, Sublingual, Intravenous, Topical, etc
    route = models.CharField(max_length=100)
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    # e.g., Daily, Twice daily, Every 8 hours, etc
    frequency = models.CharField(max_length=100)
    prescribing_doctor = models.CharField(max_length=255)
    notes = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"{self.patient_id}: {self.medication_name} ({self.dosage})"
