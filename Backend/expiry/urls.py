from django.urls import path

from .views import ExpiryActionView, ExpiryAlertView

urlpatterns = [
    path('', ExpiryAlertView.as_view(), name='expiry-alerts'),
    path('<int:batch_id>/action/', ExpiryActionView.as_view(), name='expiry-action'),
]
