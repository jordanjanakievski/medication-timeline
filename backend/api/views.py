from rest_framework import generics, pagination

from .models import Prescription
from .serializers import PatientIDSerializer, PrescriptionSerializer


class CustomPatientIDPagination(pagination.PageNumberPagination):
    page_size = 10
    page_size_query_param = "page_size"
    max_page_size = 100


class PrescriptionListView(generics.ListAPIView):
    serializer_class = PrescriptionSerializer
    pagination_class = CustomPatientIDPagination

    def get_queryset(self):
        queryset = Prescription.objects.all().order_by('patient_id', 'start_date')
        patient_id = self.request.query_params.get('patient_id')
        if patient_id is not None:
            queryset = queryset.filter(patient_id=patient_id)
        return queryset


class PatientIDListView(generics.ListAPIView):
    serializer_class = PatientIDSerializer
    pagination_class = CustomPatientIDPagination

    def get_queryset(self):
        # Get all distinct patient_ids
        return (
            Prescription.objects.order_by("patient_id").values("patient_id").distinct()
        )
