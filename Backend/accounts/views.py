from django.middleware.csrf import get_token
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_protect
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.exceptions import TokenError
from rest_framework_simplejwt.tokens import RefreshToken
from .authentication import CookieJWTAuthentication
from .permissions import ROLE_PAGE_ACCESS
from .serializers import EmailOrUsernameTokenSerializer, RegisterSerializer
from staff.models import StaffMember
from django.db import transaction
from django.contrib.auth.models import Group, Permission

COOKIE_SETTINGS = {
    'httponly': True,
    'secure': False,
    'samesite': 'Lax',
}
def set_auth_cookies(response, access, refresh):
    response.set_cookie('access_token', access, max_age=900, **COOKIE_SETTINGS)
    response.set_cookie('refresh_token', refresh, max_age=604800, **COOKIE_SETTINGS)
    return response


class CsrfTokenView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        return Response({'csrfToken': get_token(request)})


class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]
    @transaction.atomic
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        role_title = 'Technician'
        group, _ = Group.objects.get_or_create(name = role_title
        )

        tech_perms = ['view_medication', 'add_medication', 'view_purchaseorder', 'add_purchaseorder']
        permission_list = Permission.objects.filter(codename__in = tech_perms)
        group.permissions.set(permission_list)
        user.groups.add(group)
        StaffMember.objects.create(
            owner=user,
            user=user,
            name=user.get_full_name() or user.username,
            role = role_title,
            email = user.email,
            phone=request.data.get("phone", "N/A"),
            access = True
        )
        refresh = RefreshToken.for_user(user)
        response = Response({
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email,
                'full_name': user.get_full_name(),
            },
        }, status=status.HTTP_201_CREATED)
        return set_auth_cookies(response, str(refresh.access_token), str(refresh))
@method_decorator(csrf_protect, name ='dispatch')
class LoginView(APIView):
    permission_classes = [permissions.AllowAny]
    def post(self, request):
        serializer = EmailOrUsernameTokenSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data
        response = Response({'user': data['user']})
        return set_auth_cookies(response, data['access'], data['refresh'])
class CurrentUserView(APIView):
    authentication_classes = [CookieJWTAuthentication]
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request):
        role = request.user.staff_profile.role if hasattr(request.user, 'staff_profile') else 'Admin'
        pages = sorted(ROLE_PAGE_ACCESS.get(role, set())) if role != 'Admin' else [
            'dashboard', 'inventory', 'purchase-orders', 'suppliers', 'expiry-alerts', 'sales-billing', 'reports', 'staff', 'settings'
        ]
        return Response({
            'id': request.user.id,
            'username': request.user.username,
            'email': request.user.email,
            'full_name': request.user.get_full_name(),
            'role': role,
            'pages': pages,
        })

@method_decorator(csrf_protect, name='dispatch')
class RefreshView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        refresh_value = request.COOKIES.get('refresh_token')
        if not refresh_value:
            return Response({'detail': 'Refresh token is missing.'}, status=401)
        try:
            refresh = RefreshToken(refresh_value)
            response = Response({'detail': 'Token refreshed.'})
            return set_auth_cookies(response, str(refresh.access_token), refresh_value)
        except TokenError:
            return Response({'detail': 'Refresh token is invalid or expired.'}, status=401)


@method_decorator(csrf_protect, name='dispatch')
class LogoutView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        response = Response({'detail': 'Logged out.'})
        response.delete_cookie('access_token', samesite='Lax')
        response.delete_cookie('refresh_token', samesite='Lax')
        return response
