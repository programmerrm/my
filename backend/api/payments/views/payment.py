import stripe
from django.conf import settings
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.core.exceptions import ObjectDoesNotExist

class Payment(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        try:
            subscription = user.subscription
        except ObjectDoesNotExist:
            return Response({"error": "No active subscription found."}, status=404)

        if subscription.is_expired():
            return Response({"error": "Your subscription has expired."}, status=400)

        return Response({
            "status": subscription.status,
            "next_billing_date": subscription.next_billing_date,
            "is_recurring": subscription.is_recurring,
            "stripe_subscription_id": subscription.stripe_subscription_id,
            "stripe_customer_id": subscription.stripe_customer_id
        })

stripe.api_key = settings.STRIPE_SECRET_KEY

class CreateStripeCheckoutSession(APIView):
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
                            'name': 'Monthly Crypto Subscription',
                        },
                    },
                    'quantity': 1,
                },
            ],
            mode='subscription',
            success_url=f"{settings.YOUR_FRONTEND_DOMAIN}/",
            cancel_url=f"{settings.YOUR_FRONTEND_DOMAIN}/payment/cancel/",
            customer_email=request.user.email,
            metadata={
                "user_id": request.user.id
            }
        )

        return Response({'url': checkout_session.url})
