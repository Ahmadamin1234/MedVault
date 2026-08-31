from django.conf import settings
from django.db import models

from inventory.models import Medication
from suppliers.models import Supplier


class PurchaseOrder(models.Model):

    STATUS_CHOICES = (
        ('PENDING', 'PENDING'),
        ('APPROVED', 'APPROVED'),
        ('RECEIVED', 'RECEIVED'),
        ('CANCELLED', 'CANCELLED'),
    )

    supplier = models.ForeignKey(
        Supplier,
        on_delete=models.PROTECT,
        related_name='purchase_orders'
    )

    po_number = models.CharField(
        max_length=30,
        unique=True
    )

    order_date = models.DateField(
        auto_now_add=True
    )

    expected_delivery_date = models.DateField()

    payment_terms = models.CharField(
        max_length=80
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default='PENDING'
    )

    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name='created_purchase_orders'
    )

    approved_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name='approved_purchase_orders',
        null=True,
        blank=True
    )

    received_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name='received_purchase_orders',
        null=True,
        blank=True
    )

    approved_at = models.DateTimeField(
        null=True,
        blank=True
    )

    received_at = models.DateTimeField(
        null=True,
        blank=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.po_number


class PurchaseOrderItem(models.Model):

    purchase_order = models.ForeignKey(
        PurchaseOrder,
        on_delete=models.CASCADE,
        related_name='items'
    )

    medication = models.ForeignKey(
        Medication,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='purchase_order_items'
    )

    medication_name = models.CharField(
        max_length=150
    )

    quantity = models.PositiveIntegerField()

    unit_cost = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    expiry_date = models.DateField(
        null=True,
        blank=True
    )

    @property
    def total_cost(self):
        return self.quantity * self.unit_cost

    def __str__(self):
        return (
            f'{self.medication_name} - '
            f'{self.purchase_order.po_number}'
        )


class MedicationBatch(models.Model):

    medication = models.ForeignKey(
        Medication,
        on_delete=models.PROTECT,
        related_name='batches'
    )

    supplier = models.ForeignKey(
        Supplier,
        on_delete=models.PROTECT,
        related_name='medication_batches'
    )

    purchase_order_item = models.OneToOneField(
        PurchaseOrderItem,
        on_delete=models.PROTECT,
        related_name='batch'
    )

    batch_number = models.CharField(
        max_length=100,
        unique=True
    )

    quantity_received = models.PositiveIntegerField()

    quantity_remaining = models.PositiveIntegerField()

    unit_cost = models.DecimalField(
        max_digits=10,
        decimal_places=2
    )

    expiry_date = models.DateField()

    received_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        ordering = [
            'expiry_date',
            'received_at'
        ]

    def __str__(self):
        return (
            f'{self.medication.name} - '
            f'{self.batch_number}'
        )

    @property
    def remaining_value(self):
        return self.quantity_remaining * self.unit_cost