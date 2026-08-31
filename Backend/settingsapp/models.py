from django.conf import settings
from django.db import models


class PharmacySettings(models.Model):
    owner = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='pharmacy_settings')
    store_name = models.CharField(max_length=150, default='MedVault Main Dispensary')
    timezone = models.CharField(max_length=100, default='Eastern Standard Time (EST / GMT-5)')
    license_number = models.CharField(max_length=100, default='')
    currency = models.CharField(max_length=80, default='USD ($) - US Dollars')
    phone = models.CharField(max_length=30, default='')
    address = models.CharField(max_length=255, default='')
    low_stock_threshold = models.PositiveIntegerField(default=30)
    auto_reorder = models.BooleanField(default=True)
    critical_low_alert = models.BooleanField(default=True)
    batch_expiry_warning = models.BooleanField(default=True)
    daily_sales_pdf = models.BooleanField(default=False)
    store_info = models.JSONField(default=dict, blank=True)
    tax_pricing = models.JSONField(default=dict, blank=True)
    notifications = models.JSONField(default=dict, blank=True)
    backup_data = models.JSONField(default=dict, blank=True)
    security = models.JSONField(default=dict, blank=True)
    integrations = models.JSONField(default=dict, blank=True)

    def __str__(self):
        return self.store_name
