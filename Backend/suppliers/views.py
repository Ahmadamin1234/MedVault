from rest_framework import viewsets

from accounts.permissions import SupplierAccess

from .models import Supplier
from .serializers import SupplierSerializer


class SupplierViewSet(viewsets.ModelViewSet):

    queryset = Supplier.objects.all()

    serializer_class = SupplierSerializer

    permission_classes = [
        SupplierAccess
    ]