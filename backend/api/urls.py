from django.urls import path

from .views import PatientIDListView, PrescriptionListView

urlpatterns = [
    path("prescriptions/", PrescriptionListView.as_view(), name="prescription-list"),
    path("patient/", PatientIDListView.as_view(), name="patient-id-list"),
]
