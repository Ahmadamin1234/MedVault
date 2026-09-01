from django.contrib.auth import get_user_model
from rest_framework import generics, status
from rest_framework.exceptions import PermissionDenied, ValidationError
from rest_framework.response import Response

from accounts.permissions import OwnerAdminPermission

from .models import StaffMember
from .serializers import StaffMemberSerializer


User = get_user_model()


class StaffListCreateView(generics.ListCreateAPIView):

    serializer_class = StaffMemberSerializer
    permission_classes = [OwnerAdminPermission]

    def get_queryset(self):
        return StaffMember.objects.filter(
            owner=self.request.user
        )

    def list(self, request, *args, **kwargs):

        queryset = self.get_queryset()

        serializer = self.get_serializer(
            queryset,
            many=True
        )

        logs = []

        for index, member in enumerate(
            queryset.order_by('-created_at')[:10]
        ):

            logs.append({
                "id": f"log-init-{member.id}-{index}",
                "text": (
                    f"System registered profile for "
                    f"{member.name} as a designated "
                    f"{member.role}."
                ),
                "time": member.created_at.strftime(
                    "%I:%M %p · %d %b %Y"
                )
            })

        if not logs:
            logs.append({
                "id": "log-default",
                "text": (
                    "Administrative access credentials "
                    "vault initialized."
                ),
                "time": "System Standard Time"
            })

        return Response({
            "staff": serializer.data,
            "logs": logs
        })


class StaffDetailUpdateDeleteView(
    generics.RetrieveUpdateDestroyAPIView
):

    serializer_class = StaffMemberSerializer
    permission_classes = [OwnerAdminPermission]
    lookup_field = 'id'

    def get_queryset(self):

        return StaffMember.objects.filter(
            owner=self.request.user
        )

    def perform_update(self, serializer):

        instance = self.get_object()

        if instance.user == self.request.user:
            raise ValidationError(
                "You cannot change your own administrative role."
            )

        updated_instance = serializer.save()

        user_account = updated_instance.user

        if user_account:

            from django.contrib.auth.models import Group

            user_account.groups.clear()

            group, _ = Group.objects.get_or_create(
                name=updated_instance.role
            )

            user_account.groups.add(group)

    def destroy(self, request, *args, **kwargs):

        instance = self.get_object()

        if instance.user == request.user:
            raise PermissionDenied(
                "You cannot delete your own administrative account."
            )

        user_account = instance.user

        self.perform_destroy(instance)

        if user_account:
            user_account.delete()

        return Response(
            status=status.HTTP_204_NO_CONTENT
        )