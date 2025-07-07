from django.urls import path
from api.accounts.views.login import LoginView
from api.accounts.views.register import RegisterViewSet

urlpatterns = [
    path(
        'user/login/',
        LoginView.as_view(),
        name='login',
    ),
    path(
        'user/register/',
        RegisterViewSet.as_view({ 'post': 'create' }),
        name='register',
    ),
]
