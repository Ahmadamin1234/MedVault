from django.db import transaction
from django.db.models import Sum, F, DecimalField, ExpressionWrapper
from django.utils import timezone

from rest_framework import generics
from rest_framework.response import Response
from rest_framework import status

from accounts.permissions import (
    OrderAccess,
    OrderApprovePermission,
    OrderReceivePermission,
)

from .models import PurchaseOrder, MedicationBatch
from .serializers import PurchaseOrderSerializer


class PurchaseOrderListCreateView(generics.ListCreateAPIView):

    serializer_class = PurchaseOrderSerializer
    permission_classes = [OrderAccess]

    def get_queryset(self):

        return (
            PurchaseOrder.objects
            .select_related(
                'supplier',
                'created_by',
                'approved_by',
                'received_by',
            )
            .prefetch_related(
                'items__medication'
            )
        )

    def perform_create(self, serializer):

        serializer.save(
            created_by=self.request.user
        )


class PurchaseOrderSummaryView(generics.GenericAPIView):

    permission_classes = [OrderAccess]

    def get(self, request):

        orders = PurchaseOrder.objects.all()

        # Orders whose value is still committed
        # to be purchased/received.
        committed = (
            orders
            .filter(
                status__in=[
                    'PENDING',
                    'APPROVED',
                ]
            )
            .aggregate(
                value=Sum(
                    ExpressionWrapper(
                        F('items__quantity') *
                        F('items__unit_cost'),
                        output_field=DecimalField(
                            max_digits=12,
                            decimal_places=2
                        )
                    )
                )
            )['value'] or 0
        )

        # Current month
        now = timezone.now()

        month_start = now.replace(
            day=1,
            hour=0,
            minute=0,
            second=0,
            microsecond=0
        )

        received_this_month = orders.filter(
            status='RECEIVED',
            received_at__gte=month_start,
            received_at__lte=now
        ).count()

        return Response([
            {
                'label': 'Pending Approvals',
                'value': orders.filter(
                    status='PENDING'
                ).count(),
                'icon': 'ShoppingCart',
                'bg': 'bg-amber-50',
                'color': 'text-amber-500',
            },

            {
                'label': 'Orders In Transit',
                'value': orders.filter(
                    status='APPROVED'
                ).count(),
                'icon': 'Truck',
                'bg': 'bg-blue-50',
                'color': 'text-blue-500',
            },

            {
                'label': 'Received (This Month)',
                'value': received_this_month,
                'icon': 'CheckCircle',
                'bg': 'bg-emerald-50',
                'color': 'text-emerald-500',
            },

            {
                'label': 'Total Committed Value',
                'value': f'${committed:.2f}',
                'icon': 'DollarSign',
                'bg': 'bg-teal-50',
                'color': 'text-teal-600',
            },
        ])


class PurchaseOrderApproveView(generics.GenericAPIView):

    permission_classes = [OrderApprovePermission]

    @transaction.atomic
    def post(self, request, pk):

        try:

            order = (
                PurchaseOrder.objects
                .select_for_update()
                .get(pk=pk)
            )

        except PurchaseOrder.DoesNotExist:

            return Response(
                {
                    'detail': 'Purchase order not found.'
                },
                status=status.HTTP_404_NOT_FOUND
            )

        # Only PENDING orders can be approved.
        if order.status != 'PENDING':

            return Response(
                {
                    'detail': (
                        'Only PENDING orders can be approved. '
                        f'Current status: {order.status}'
                    )
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # Make sure the order actually has items.
        if not order.items.exists():

            return Response(
                {
                    'detail': (
                        'Cannot approve a purchase order '
                        'without items.'
                    )
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        order.status = 'APPROVED'
        order.approved_by = request.user
        order.approved_at = timezone.now()

        order.save(
            update_fields=[
                'status',
                'approved_by',
                'approved_at',
            ]
        )

        return Response(
            PurchaseOrderSerializer(
                order,
                context={
                    'request': request
                }
            ).data
        )


class PurchaseOrderReceiveView(generics.GenericAPIView):

    permission_classes = [OrderReceivePermission]

    @transaction.atomic
    def post(self, request, pk):

        try:

            order = (
                PurchaseOrder.objects
                .select_for_update()
                .select_related('supplier')
                .prefetch_related('items__medication')
                .get(pk=pk)
            )

        except PurchaseOrder.DoesNotExist:

            return Response(
                {
                    'detail': 'Purchase order not found.'
                },
                status=status.HTTP_404_NOT_FOUND
            )

        # ------------------------------------------
        # CHECK ORDER STATUS
        # ------------------------------------------

        if order.status != 'APPROVED':

            return Response(
                {
                    'detail': (
                        'Only APPROVED orders can be received. '
                        f'Current status: {order.status}'
                    )
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        items = order.items.select_related(
            'medication'
        )

        if not items.exists():

            return Response(
                {
                    'detail': (
                        'Cannot receive a purchase order '
                        'without items.'
                    )
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        # ------------------------------------------
        # RECEIVE EACH PURCHASE ITEM
        # ------------------------------------------

        for item in items:

            medication = item.medication

            # Medication was deleted
            if medication is None:

                return Response(
                    {
                        'detail': (
                            f'Medication "{item.medication_name}" '
                            'no longer exists in inventory.'
                        )
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )

            # --------------------------------------
            # GENERATE BATCH NUMBER
            # --------------------------------------
            medication.stock_quantity += item.quantity
            
            medication.save(
                            update_fields=[
                                'stock_quantity'
                            ]
                        )

            # --------------------------------------
            # CREATE MEDICATION BATCH
            # --------------------------------------

            MedicationBatch.objects.create(

                medication=medication,

                supplier=order.supplier,

                purchase_order_item=item,

                batch_number=f'BAT_{item.id:06d}',

                quantity_received=item.quantity,

                quantity_remaining=item.quantity,

                unit_cost=item.unit_cost,

                expiry_date=item.expiry_date,
            )


            

        # ------------------------------------------
        # MARK PURCHASE ORDER AS RECEIVED
        # ------------------------------------------

        order.status = 'RECEIVED'

        order.received_by = request.user

        order.received_at = timezone.now()

        order.save(
            update_fields=[
                'status',
                'received_by',
                'received_at',
            ]
        )

        return Response(
            PurchaseOrderSerializer(
                order,
                context={
                    'request': request
                }
            ).data
        )

class PurchaseOrderCancelView(generics.GenericAPIView):

    permission_classes = [OrderAccess]

    @transaction.atomic
    def post(self, request, pk):

        try:

            order = (
                PurchaseOrder.objects
                .select_for_update()
                .get(pk=pk)
            )

        except PurchaseOrder.DoesNotExist:

            return Response(
                {
                    'detail': 'Purchase order not found.'
                },
                status=status.HTTP_404_NOT_FOUND
            )

        # Only PENDING or APPROVED orders
        # can be cancelled.
        if order.status not in [
            'PENDING',
            'APPROVED',
        ]:

            return Response(
                {
                    'detail': (
                        'Only PENDING or APPROVED orders '
                        'can be cancelled. '
                        f'Current status: {order.status}'
                    )
                },
                status=status.HTTP_400_BAD_REQUEST
            )

        order.status = 'CANCELLED'

        order.save(
            update_fields=[
                'status'
            ]
        )

        return Response(
            PurchaseOrderSerializer(
                order,
                context={
                    'request': request
                }
            ).data
        )