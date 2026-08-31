from django.db import models

from inventory.models import Medication
from orders.models import MedicationBatch


class Sale(models.Model):

    PAYMENT_METHODS = (
        ('Cash', 'Cash'),
        ('Card', 'Card'),
        ('Insurance', 'Insurance'),
    )

    invoice_id = models.CharField(
        max_length=30,
        unique=True
    )

    customer_name = models.CharField(
        max_length=150,
        blank=True
    )

    prescription_reference = models.CharField(
        max_length=80,
        blank=True
    )

    payment_method = models.CharField(
        max_length=20,
        choices=PAYMENT_METHODS
    )

    subtotal = models.DecimalField(
        max_digits=12,
        decimal_places=2
    )

    tax = models.DecimalField(
        max_digits=12,
        decimal_places=2
    )


    grand_total = models.DecimalField(
        max_digits=12,
        decimal_places=2
    )

    amount_tendered = models.DecimalField(
        max_digits=12,
        decimal_places=2
    )

    change_due = models.DecimalField(
        max_digits=12,
        decimal_places=2
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.invoice_id


class SaleItem(models.Model):

    sale = models.ForeignKey(
        Sale,
        on_delete=models.CASCADE,
        related_name='items'
    )

    medication = models.ForeignKey(
        Medication,
        on_delete=models.PROTECT,
        related_name='sale_items'
    )

    quantity = models.PositiveIntegerField()

    unit_price = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    discount_percent = models.DecimalField(
        max_digits=5,
        decimal_places=2,
        default=0
    )

    line_total = models.DecimalField(
        max_digits=12,
        decimal_places=2
    )


class SaleItemBatch(models.Model):

    sale_item = models.ForeignKey(
        SaleItem,
        on_delete=models.CASCADE,
        related_name='batch_allocations'
    )

    batch = models.ForeignKey(
        MedicationBatch,
        on_delete=models.PROTECT,
        related_name='sale_allocations'
    )

    quantity = models.PositiveIntegerField()

    unit_cost = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    total_cost = models.DecimalField(
        max_digits=12,
        decimal_places=2
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return (
            f'{self.sale_item.medication.name} - '
            f'{self.batch.batch_number} - '
            f'{self.quantity} units'
        )