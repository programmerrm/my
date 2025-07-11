from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.core.exceptions import ObjectDoesNotExist

class SubscriptionView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        try:
            subscription = user.subscription
        except ObjectDoesNotExist:
            return Response({
                'success': False,
                "message": "No active subscription found."
            }, status=200)

        if subscription.is_expired():
            return Response({
                'success': False,
                "message": "Your subscription has expired."
            }, status=200)

        return Response({
            'success': True,
            "status": subscription.status,
            "next_billing_date": subscription.next_billing_date,
            "is_recurring": subscription.is_recurring,
            "stripe_subscription_id": subscription.stripe_subscription_id,
            "stripe_customer_id": subscription.stripe_customer_id
        })
    