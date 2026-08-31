from decimal import Decimal
from datetime import date

from django.db import transaction
from rest_framework import serializers

from inventory.models import Medication
from orders.models import MedicationBatch

from .models import Sale, SaleItem, SaleItemBatch


# ============================================================
# SALE ITEM INPUT
# Used when React creates a new sale
# ============================================================

class SaleItemInputSerializer(serializers.Serializer):

    medication = serializers.IntegerField()

    quantity = serializers.IntegerField(
        min_value=1
    )

    discount_percent = serializers.DecimalField(
        max_digits=5,
        decimal_places=2,
        min_value=0,
        max_value=100,
        default=0
    )


# ============================================================
# BATCH ALLOCATION RESPONSE
# Shows which batch was consumed during a sale
# ============================================================

class SaleItemBatchSerializer(serializers.ModelSerializer):

    batch_number = serializers.CharField(
        source='batch.batch_number',
        read_only=True
    )

    expiry_date = serializers.DateField(
        source='batch.expiry_date',
        read_only=True
    )

    class Meta:

        model = SaleItemBatch

        fields = [
            'id',
            'batch_number',
            'quantity',
            'unit_cost',
            'total_cost',
            'expiry_date',
            'created_at',
        ]

        read_only_fields = fields


# ============================================================
# SALE ITEM RESPONSE
# Used when returning billing history
# ============================================================

class SaleItemResponseSerializer(serializers.ModelSerializer):

    medication_name = serializers.CharField(
        source='medication.name',
        read_only=True
    )

    batch_allocations = SaleItemBatchSerializer(
        many=True,
        read_only=True
    )

    class Meta:

        model = SaleItem

        fields = [
            'id',
            'medication',
            'medication_name',
            'quantity',
            'unit_price',
            'discount_percent',
            'line_total',
            'batch_allocations',
        ]

        read_only_fields = fields


# ============================================================
# SALE SERIALIZER
# ============================================================

