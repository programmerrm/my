from django.urls import path
from api.payments.views.payment import CreateStripeCheckoutSession
from api.payments.views.payment import Subscription
from payments.services.webhooks import stripe_webhook

urlpatterns = [
    path('subscription/', Subscription.as_view(), name='subscription'),
    path('create-checkout-session/', CreateStripeCheckoutSession.as_view(), name='create-checkout'),
    path('stripe/webhook/', stripe_webhook, name='stripe-webhook'),
]
