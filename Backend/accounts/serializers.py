from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.db import transaction
from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken

from .models import UserProfile


class RegisterSerializer(serializers.Serializer):
    full_name = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    phone_number = serializers.CharField(max_length=30)
    pharmacy_name = serializers.CharField(max_length=150)
    password = serializers.CharField(write_only=True, min_length=8)
    confirm_password = serializers.CharField(write_only=True)
    agreed_to_terms = serializers.BooleanField()

    def validate(self, attrs):
        if attrs['password'] != attrs['confirm_password']:
            raise serializers.ValidationError({'confirm_password': 'Passwords do not match.'})
        if not attrs['agreed_to_terms']:
            raise serializers.ValidationError({'agreed_to_terms': 'You must accept the terms.'})
        if User.objects.filter(email__iexact=attrs['email']).exists():
            raise serializers.ValidationError({'email': 'An account with this email already exists.'})
        return attrs

    @transaction.atomic
    def create(self, validated_data):
        full_name = validated_data.pop('full_name')
        email = validated_data.pop('email').lower()
        phone_number = validated_data.pop('phone_number')
        pharmacy_name = validated_data.pop('pharmacy_name')
        validated_data.pop('confirm_password')
        validated_data.pop('agreed_to_terms')

        base_username = email.split('@')[0]
        username = base_username
        suffix = 1
        while User.objects.filter(username=username).exists():
            username = f'{base_username}{suffix}'
            suffix += 1

        first_name, _, last_name = full_name.partition(' ')
        user = User.objects.create_user(
            username=username,
            email=email,
            first_name=first_name,
            last_name=last_name,
            password=validated_data['password'],
        )
        UserProfile.objects.create(
            user=user,
            phone_number=phone_number,
            pharmacy_name=pharmacy_name,
        )
        return user


class EmailOrUsernameTokenSerializer(serializers.Serializer):
    username_or_email = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        identifier = attrs['username_or_email']
        user = User.objects.filter(email__iexact=identifier).first()
        username = user.username if user else identifier
        user = authenticate(username=username, password=attrs['password'])
        if user is None or not user.is_active:
            raise serializers.ValidationError('No active account found with the given credentials.')
        refresh = RefreshToken.for_user(user)
        return {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'full_name': user.get_full_name(),
            },
        }
