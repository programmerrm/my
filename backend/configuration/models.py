from django.db import models
from django.core.validators import MinLengthValidator
from configuration.utils.logo_upload import LOGO_DIRECTORY_PATH
from core.utils import VALIDATE_IMAGE_EXTENSION, VALIDATE_IMAGE_SIZE, VALIDATE_EMAIL, VALIDATE_PHONE_NUMBER
from django.utils.translation import gettext_lazy as _

# Create your models here.

class Logo(models.Model):
    logo = models.ImageField(
        upload_to=LOGO_DIRECTORY_PATH,
        validators=[VALIDATE_IMAGE_EXTENSION, VALIDATE_IMAGE_SIZE],
        null=True,
        blank=True,
        verbose_name=_('Logo'),
        help_text=_('Upload your logo...'),
    )

    class Meta:
        verbose_name = _('Logo')
        verbose_name_plural = _('Logo')
        ordering = ['-id']

    def __str__(self):
        return f'Logo add yout database {self.logo.name}'
    
class FooterLogo(models.Model):
    logo = models.ImageField(
        upload_to=LOGO_DIRECTORY_PATH,
        validators=[VALIDATE_IMAGE_EXTENSION, VALIDATE_IMAGE_SIZE],
        null=True,
        blank=True,
        verbose_name=_('Logo'),
        help_text=_('Upload your logo...'),
    )
    description = models.TextField(
        max_length=250,
        validators=[MinLengthValidator(10)],
        null=True,
        blank=True,
        verbose_name=_('Footer description'),
        help_text=_('Enter your description...'),
    )

    class Meta:
        verbose_name = _('Footer Logo')
        verbose_name_plural = _('Footer Logo')
        ordering = ['-id']

    def __str__(self):
        return f'Footer logo & description added'

class OfficialInfo(models.Model):
    Address = models.CharField(
        max_length=280,
        validators=[MinLengthValidator(10)],
        null=True,
        blank=True,
        verbose_name=_('Address'),
        help_text=_('Enter your address...'),
    )
    email = models.EmailField(
        max_length=180,
        validators=[VALIDATE_EMAIL],
        null=True,
        blank=True,
        verbose_name=_('Email'),
        help_text=_('Enter your email address...'),
    )
    number = models.CharField(
        max_length=20,
        validators=[VALIDATE_PHONE_NUMBER],
        null=True,
        blank=True,
        verbose_name=_('Number'),
        help_text=_('Enter your number...'),
    )

    class Meta:
        verbose_name = _('Official Info')
        verbose_name_plural = _('Official Info')
        ordering = ['-id']

    def __str__(self):
        return f'your official info'

class Team(models.Model):
    image = models.ImageField(
        upload_to='team/',
        validators=[VALIDATE_IMAGE_EXTENSION, VALIDATE_IMAGE_SIZE],
        null=True,
        blank=True,
        verbose_name=_('Team Image'),
        help_text=_('Upload your team image...'),
    )
    title = models.CharField(
        max_length=180,
        validators=[MinLengthValidator(10)],
        null=True,
        blank=True,
        verbose_name=_('Team Title'),
        help_text=_('Enter your team title...'),
    )
    description = models.TextField(
        max_length=10000,
        validators=[MinLengthValidator(10)],
        null=True,
        blank=True,
        verbose_name=_('Team description'),
        help_text=_('Enter your team description...'),
    )

    def __str__(self):
        return f'Team title is {self.title}'
    
class About(models.Model):
    image = models.ImageField(
        upload_to='about',
        validators=[VALIDATE_IMAGE_EXTENSION, VALIDATE_IMAGE_SIZE],
        null=True,
        blank=True,
        verbose_name=_('About Image'),
        help_text=_('Upload your about image...'),
    )
    title = models.TextField(
        max_length=280,
        validators=[MinLengthValidator(10)],
        null=True,
        blank=True,
        verbose_name=_('About Title'),
        help_text=_('Enter your about title...'),
    )
    description = models.TextField(
        max_length=500,
        validators=[MinLengthValidator(10)],
        null=True,
        blank=True,
        verbose_name=_('About description'),
        help_text=_('Enter your about description...'),
    )

    def __str__(self):
        return f'About data added'
    
class Services(models.Model):
    image = models.ImageField(
        upload_to='services',
        validators=[VALIDATE_IMAGE_EXTENSION, VALIDATE_IMAGE_SIZE],
        null=True,
        blank=True,
        verbose_name=_('Service Image'),
        help_text=_('Upload your service image...'),
    )
    title = models.TextField(
        max_length=280,
        validators=[MinLengthValidator(10)],
        null=True,
        blank=True,
        verbose_name=_('Service Title'),
        help_text=_('Enter your service title...'),
    )
    description = models.TextField(
        max_length=500,
        validators=[MinLengthValidator(10)],
        null=True,
        blank=True,
        verbose_name=_('Service description'),
        help_text=_('Enter your service description...'),
    )

    def __str__(self):
        return f'Services added'

class WhyChooseUs(models.Model):
    image = models.ImageField(
        upload_to='whychooseus',
        validators=[VALIDATE_IMAGE_EXTENSION, VALIDATE_IMAGE_SIZE],
        null=True,
        blank=True,
        verbose_name=_('WhyChooseUs Image'),
        help_text=_('Upload your whychooseus image...'),
    )
    sub_image = models.ImageField(
        upload_to='whychooseus',
        validators=[VALIDATE_IMAGE_EXTENSION, VALIDATE_IMAGE_SIZE],
        null=True,
        blank=True,
        verbose_name=_('WhyChooseUs Sub-Image'),
        help_text=_('Upload your whychooseus-sub image...'),
    )
    title = models.TextField(
        max_length=280,
        validators=[MinLengthValidator(10)],
        null=True,
        blank=True,
        verbose_name=_('WhyChooseUs Title'),
        help_text=_('Enter your whychooseus title...'),
    )
    description = models.TextField(
        max_length=500,
        validators=[MinLengthValidator(10)],
        null=True,
        blank=True,
        verbose_name=_('WhyChooseUs description'),
        help_text=_('Enter your whychooseus description...'),
    )

    def __str__(self):
        return f'Why Choose Us added'
    
class Banner(models.Model):
    video = models.FileField(
        upload_to='banner',
        null=True,
        blank=True,
        verbose_name=_('Banner Video'),
        help_text=_('Upload a promotional banner video (MP4, AVI, etc).')
    )
    title = models.TextField(
        max_length=280,
        validators=[MinLengthValidator(10)],
        null=True,
        blank=True,
        verbose_name=_('Banner Title'),
        help_text=_('Enter your banner title...'),
    )
    sub_title = models.TextField(
        max_length=280,
        validators=[MinLengthValidator(10)],
        null=True,
        blank=True,
        verbose_name=_('Banner Sub-Title'),
        help_text=_('Enter your banner title...'),
    )
    description = models.TextField(
        max_length=10000,
        validators=[MinLengthValidator(10)],
        null=True,
        blank=True,
        verbose_name=_('Banner description'),
        help_text=_('Enter your banner description...'),
    )

    def __str__(self):
        return f'Banner added'
