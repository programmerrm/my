# Generated by Django 5.2.4 on 2025-07-12 04:52

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('payments', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='subscription',
            name='subscription_type',
            field=models.CharField(choices=[('crypto', 'Crypto'), ('ecommerce', 'E-Commerce')], default='crypto', max_length=20),
        ),
    ]
