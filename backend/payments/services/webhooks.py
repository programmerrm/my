import stripe
import logging
from django.conf import settings
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
from payments.models import Payment, Subscription
from accounts.models import User

logger = logging.getLogger(__name__)
stripe.api_key = settings.STRIPE_SECRET_KEY

@csrf_exempt
def stripe_webhook(request):
    if request.method != 'POST':
        return HttpResponse(status=405)

    payload = request.body
    sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')
    endpoint_secret = settings.STRIPE_WEBHOOK_SECRET

    if not sig_header:
        logger.warning("❌ Missing Stripe signature header")
        return HttpResponse("Signature missing", status=400)

    try:
        event = stripe.Webhook.construct_event(payload, sig_header, endpoint_secret)
    except ValueError as e:
        logger.error(f"❌ Invalid payload: {e}")
        return HttpResponse("Invalid payload", status=400)
    except stripe.error.SignatureVerificationError as e:
        logger.error(f"❌ Invalid signature: {e}")
        return HttpResponse("Invalid signature", status=400)

    logger.info(f"✅ Stripe Event Received: {event['type']}")

    # Handle Checkout Session Completed (one-time or first-time subscription)
    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        metadata = session.get('metadata', {})
        user_id = metadata.get('user_id')
        payment_type = metadata.get('type')
        customer_id = session.get('customer')
        subscription_id = session.get('subscription')
        payment_intent_id = session.get('payment_intent')

        if not user_id:
            logger.error("❌ User ID not found in metadata")
            return JsonResponse({'error': 'User ID missing'}, status=400)

        try:
            user = User.objects.get(id=user_id)
        except User.DoesNotExist:
            logger.error(f"❌ User not found: {user_id}")
            return JsonResponse({'error': 'User not found'}, status=404)

        if Payment.objects.filter(stripe_payment_intent=payment_intent_id).exists():
            logger.info(f"ℹ️ Payment already exists for intent: {payment_intent_id}")
            return HttpResponse(status=200)

        # Try to retrieve amount and currency from PaymentIntent
        try:
            if payment_intent_id:
                payment_intent = stripe.PaymentIntent.retrieve(payment_intent_id)
                amount = payment_intent['amount_received'] / 100
                currency = payment_intent['currency'].upper()
            else:
                # fallback for one-time checkout with no payment intent
                amount = session.get('amount_total', 0) / 100
                currency = session.get('currency', 'USD').upper()
        except Exception as e:
            logger.warning(f"⚠️ Failed to retrieve payment intent: {e}")
            amount = 0
            currency = 'USD'

        # Save Payment
        Payment.objects.create(
            user=user,
            amount=amount,
            currency=currency,
            status='completed',
            stripe_payment_intent=payment_intent_id,
        )

        # Create or update subscription
        subscription, _ = Subscription.objects.get_or_create(user=user)

        if payment_type == 'lifetime':
            subscription.status = 'active'
            subscription.is_recurring = False
            subscription.next_billing_date = None
            subscription.stripe_subscription_id = None
            subscription.stripe_customer_id = customer_id
            subscription.save()
            logger.info(f"✅ Lifetime access activated for user {user.name} (ID: {user.id})")

        elif payment_type == 'recurring':
            subscription.activate(
                stripe_subscription_id=subscription_id,
                stripe_customer_id=customer_id,
            )
            subscription.is_recurring = True
            subscription.save()
            logger.info(f"✅ Recurring subscription activated for user {user.name} (ID: {user.id})")

        else:
            logger.warning(f"❗ Unknown payment type received: {payment_type}")
            return JsonResponse({'error': 'Unknown payment type'}, status=400)

    # Handle recurring payments (monthly)
    elif event['type'] == 'invoice.paid':
        invoice = event['data']['object']
        customer_id = invoice.get('customer')
        subscription_id = invoice.get('subscription')
        payment_intent_id = invoice.get('payment_intent')
        amount = invoice.get('amount_paid', 0) / 100
        currency = invoice.get('currency', 'USD').upper()

        try:
            # Try to find user by subscription
            subscription = Subscription.objects.get(stripe_subscription_id=subscription_id)
            user = subscription.user
        except Subscription.DoesNotExist:
            logger.warning(f"⚠️ Subscription not found for ID: {subscription_id}")
            return HttpResponse(status=200)

        if Payment.objects.filter(stripe_payment_intent=payment_intent_id).exists():
            logger.info(f"ℹ️ Payment already exists for invoice: {payment_intent_id}")
            return HttpResponse(status=200)

        # Save Payment
        Payment.objects.create(
            user=user,
            amount=amount,
            currency=currency,
            status='completed',
            stripe_payment_intent=payment_intent_id,
        )

        # Renew subscription
        subscription.renew()
        logger.info(f"🔁 Subscription renewed for {user.name} (ID: {user.id})")

    # Handle failed recurring payments
    elif event['type'] == 'invoice.payment_failed':
        invoice = event['data']['object']
        subscription_id = invoice.get('subscription')

        try:
            subscription = Subscription.objects.get(stripe_subscription_id=subscription_id)
            subscription.status = 'inactive'
            subscription.save()
            logger.warning(f"❌ Payment failed, subscription inactivated for {subscription.user.name}")
        except Subscription.DoesNotExist:
            logger.warning(f"⚠️ Subscription not found (fail case): {subscription_id}")

    return HttpResponse(status=200)
