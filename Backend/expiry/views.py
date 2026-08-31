from datetime import date, timedelta
from decimal import Decimal

from django.db import transaction

from rest_framework import generics, serializers, status
from rest_framework.response import Response
from rest_framework.views import APIView

from accounts.permissions import ExpiryAccess

from orders.models import MedicationBatch

from .models import ExpiryResolution
from .serializers import ExpiryAlertSerializer


class ExpiryActionSerializer(serializers.Serializer):

    action = serializers.ChoiceField(
        choices=[
            'DISPOSE',
            'RETURN',
            'TRANSFER',
            'CLEARANCE',
        ]
    )


class ExpiryAlertView(generics.GenericAPIView):

    serializer_class = ExpiryAlertSerializer

    permission_classes = [
        ExpiryAccess
    ]

    def get(self, request):

        today = date.today()

        cutoff = today + timedelta(days=90)

        batches = (
            MedicationBatch.objects
            .select_related(
                'medication',
                'supplier',
                'purchase_order_item',
            )
            .filter(
                expiry_date__lte=cutoff,
                quantity_remaining__gt=0,
            )
            .order_by(
                'expiry_date',
                'medication__name',
                'received_at',
            )
        )

        alerts = self.get_serializer(
            batches,
            many=True
        ).data

        expired = [
            item
            for item in alerts
            if item['type'] == 'EXPIRED'
        ]

        thirty_days = [
            item
            for item in alerts
            if item['type'] == '30_DAYS'
        ]

        current_loss = sum(
            (
                Decimal(
                    item['valueAtRisk']
                    .replace('$', '')
                )
                for item in expired
            ),
            Decimal('0'),
        )

        future_risk = sum(
            (
                Decimal(
                    item['valueAtRisk']
                    .replace('$', '')
                )
                for item in alerts
                if item['type'] != 'EXPIRED'
            ),
            Decimal('0'),
        )

        return Response({

            'summary': {

                'totalExpiryLoss':
                    f'${current_loss:.2f}',

                'totalFutureRisk':
                    f'${future_risk:.2f}',

                'totalValueAtRisk':
                    f'${current_loss + future_risk:.2f}',

                'batchesToDispose':
                    len(expired),

                'batchesEligibleForReturn':
                    len(thirty_days),
            },

            'batches': alerts,
        })


class ExpiryActionView(APIView):

    permission_classes = [
        ExpiryAccess
    ]

    @transaction.atomic
    def post(
        self,
        request,
        batch_id
    ):

        serializer = ExpiryActionSerializer(
            data=request.data
        )

        serializer.is_valid(
            raise_exception=True
        )

        try:

            batch = (
                MedicationBatch.objects
                .select_for_update()
                .select_related(
                    'medication'
                )
                .get(
                    id=batch_id,
                    quantity_remaining__gt=0,
                )
            )

        except MedicationBatch.DoesNotExist:

            return Response(
                {
                    'detail':
                        'Expiry batch not found or has no remaining stock.'
                },
                status=status.HTTP_404_NOT_FOUND
            )

        quantity = batch.quantity_remaining

        value = (
            quantity *
            batch.unit_cost
        )

        action = serializer.validated_data[
            'action'
        ]

        # ----------------------------------
        # RECORD RESOLUTION
        # ----------------------------------

        ExpiryResolution.objects.create(

            batch=batch,

            user=request.user,

            action=action,

            quantity=quantity,

            value=value,
        )

        # ----------------------------------
        # REMOVE BATCH STOCK
        # ----------------------------------

        batch.quantity_remaining = 0

        batch.save(
            update_fields=[
                'quantity_remaining'
            ]
        )

        # ----------------------------------
        # UPDATE MASTER STOCK
        # ----------------------------------

        medication = batch.medication

        medication.stock_quantity = max(
            0,
            medication.stock_quantity - quantity
        )

        medication.save(
            update_fields=[
                'stock_quantity'
            ]
        )

        return Response({

            'detail':
                f'{action.title()} action recorded.',

            'action':
                action,

            'batch':
                batch.batch_number,

            'quantity':
                quantity,

            'value':
                f'${value:.2f}',
        })