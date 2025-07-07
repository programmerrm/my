import stripe
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse, HttpResponse
from payments.models import Payment, Subscription
from django.contrib.auth import get_user_model

User = get_user_model()
stripe.api_key = settings.STRIPE_SECRET_KEY

@csrf_exempt
def stripe_webhook(request):
    print("Webhook received!")  # ডিবাগিং এর জন্য

    payload = request.body
    sig_header = request.META.get('HTTP_STRIPE_SIGNATURE')
    endpoint_secret = settings.STRIPE_WEBHOOK_SECRET

    if sig_header is None:
        print("Missing Stripe signature header")
        return HttpResponse(status=400)

    try:
        event = stripe.Webhook.construct_event(
            payload, sig_header, endpoint_secret
        )
    except ValueError:
        print("Invalid payload")
        return HttpResponse(status=400)
    except stripe.error.SignatureVerificationError:
        print("Invalid signature")
        return HttpResponse(status=400)

    print("Event type:", event['type'])

    if event['type'] == 'checkout.session.completed':
        session = event['data']['object']
        print("Session object:", session)

        user_id = session.get('metadata', {}).get('user_id')
        customer_id = session.get('customer')
        subscription_id = session.get('subscription')
        payment_intent_id = session.get('payment_intent')

        if not user_id:
            print("User ID missing in metadata")
            return JsonResponse({'error': 'User ID missing in metadata'}, status=400)

        try:
            user = User.objects.get(id=user_id)
            print("User found:", user)

            if payment_intent_id:
                payment_intent = stripe.PaymentIntent.retrieve(payment_intent_id)
                amount = payment_intent['amount_received'] / 100
                currency = payment_intent['currency'].upper()
            else:
                amount = 10.00
                currency = 'USD'

            print(f"Creating Payment: amount={amount}, currency={currency}, intent={payment_intent_id}")

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
            print("Subscription activated")

        except User.DoesNotExist:
            print("User not found for ID:", user_id)
            return JsonResponse({'error': 'User not found'}, status=400)

    return HttpResponse(status=200)
 