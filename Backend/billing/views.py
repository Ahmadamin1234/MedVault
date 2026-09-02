from rest_framework import generics

from accounts.permissions import BillingAccess

from .models import Sale
from .serializers import SaleSerializer


class SaleListCreateView(
    generics.ListCreateAPIView
):

    serializer_class = SaleSerializer

    permission_classes = [
        BillingAccess
    ]

    def get_queryset(self):

        return (
            Sale.objects
            .prefetch_related(
                'items',
                'items__medication',
                'items__batch_allocations',
                'items__batch_allocations__batch',
            )
            .order_by('-created_at')
        )