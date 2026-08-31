import secrets
import string

from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group, Permission
from django.core.mail import send_mail
from django.db import transaction
from rest_framework import serializers

from .models import StaffMember

User = get_user_model()

ROLE_PERMISSIONS = {
    'Pharmacist': ['view_medication', 'add_medication', 'view_sale', 'add_sale'],
    'Technician': ['view_medication', 'add_medication', 'view_purchaseorder', 'add_purchaseorder'],
    'Billing Clerk': ['view_medication', 'view_sale', 'add_sale'],
    'Inventory Manager': ['view_medication', 'add_medication', 'change_medication', 'view_purchaseorder', 'add_purchaseorder'],
}


class StaffMemberSerializer(serializers.ModelSerializer):
    lastActive = serializers.SerializerMethodField()
    credentialsSent = serializers.BooleanField(read_only=True, default=False)

    class Meta:
        model = StaffMember
        fields = ['id', 'name', 'role', 'email', 'phone', 'access', 'lastActive', 'credentialsSent']
        read_only_fields = ['id', 'lastActive', 'credentialsSent']

    def validate_email(self, value):
        owner = self.context['request'].user
        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError('An account with this email already exists.')
        if StaffMember.objects.filter(owner=owner, email__iexact=value).exists():
            raise serializers.ValidationError('This staff member is already invited.')
        return value.lower()

    @transaction.atomic
    def create(self, validated_data):
        owner = self.context['request'].user
        name = validated_data['name']
        email = validated_data['email']
        username_base = email.split('@')[0]
        username = username_base
        suffix = 1
        while User.objects.filter(username=username).exists():
            username = f'{username_base}{suffix}'
            suffix += 1

        lower = string.ascii_lowercase
        upper = string.ascii_uppercase
        digits = string.digits
        symbol = "@#$&!?"
        password_pool = (
            [secrets.choice(lower) for _ in range(3)]+
            [secrets.choice(upper) for _ in range(3)]+
            [secrets.choice(digits) for _ in range(3)]+
            [secrets.choice(symbol) for _ in range(3)]

        )
        secrets.SystemRandom().shuffle(password_pool)
        generated_strong_password = ''.join(password_pool)

        first_name, _, last_name = name.partition(' ')
        user = User.objects.create_user(
            username=username,
            email=email,
            first_name=first_name,
            last_name=last_name,
            password=generated_strong_password,
        )
        role = validated_data['role']
        group, _ = Group.objects.get_or_create(name=role)
        permission_names = ROLE_PERMISSIONS.get(role, [])
        permissions = Permission.objects.filter(codename__in=permission_names)
        group.permissions.set(permissions)
        user.groups.add(group)
        staff = StaffMember.objects.create(owner=owner, user=user, **validated_data)
        WEBSITE_LOGIN_URL = "http://localhost:5173/login" 
        send_mail(
            subject='Security Credentials Activation - MedVault',
            message=(
                f'Hello {name},\n\n'
                f'An administrative staff account has been securely generated for you at MedVault.\n\n'
                f'----------------------------------------\n'
                f'DESIGNATED ROLE : {role}\n'
                f'UNIQUE USERNAME : {username}\n'
                f'SECURE PASSWORD  : {generated_strong_password}\n'
                f'----------------------------------------\n\n'
                f'ACCESS LINK:\n'
                f'Click here to log into your workspace: {WEBSITE_LOGIN_URL}\n\n' 
                'Please sign in to your workspace dashboard using these credentials. '
                'For structural integrity, go directly to your Settings panel to update this security key immediately.'
            ),
            from_email=None,
            recipient_list=[email],
            fail_silently=False,
        )
        staff.credentialsSent = True
        return staff

    def get_lastActive(self, obj):
        return obj.created_at.strftime('%Y-%m-%d')
