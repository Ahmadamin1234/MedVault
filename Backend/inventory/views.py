from rest_framework import generics
from accounts.permissions import InventoryAccess,MedicationDeletePermission

from .models import Medication
from .serializers import MedicationSerializer


class MedicationListCreateView(generics.ListCreateAPIView):
    serializer_class = MedicationSerializer
    permission_classes = [InventoryAccess]

    def get_queryset(self):
        return Medication.objects.all()

    def perform_create(self, serializer):
        serializer.save()
class MedicationDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = MedicationSerializer
    def get_queryset(self):
        return Medication.objects.all()
    def get_permissions(self):
        if self.request.method == 'DELETE':
            return [MedicationDeletePermission()]
        return [InventoryAccess()]
    