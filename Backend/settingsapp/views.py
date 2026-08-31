from rest_framework import generics
from rest_framework.response import Response
from accounts.permissions import OwnerAdminPermission

from .models import PharmacySettings
from .serializers import PharmacySettingsSerializer


class PharmacySettingsView(generics.RetrieveUpdateAPIView):
    serializer_class = PharmacySettingsSerializer
    permission_classes = [OwnerAdminPermission]

    def get_object(self):
        settings, _ = PharmacySettings.objects.get_or_create(owner=self.request.user)
        return settings

    def update(self, request, *args, **kwargs):
        payload = request.data
        flat = {
            'store_name': payload.get('general', {}).get('storeName', payload.get('store_name')),
            'timezone': payload.get('general', {}).get('timezone', payload.get('timezone')),
            'license_number': payload.get('general', {}).get('licenseNumber', payload.get('license_number')),
            'currency': payload.get('general', {}).get('currency', payload.get('currency')),
            'phone': payload.get('general', {}).get('phone', payload.get('phone')),
            'address': payload.get('general', {}).get('address', payload.get('address')),
            'low_stock_threshold': payload.get('thresholds', {}).get('lowStockThreshold', payload.get('low_stock_threshold')),
            'auto_reorder': payload.get('thresholds', {}).get('autoReorder', payload.get('auto_reorder')),
            'critical_low_alert': payload.get('channels', {}).get('criticalLowAlert', payload.get('critical_low_alert')),
            'batch_expiry_warning': payload.get('channels', {}).get('batchExpiryWarning', payload.get('batch_expiry_warning')),
            'daily_sales_pdf': payload.get('channels', {}).get('dailySalesPdf', payload.get('daily_sales_pdf')),
        }
        sections = payload.get('sections', {})
        flat.update({
            'store_info': sections.get('storeInfo', payload.get('store_info')),
            'tax_pricing': sections.get('taxPricing', payload.get('tax_pricing')),
            'notifications': sections.get('notifications', payload.get('notifications')),
            'backup_data': sections.get('backupData', payload.get('backup_data')),
            'security': sections.get('security', payload.get('security')),
            'integrations': sections.get('integrations', payload.get('integrations')),
        })
        flat = {key: value for key, value in flat.items() if value is not None}
        serializer = self.get_serializer(self.get_object(), data=flat, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(self.get_serializer(serializer.instance).data)
