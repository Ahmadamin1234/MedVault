from django.conf import settings
from django.db import models


class StaffMember(models.Model):
    ROLE_CHOICES = (
        ('Pharmacist', 'Pharmacist'),
        ('Technician', 'Technician'),
        ('Billing Clerk', 'Billing Clerk'),
        ('Inventory Manager', 'Inventory Manager'),
    )

    owner = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='staff_members')
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='staff_profile', null=True, blank=True)
    name = models.CharField(max_length=150)
    role = models.CharField(max_length=40, choices=ROLE_CHOICES)
    email = models.EmailField()
    phone = models.CharField(max_length=30)
    access = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['name']
        constraints = [
            models.UniqueConstraint(fields=['owner', 'email'], name='unique_staff_email_per_owner'),
        ]
