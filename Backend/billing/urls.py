from django.urls import path

from .views import SaleListCreateView

urlpatterns = [
    path('', SaleListCreateView.as_view(), name='sale-list-create'),
]
