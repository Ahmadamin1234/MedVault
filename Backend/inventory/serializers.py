from decimal import Decimal

from rest_framework import serializers

from .models import Medication


class MedicationSerializer(serializers.ModelSerializer):

    generic = serializers.CharField(
        source='generic_name'
    )

    stock = serializers.IntegerField(
        source='stock_quantity',
        read_only=True
    )

    reorder = serializers.IntegerField(
        source='reorder_level'
    )

    price = serializers.DecimalField(
        source='sale_price',
        max_digits=10,
        decimal_places=2,
        min_value=Decimal('0.01')
    )

    status = serializers.SerializerMethodField()

    class Meta:
        model = Medication

        fields = [
            'id',
            'name',
            'generic',
            'sku',
            'category',
            'stock',
            'reorder',
            'price',
            'status',
            'ndc',
            'form_type',
            'shelf_location',
            'manufacturer',
            'clinical_notes',
        ]

        read_only_fields = [
            'id',
            'stock',
            'status',
        ]

    def get_status(self, obj):

        if obj.stock_quantity == 0:
            return 'OUT OF STOCK'

        if obj.stock_quantity <= obj.reorder_level:
            return 'LOW STOCK'

        return 'IN STOCK'