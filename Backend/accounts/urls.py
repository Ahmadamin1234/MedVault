from django.urls import path
from .views import CurrentUserView, CsrfTokenView, LoginView, LogoutView, RefreshView, RegisterView

urlpatterns = [
    path('csrf/', CsrfTokenView.as_view(), name='csrf-token'),
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('me/', CurrentUserView.as_view(), name='current-user'),
    path('refresh/', RefreshView.as_view(), name='token-refresh'),
    path('logout/', LogoutView.as_view(), name='logout'),
]
