from django.urls import path

from .views import StaffListCreateView,StaffDetailUpdateDeleteView

urlpatterns = [
    path('', StaffListCreateView.as_view(), name='staff-list-create'),
    path('<int:id>/', StaffDetailUpdateDeleteView.as_view(), name= 'staff-detail-update-delete')
]
