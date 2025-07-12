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
            }, status=404)

        if subscription.is_expired():
            if subscription.status != 'expired':
                subscription.status = 'expired'
                subscription.save()
                
            return Response({
                'success': False,
                "message": "Your subscription has expired."
            }, status=403)

        return Response({
            'success': True,
            "status": subscription.status,
            "next_billing_date": subscription.next_billing_date.isoformat() if subscription.next_billing_date else None,
            "is_recurring": subscription.is_recurring,
            "stripe_subscription_id": subscription.stripe_subscription_id,
            "stripe_customer_id": subscription.stripe_customer_id,
            "subscription_type": subscription.subscription_type,
        }, status=200)