class SaleSerializer(serializers.ModelSerializer):

    # --------------------------------------------------------
    # FRONTEND FRIENDLY FIELDS
    # --------------------------------------------------------

    invoiceId = serializers.CharField(
        source='invoice_id',
        read_only=True
    )

    customer = serializers.CharField(
        source='customer_name',
        read_only=True
    )

    amount = serializers.SerializerMethodField()

    time = serializers.SerializerMethodField()

    status = serializers.CharField(
        default='Completed',
        read_only=True
    )

    timestamp = serializers.DateTimeField(
        source='created_at',
        read_only=True
    )

    # --------------------------------------------------------
    # ITEMS FOR CREATE
    # --------------------------------------------------------

    items = SaleItemInputSerializer(
        many=True,
        write_only=True,
        required=True
    )

    # --------------------------------------------------------
    # ITEMS FOR RESPONSE
    # --------------------------------------------------------

    sale_items = SaleItemResponseSerializer(
        source='items',
        many=True,
        read_only=True
    )

    # ========================================================
    # META
    # ========================================================

    class Meta:

        model = Sale

        fields = [

            # Basic
            'id',
            'invoiceId',
            'customer',
            'amount',
            'time',
            'timestamp',
            'status',

            # Sale information
            'customer_name',
            'prescription_reference',
            'payment_method',

            # Payment
            'amount_tendered',

            # Totals
            'subtotal',
            'tax',
            'grand_total',
            'change_due',

            # Create items
            'items',

            # Returned items
            'sale_items',
        ]

        read_only_fields = [

            'id',
            'invoiceId',
            'customer',
            'amount',
            'time',
            'timestamp',
            'status',

            'subtotal',
            'tax',
            'grand_total',
            'change_due',

            'sale_items',
        ]

    # ========================================================
    # VALIDATE ITEMS
    # ========================================================

    def validate_items(self, items):

        if not items:

            raise serializers.ValidationError(
                'Add at least one medication to the cart.'
            )

        medication_ids = [
            item['medication']
            for item in items
        ]
        if len(medication_ids) != len(set(medication_ids)):
            raise serializers.ValidationError(
        'The same medication cannot be added twice to the same sale.'
    )

        medications = Medication.objects.filter(
            id__in=medication_ids
        )

        medication_map = {
            medication.id: medication
            for medication in medications
        }

        for item in items:

            medication = medication_map.get(
                item['medication']
            )

            if medication is None:

                raise serializers.ValidationError(
                    'One or more medications are invalid.'
                )

            # ------------------------------------------------
            # CHECK TOTAL STOCK
            # ------------------------------------------------

            if item['quantity'] > medication.stock_quantity:

                raise serializers.ValidationError(
                    f'Not enough stock for '
                    f'{medication.name}. '
                    f'Available stock: '
                    f'{medication.stock_quantity}.'
                )

            # ------------------------------------------------
            # CHECK NON-EXPIRED BATCH STOCK
            # ------------------------------------------------

            batches = MedicationBatch.objects.filter(
                medication=medication,
                quantity_remaining__gt=0,
                expiry_date__gt=date.today()
            )

            available_quantity = sum(
                batch.quantity_remaining
                for batch in batches
            )

            if item['quantity'] > available_quantity:

                raise serializers.ValidationError(
                    f'Not enough non-expired batch stock '
                    f'for {medication.name}. '
                    f'Available: {available_quantity}.'
                )

        return items

    # ========================================================
    # CREATE SALE
    # ========================================================

    @transaction.atomic
    def create(self, validated_data):

        items = validated_data.pop('items')

        medication_ids = [
            item['medication']
            for item in items
        ]

        # ----------------------------------------------------
        # LOCK MEDICATIONS
        # ----------------------------------------------------

        medications = (
            Medication.objects
            .select_for_update()
            .filter(
                id__in=medication_ids
            )
        )

        medication_map = {
            medication.id: medication
            for medication in medications
        }

        subtotal = Decimal('0.00')

        sale_items_data = []

        # ====================================================
        # CALCULATE SALE TOTAL
        # ====================================================

        for item in items:

            medication = medication_map.get(
                item['medication']
            )

            if medication is None:

                raise serializers.ValidationError(
                    'Medication not found.'
                )

            quantity = item['quantity']

            # ------------------------------------------------
            # EXTRA STOCK CHECK
            # ------------------------------------------------

            if quantity > medication.stock_quantity:

                raise serializers.ValidationError(
                    f'Not enough stock for '
                    f'{medication.name}.'
                )

            # ------------------------------------------------
            # CALCULATE LINE TOTAL
            # ------------------------------------------------

            line_subtotal = (
                medication.sale_price *
                quantity
            )

            discount = (
                line_subtotal *
                item['discount_percent'] /
                Decimal('100')
            )

            line_total = (
                line_subtotal -
                discount
            )

            subtotal += line_total

            sale_items_data.append(
                (
                    medication,
                    item,
                    line_total
                )
            )

        # ====================================================
        # TAX
        # ====================================================

        tax = (
            subtotal *
            Decimal('0.07')
        )

        # ====================================================
        # GRAND TOTAL
        # ====================================================

        grand_total = max(
            Decimal('0.00'),
            subtotal + tax
        )

        # ====================================================
        # AMOUNT TENDERED
        # ====================================================

        amount_tendered = validated_data[
            'amount_tendered'
        ]

        if amount_tendered < grand_total:

            raise serializers.ValidationError({
                'amount_tendered':
                    'Amount tendered is less than '
                    'the grand total.'
            })

        # ====================================================
        # GENERATE INVOICE NUMBER
        # ====================================================

        last_sale = (
            Sale.objects
            .order_by('-id')
            .first()
        )

        if last_sale:
            next_number = last_sale.id + 1
        else:
            next_number = 1

        invoice_id = (
            f'INV-{next_number:06d}'
        )

        # ====================================================
        # CREATE SALE
        # ====================================================

        sale = Sale.objects.create(

            invoice_id=invoice_id,

            subtotal=subtotal,

            tax=tax,

            grand_total=grand_total,

            change_due=(
                amount_tendered -
                grand_total
            ),

            **validated_data
        )

        # ====================================================
        # PROCESS SALE ITEMS
        # ====================================================

        for medication, item, line_total in sale_items_data:

            quantity_to_sell = item['quantity']

            # ------------------------------------------------
            # CREATE SALE ITEM
            # ------------------------------------------------

            sale_item = SaleItem.objects.create(

                sale=sale,

                medication=medication,

                quantity=quantity_to_sell,

                unit_price=medication.sale_price,

                discount_percent=item[
                    'discount_percent'
                ],

                line_total=line_total,
            )

            # ------------------------------------------------
            # GET BATCHES
            # FEFO:
            # First Expiry, First Out
            # ------------------------------------------------

            batches = (
                MedicationBatch.objects
                .select_for_update()
                .filter(
                    medication=medication,
                    quantity_remaining__gt=0,
                    expiry_date__gt=date.today()
                )
                .order_by(
                    'expiry_date',
                    'received_at',
                    'id'
                )
            )

            remaining_quantity = quantity_to_sell

            # =================================================
            # CONSUME BATCHES
            # =================================================

            for batch in batches:

                if remaining_quantity <= 0:
                    break

                quantity_from_batch = min(
                    remaining_quantity,
                    batch.quantity_remaining
                )

                # ------------------------------------------------
                # RECORD BATCH ALLOCATION
                # ------------------------------------------------

                SaleItemBatch.objects.create(

                    sale_item=sale_item,

                    batch=batch,

                    quantity=quantity_from_batch,

                    unit_cost=batch.unit_cost,

                    total_cost=(
                        batch.unit_cost *
                        quantity_from_batch
                    ),
                )

                # ------------------------------------------------
                # REDUCE BATCH STOCK
                # ------------------------------------------------

                batch.quantity_remaining -= (
                    quantity_from_batch
                )

                batch.save(
                    update_fields=[
                        'quantity_remaining'
                    ]
                )

                remaining_quantity -= (
                    quantity_from_batch
                )

            # =================================================
            # SAFETY CHECK
            # =================================================

            if remaining_quantity > 0:

                raise serializers.ValidationError(
                    f'Not enough available non-expired '
                    f'batch stock for {medication.name}.'
                )

            # =================================================
            # REDUCE MEDICATION TOTAL STOCK
            # =================================================

            medication.stock_quantity -= (
                quantity_to_sell
            )

            medication.save(
                update_fields=[
                    'stock_quantity'
                ]
            )

        return sale

    # ========================================================
    # RESPONSE HELPERS
    # ========================================================

    def get_time(self, obj):

        return obj.created_at.strftime(
            '%I:%M %p'
        )

    def get_amount(self, obj):

        return f'${obj.grand_total:.2f}'



    def to_representation(self, instance):

        data = super().to_representation(
            instance
        )

        data['customer'] = (
            instance.customer_name
            or 'Walk-in Customer'
        )

        return data