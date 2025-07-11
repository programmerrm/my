# Generated by Django 5.2.4 on 2025-07-11 22:56

import core.utils
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('configuration', '0006_cryptotrades_cryptotradessubtitle'),
    ]

    operations = [
        migrations.AlterField(
            model_name='cryptotrades',
            name='image',
            field=models.ImageField(blank=True, help_text='Upload your crypto trades image...', null=True, upload_to='crypto-trades/images/', validators=[core.utils.VALIDATE_IMAGE_EXTENSION], verbose_name='Crypto Trades Image'),
        ),
    ]
