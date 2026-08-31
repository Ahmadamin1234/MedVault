from rest_framework import generics, status
from accounts.permissions import OwnerAdminPermission
from rest_framework.response import Response
from .models import StaffMember
from .serializers import StaffMemberSerializer
from rest_framework.exceptions import PermissionDenied, ValidationError


class StaffListCreateView(generics.ListCreateAPIView):
    serializer_class = StaffMemberSerializer
    permission_classes = [OwnerAdminPermission]

    def get_queryset(self):
        return StaffMember.objects.filter(owner=self.request.user)

    def perform_create(self, serializer):
        serializer.save()

    def list(self,request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        logs = []
        for index, member in enumerate(queryset.order_by('-created_at')[:10]):
            logs.append({
                "id": f"log-init-{member.id}-{index}",
                "text": f"System registered profile for {member.name} as a designated {member.role}.",
                "time": member.created_at.strftime("%I:%M %p · %d %b %Y")
            })

        # If no staff exists yet, provide an anchor system log
        if not logs:
            logs.append({
                "id": "log-default",
                "text": "Administrative access credentials vault initialized.",
                "time": "System Standard Time"
            })

        # 3. Return a unified payload structure matching frontend expectations
        return Response({
            "staff": serializer.data,
            "logs": logs
        })
class StaffDetailUpdateDeleteView(generics.RetrieveUpdateDestroyAPIView):
    """
    Handles secure detail actions for /api/staff/<id>/.
    Only Clinic Owners/Admins pass OwnerAdminPermission.
    """
    serializer_class = StaffMemberSerializer
    permission_classes = [OwnerAdminPermission]
    lookup_field = 'id'

    def get_queryset(self):
        # Strict context filtering layout
        return StaffMember.objects.filter(owner=self.request.user)

    def perform_update(self, serializer):
        # Safety rule check: Protect against changing your own roles/permissions
        instance = self.get_object()
        if instance.user == self.request.user:
            raise ValidationError("Security violation: Master administrative accounts cannot shift their own roles.")
        
        updated_instance = serializer.save()
        
        # Sync Django groups dynamically if the role string changes
        user_account = updated_instance.user
        if user_account:
            from django.contrib.auth.models import Group
            user_account.groups.clear()
            group, _ = Group.objects.get_or_create(name=updated_instance.role)
            user_account.groups.add(group)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        
        # Safety rule check: Prevent self-deletion
        if instance.user == request.user:
            raise PermissionDenied("Administrative self-destruction blocked. Master accounts cannot be wiped.")
        
        user_account = instance.user
        response = super().destroy(request, *args, **kwargs)
        if user_account:
            user_account.delete()
            
        return response