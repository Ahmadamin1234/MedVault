from datetime import date, timedelta

from rest_framework import serializers

from orders.models import MedicationBatch


class ExpiryAlertSerializer(serializers.ModelSerializer):

    medicationName = serializers.CharField(
        source='medication.name',
        read_only=True
    )

    batchNo = serializers.CharField(
        source='batch_number',
        read_only=True
    )

    expiryDate = serializers.DateField(
        source='expiry_date',
        read_only=True
    )

    daysLeft = serializers.SerializerMethodField()

    stockQty = serializers.SerializerMethodField()

    valueAtRisk = serializers.SerializerMethodField()

    type = serializers.SerializerMethodField()

    color = serializers.SerializerMethodField()

    supplierName = serializers.CharField(
        source='supplier.name',
        read_only=True
    )

    class Meta:

        model = MedicationBatch

        fields = [
            'id',
            'medicationName',
            'batchNo',
            'expiryDate',
            'daysLeft',
            'stockQty',
            'valueAtRisk',
            'type',
            'color',
            'supplierName',
        ]

    def get_daysLeft(self, obj):

        days = (
            obj.expiry_date - date.today()
        ).days

        if days < 0:
            return 'EXPIRED'

        return f'{days} DAYS'

    def get_stockQty(self, obj):

        return f'{obj.quantity_remaining} Units'

    def get_valueAtRisk(self, obj):

        value = (
            obj.quantity_remaining *
            obj.unit_cost
        )

        return f'${value:.2f}'

    def get_type(self, obj):

        today = date.today()

        if obj.expiry_date < today:
            return 'EXPIRED'

        if obj.expiry_date <= today + timedelta(days=30):
            return '30_DAYS'

        return '90_DAYS'

    def get_color(self, obj):

        expiry_type = self.get_type(obj)

        if expiry_type == 'EXPIRED':

            return (
                'text-rose-600 '
                'bg-rose-50 '
                'border-rose-200'
            )

        if expiry_type == '30_DAYS':

            return (
                'text-amber-500 '
                'bg-amber-50 '
                'border-amber-200'
            )

        return (
            'text-teal-600 '
            'bg-teal-50 '
            'border-teal-200'
        )