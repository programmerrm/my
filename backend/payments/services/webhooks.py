import stripe
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse, HttpResponse
from payments.models import Payment, Subscription
from django.contrib.auth import get_user_model
import logging

logger = logging.getLogger(__name__)
User = get_user_model()
stripe.api_key = settings.STRIPE_SECRET_KEY

@csrf_exempt
def stripe_webhook(request):
    payload = request.body
    sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')
    endpoint_secret = settings.STRIPE_WEBHOOK_SECRET

    if not sig_header:
        logger.warning("Missing Stripe signature header")
        return HttpResponse(status=400)

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, endpoint_secret
        )
    except ValueError:
        logger.error("Invalid payload")
        return HttpResponse(status=400)
    except stripe.error.SignatureVerificationError:
        logger.error("Invalid Stripe signature")
        return HttpResponse(status=400)

    logger.info(f"Received event type: {event['type']}")

    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        user_id = session.get('metadata', {}).get('user_id')
        customer_id = session.get('customer')
        subscription_id = session.get('subscription')
        payment_intent_id = session.get('payment_intent')

        if not user_id:
            logger.error("User ID missing in metadata")
            return JsonResponse({'error': 'User ID missing'}, status=400)

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            logger.error(f"User not found: {user_id}")
            return JsonResponse({'error': 'User not found'}, status=400)

        if Payment.objects.filter(stripe_payment_intent=payment_intent_id).exists():
            logger.info("Payment already processed")
            return HttpResponse(status=200)

        try:
            payment_intent = stripe.PaymentIntent.retrieve(payment_intent_id)
            amount = payment_intent['amount_received'] / 100
            currency = payment_intent['currency'].upper()
        except Exception as e:
            logger.warning(f"Could not retrieve PaymentIntent: {e}")
            amount = 0
            currency = 'USD'

        Payment.objects.create(
            user=user,
            amount=amount,
            currency=currency,
            status='completed',
            stripe_payment_intent=payment_intent_id
        )

        subscription, _ = Subscription.objects.get_or_create(user=user)
        subscription.activate(
            stripe_subscription_id=subscription_id,
            stripe_customer_id=customer_id
        )

        logger.info(f"Subscription activated for user {user.username}")

    return HttpResponse(status=200)
