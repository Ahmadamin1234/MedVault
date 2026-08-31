# accounts/permissions.py
from rest_framework.permissions import BasePermission

# 🍏 SYNCHRONIZED MATRIX: Exact structural string keys matching our React sidebar paths
ROLE_PAGE_ACCESS = {
    'Pharmacist': {'inventory', 'expiry-alerts', 'sales-billing', 'dashboard', 'reports'},
    'Technician': {'inventory', 'expiry-alerts', 'purchase-orders', 'dashboard'},
    'Billing Clerk': {'inventory', 'sales-billing', 'dashboard'},
    'Inventory Manager': {'inventory', 'suppliers', 'purchase-orders', 'expiry-alerts', 'dashboard', 'reports'},
}


class RolePagePermission(BasePermission):
    page_name = None

    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        # Owners / Super-Admins who don't have a staff profile pass automatically
        if not hasattr(request.user, 'staff_profile'):
            return True
        staff_profile = request.user.staff_profile
        if not staff_profile.access:
            return False
        allowed_pages = ROLE_PAGE_ACCESS.get(staff_profile.role, set())
        return self.page_name in allowed_pages


class InventoryAccess(RolePagePermission):
    page_name = 'inventory'


class SupplierAccess(RolePagePermission):
    page_name = 'suppliers'


# 🍏 CORRECTED: Changed string identifier token to match frontend sidebar paths
class OrderAccess(RolePagePermission):
    page_name = 'purchase-orders'


# 🍏 CORRECTED: Changed string identifier token to match frontend sidebar paths
class ExpiryAccess(RolePagePermission):
    page_name = 'expiry-alerts'


# 🍏 CORRECTED: Changed string identifier token to match frontend sidebar paths
class BillingAccess(RolePagePermission):
    page_name = 'sales-billing'


class AnalyticsAccess(RolePagePermission):
    page_name = 'dashboard'


# 🍏 FIXED: Added missing class structure so reports endpoint doesn't crash
class ReportsAccess(RolePagePermission):
    page_name = 'reports'


class OwnerAdminPermission(BasePermission):
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        if not request.user.is_active:
            return False
        if hasattr(request.user, 'staff_profile'):
            if not request.user.staff_profile.access:
                return False
        return not hasattr(request.user, 'staff_profile')
        # return bool(
        #     request.user
        #     and request.user.is_authenticated
        #     and not hasattr(request.user, 'staff_profile')
        # )
class OrderApprovePermission(BasePermission):
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False

        # Super admin / owner
        if not hasattr(request.user, 'staff_profile'):
            return True

        staff_profile = request.user.staff_profile

        if not staff_profile.access:
            return False

        return staff_profile.role == 'Inventory Manager'


class OrderReceivePermission(BasePermission):
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False

        # Super admin / owner
        if not hasattr(request.user, 'staff_profile'):
            return True

        staff_profile = request.user.staff_profile

        if not staff_profile.access:
            return False

        return staff_profile.role == 'Inventory Manager'
class MedicationDeletePermission(BasePermission):

    def has_permission(self, request, view):

        if not request.user or not request.user.is_authenticated:
            return False

        if not request.user.is_active:
            return False

        # Superuser / Admin
        if request.user.is_superuser:
            return True

        # Owner / Super Admin without staff profile
        if not hasattr(request.user, 'staff_profile'):
            return True

        staff_profile = request.user.staff_profile

        if not staff_profile.access:
            return False

        # Only Inventory Manager can delete medication
        return staff_profile.role == 'Inventory Manager'