from rest_framework import serializers

from .models import PharmacySettings


class PharmacySettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = PharmacySettings
        exclude = ['id', 'owner']

    def to_representation(self, instance):
        return {
            'general': {
                'storeName': instance.store_name,
                'timezone': instance.timezone,
                'licenseNumber': instance.license_number,
                'currency': instance.currency,
                'phone': instance.phone,
                'address': instance.address,
            },
            'thresholds': {
                'lowStockThreshold': instance.low_stock_threshold,
                'autoReorder': instance.auto_reorder,
            },
            'channels': {
                'criticalLowAlert': instance.critical_low_alert,
                'batchExpiryWarning': instance.batch_expiry_warning,
                'dailySalesPdf': instance.daily_sales_pdf,
            },
            'sections': {
                'storeInfo': instance.store_info,
                'taxPricing': instance.tax_pricing,
                'notifications': instance.notifications,
                'backupData': instance.backup_data,
                'security': instance.security,
                'integrations': instance.integrations,
            },
        }
