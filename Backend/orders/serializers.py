from decimal import Decimal

from django.db import transaction
from django.utils import timezone
from rest_framework import serializers

from .models import PurchaseOrder, PurchaseOrderItem, MedicationBatch


class PurchaseOrderItemSerializer(serializers.ModelSerializer):

    medication_name = serializers.CharField(
        read_only=True
    )

    total = serializers.DecimalField(
        source='total_cost',
        max_digits=12,
        decimal_places=2,
        read_only=True
    )

    unit_cost = serializers.DecimalField(
        max_digits=10,
        decimal_places=2,
        min_value=Decimal('0.01')
    )

    expiry_date = serializers.DateField(
        required=True
    )
    batch_number = serializers.SerializerMethodField()
    quantity_remaining = serializers.SerializerMethodField()

    class Meta:
        model = PurchaseOrderItem

        fields = [
            'id',
            'medication',
            'medication_name',
            'quantity',
            'unit_cost',
            'expiry_date',
            'batch_number',
            'quantity_remaining',
            'total',
        ]

        read_only_fields = [
            'id',
            'medication_name',
            'total',
            'batch_number',
            'quantity_remaining',
        ]

    def validate_quantity(self, value):

        if value <= 0:
            raise serializers.ValidationError(
                'Quantity must be greater than 0.'
            )

        return value

    def validate_expiry_date(self, value):

        if value <= timezone.now().date():
            raise serializers.ValidationError(
                'Expiry date must be in the future.'
            )

        return value
    def get_batch_number(self, obj):
        try:
            return obj.batch.batch_number
        except MedicationBatch.DoesNotExist:
            return None
    def get_quantity_remaining(self, obj):
        try:
            return obj.batch.quantity_remaining
        except MedicationBatch.DoesNotExist:
            return None


class PurchaseOrderSerializer(serializers.ModelSerializer):

    supplier_name = serializers.CharField(
        source='supplier.name',
        read_only=True
    )

    expectedDelivery = serializers.DateField(
        source='expected_delivery_date'
    )

    poNumber = serializers.CharField(
        source='po_number',
        read_only=True
    )

    orderDate = serializers.DateField(
        source='order_date',
        read_only=True
    )

    itemsCount = serializers.SerializerMethodField()

    totalAmount = serializers.SerializerMethodField()

    items = PurchaseOrderItemSerializer(
        many=True
    )

    created_by_name = serializers.CharField(
        source='created_by.username',
        read_only=True
    )

    approved_by_name = serializers.CharField(
        source='approved_by.username',
        read_only=True
    )

    received_by_name = serializers.CharField(
        source='received_by.username',
        read_only=True
    )

    class Meta:
        model = PurchaseOrder

        fields = [
            'id',
            'poNumber',
            'supplier',
            'supplier_name',
            'orderDate',
            'expectedDelivery',
            'payment_terms',
            'status',
            'itemsCount',
            'totalAmount',
            'items',
            'created_by_name',
            'approved_by_name',
            'received_by_name',
            'approved_at',
            'received_at',
        ]

        read_only_fields = [
            'id',
            'poNumber',
            'supplier_name',
            'orderDate',
            'status',
            'itemsCount',
            'totalAmount',
            'created_by_name',
            'approved_by_name',
            'received_by_name',
            'approved_at',
            'received_at',
        ]

    @transaction.atomic
    def create(self, validated_data):

        items = validated_data.pop('items')

        # Generate PO number
        count = PurchaseOrder.objects.count() + 1

        validated_data['po_number'] = f'PO-{count:04d}'

        # created_by is supplied from the view
        order = PurchaseOrder.objects.create(
            **validated_data
        )

        purchase_items = []

        for item in items:

            medication = item['medication']

            purchase_items.append(
                PurchaseOrderItem(
                    purchase_order=order,
                    medication=medication,
                    medication_name=medication.name,
                    quantity=item['quantity'],
                    unit_cost=item['unit_cost'],
                    expiry_date=item['expiry_date'],
                )
            )

        PurchaseOrderItem.objects.bulk_create(
            purchase_items
        )

        return order

    def get_itemsCount(self, obj):

        return f'{obj.items.count()} items'

    def get_totalAmount(self, obj):

        total = sum(
            item.total_cost
            for item in obj.items.all()
        )

        return f'${total:.2f}'