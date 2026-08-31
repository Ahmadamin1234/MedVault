from django.urls import path

from .views import PurchaseOrderListCreateView, PurchaseOrderSummaryView, PurchaseOrderApproveView, PurchaseOrderReceiveView,PurchaseOrderCancelView

urlpatterns = [
    path('', PurchaseOrderListCreateView.as_view(), name='purchase-order-list-create'),
    path('summary/', PurchaseOrderSummaryView.as_view(), name='purchase-order-summary'),
    path(
        '<int:pk>/approve/',
        PurchaseOrderApproveView.as_view(),
        name='purchase-order-approve'
    ),
    path(
        '<int:pk>/receive/',
        PurchaseOrderReceiveView.as_view(),
        name='purchase-order-receive'
    ),

  path(
        '<int:pk>/cancel/',
        PurchaseOrderCancelView.as_view(),
        name='purchase-order-cancel'
    ),
]
