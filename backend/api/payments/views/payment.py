import stripe
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

stripe.api_key = settings.STRIPE_SECRET_KEY

class CreateCryptoStripeCheckoutSession(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        checkout_session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[
                {
                    'price_data': {
                        'currency': 'usd',
                        'unit_amount': 1000,
                        'product_data': {
                            'name': 'Crypto Lifetime Access',
                        },
                    },
                    'quantity': 1,
                },
            ],
            mode='payment',
            success_url=f"{settings.FRONTEND_DOMAIN}/payment/success/",
            cancel_url=f"{settings.FRONTEND_DOMAIN}/payment/cancel/",
            customer_email=request.user.email,
            metadata={
                "user_id": request.user.id,
                "type": "lifetime",
                "subscription_type": "crypto"
            }
        )
        return Response({'url': checkout_session.url})

class CreateEcommerceStripeCheckoutSession(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        checkout_session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=[
                {
                    'price_data': {
                        'currency': 'usd',
                        'unit_amount': 1000,
                        'recurring': {
                            'interval': 'month'
                        },
                        'product_data': {
                            'name': 'E-commerce Monthly Access',
                        },
                    },
                    'quantity': 1,
                },
            ],
            mode='subscription',
            success_url=f"{settings.FRONTEND_DOMAIN}/payment/success/",
            cancel_url=f"{settings.FRONTEND_DOMAIN}/payment/cancel/",
            customer_email=request.user.email,
            metadata={
                "user_id": request.user.id,
                "type": "recurring",
                "subscription_type": "e-commerce"
            }
        )
        return Response({'url': checkout_session.url})
