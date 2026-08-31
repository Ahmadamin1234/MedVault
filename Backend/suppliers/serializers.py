from rest_framework import serializers

from .models import Supplier


class SupplierSerializer(serializers.ModelSerializer):

    rep = serializers.CharField(
        source='representative_name',
        read_only=True
    )

    totalDrugs = serializers.SerializerMethodField()

    lastShipment = serializers.SerializerMethodField()

    statusColor = serializers.SerializerMethodField()

    contact = serializers.SerializerMethodField()

    terms = serializers.SerializerMethodField()

    performance = serializers.SerializerMethodField()

    class Meta:
        model = Supplier

        fields = [
            'id',
            'name',
            'rep',
            'totalDrugs',
            'lastShipment',
            'statusColor',
            'rating',
            'contact',
            'terms',
            'performance',

            'representative_name',
            'representative_role',
            'phone',
            'email',
            'payment_terms',
            'lead_time',
            'tier',
        ]

        read_only_fields = [
            'id',
            'rep',
            'totalDrugs',
            'lastShipment',
            'statusColor',
            'contact',
            'terms',
            'performance',
        ]

    def get_totalDrugs(self, obj):

        # Batch relationship will be added later.
        # Until then, return 0.

        return '0 items'

    def get_lastShipment(self, obj):

        if obj.last_shipment_date:
            return obj.last_shipment_date.isoformat()

        return 'No shipments yet'

    def get_statusColor(self, obj):

        return 'bg-teal-500'

    def get_contact(self, obj):

        return {
            'name': obj.representative_name,
            'role': obj.representative_role,
            'phone': obj.phone,
            'email': obj.email,
        }

    def get_terms(self, obj):

        return {
            'window': obj.payment_terms,
            'leadTime': obj.lead_time,
        }

    def get_performance(self, obj):

        return {
            'deliveryRate': 'Not rated',
            'accuracyRate': 'Not rated',
        }

    def validate_rating(self, value):

        if value < 0 or value > 5:
            raise serializers.ValidationError(
                'Rating must be between 0 and 5.'
            )

        return value