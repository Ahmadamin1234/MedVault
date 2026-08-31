from django.conf import settings
from django.db import models


class Supplier(models.Model):
    TIER_CHOICES = (
        ('TIER-1 PREFERRED', 'TIER-1 PREFERRED'),
        ('TIER-2 STANDARD', 'TIER-2 STANDARD'),
        ('TIER-3 BACKUP', 'TIER-3 BACKUP'),
    )
    name = models.CharField(max_length=150, unique=True)
    representative_name = models.CharField(max_length=150)
    representative_role = models.CharField(max_length=150)
    phone = models.CharField(max_length=30)
    email = models.EmailField()
    payment_terms = models.CharField(max_length=80)
    lead_time = models.CharField(max_length=80)
    tier = models.CharField(max_length=30, choices=TIER_CHOICES, default='TIER-2 STANDARD')
    rating = models.PositiveSmallIntegerField(default=0)
    last_shipment_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['name']

    def __str__(self):
        return self.name
