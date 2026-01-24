from rest_framework import serializers
from .models import Prescription

class PrescriptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Prescription
        fields = '__all__'

class PatientIDSerializer(serializers.Serializer):
    patient_id = serializers.CharField(max_length=100)
