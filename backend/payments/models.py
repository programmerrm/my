from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone
from datetime import timedelta

User = get_user_model()

class Subscription(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('cancelled', 'Cancelled'),
        ('expired', 'Expired'),
    ]

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='subscription')
    start_date = models.DateTimeField(auto_now_add=True)
    next_billing_date = models.DateTimeField(blank=True, null=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='inactive')
    is_recurring = models.BooleanField(default=True)
    stripe_subscription_id = models.CharField(max_length=255, blank=True, null=True)
    stripe_customer_id = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return f"{self.user.name} - {self.status}"

    def activate(self, stripe_subscription_id=None, stripe_customer_id=None):
        self.status = 'active'
        self.next_billing_date = timezone.now() + timedelta(days=30)
        if stripe_subscription_id:
            self.stripe_subscription_id = stripe_subscription_id
        if stripe_customer_id:
            self.stripe_customer_id = stripe_customer_id
        self.save()

    def is_expired(self):
        if self.next_billing_date and timezone.now() > self.next_billing_date:
            return True
        return False

    def renew(self):
        self.next_billing_date += timedelta(days=30)
        self.save()

class Payment(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='payments')
    amount = models.DecimalField(max_digits=10, decimal_places=2, default=10.00)
    currency = models.CharField(max_length=3, default='USD')
    payment_date = models.DateTimeField(auto_now_add=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES)
    stripe_payment_intent = models.CharField(max_length=255, blank=True, null=True)

    def __str__(self):
        return f"{self.user.name} - {self.amount} {self.currency} - {self.status}"
