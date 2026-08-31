from django.conf import settings
from django.db import models

from orders.models import MedicationBatch


class ExpiryResolution(models.Model):

    ACTIONS = (
        ('DISPOSE', 'DISPOSE'),
        ('RETURN', 'RETURN'),
        ('TRANSFER', 'TRANSFER'),
        ('CLEARANCE', 'CLEARANCE'),
    )

    batch = models.ForeignKey(
        MedicationBatch,
        on_delete=models.PROTECT,
        related_name='expiry_resolutions'
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.PROTECT,
        related_name='expiry_resolutions'
    )

    action = models.CharField(
        max_length=20,
        choices=ACTIONS
    )

    quantity = models.PositiveIntegerField()

    value = models.DecimalField(
        max_digits=12,
        decimal_places=2
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return (
            f'{self.batch.batch_number} - '
            f'{self.action}'
        )