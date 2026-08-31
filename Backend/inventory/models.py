from django.conf import settings
from django.db import models

class Medication(models.Model):
    FORM_TYPES = (
        ('Tablet', 'Tablet'),
        ('Capsule', 'Capsule'),
        ('Liquid', 'Liquid'),
        ('Injection', 'Injection'),
    )

    name = models.CharField(max_length=150)
    generic_name = models.CharField(max_length=150)
    sku = models.CharField(max_length=50)
    sale_price = models.DecimalField(max_digits=10, decimal_places=2)
    stock_quantity = models.PositiveIntegerField(default=0)
    ndc = models.CharField(max_length=50)
    category = models.CharField(max_length=80)
    form_type = models.CharField(max_length=20, choices=FORM_TYPES)
    reorder_level = models.PositiveIntegerField(default=0)
    shelf_location = models.CharField(max_length=100, blank=True)
    manufacturer = models.CharField(max_length=150)
    clinical_notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['name']
        constraints = [
            models.UniqueConstraint(fields=['sku'], name='unique_medication_sku'),
        ]

    def __str__(self):
        return f'{self.name} ({self.sku})'
