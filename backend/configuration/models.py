from django.db import models
from django.core.validators import MinLengthValidator, FileExtensionValidator
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
    url = models.URLField(
        max_length=500,
        null=True,
        blank=True, 
        verbose_name=_('Team URL'),
        help_text=_('Enter your team URL...'),
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

class CryptoTrades(models.Model):
    image = models.ImageField(
        upload_to='crypto-trades/images/',
        validators=[VALIDATE_IMAGE_EXTENSION],
        null=True,
        blank=True,
        verbose_name=_('Crypto Trades Image'),
        help_text=_('Upload your crypto trades image...'),
    )
    video = models.FileField(
        upload_to='crypto-trades/videos/',
        validators=[
            FileExtensionValidator(allowed_extensions=['mp4', 'mov', 'avi', 'mkv']),
        ],
        null=True,
        blank=True,
        verbose_name=_('Crypto Trades Video'),
        help_text=_('Upload your crypto trades video...')
    )
    title = models.CharField(
        max_length=280,
        validators=[MinLengthValidator(3)],
        null=True,
        blank=True,
        verbose_name=_('Crypto Trades Title'),
        help_text=_('Enter your crypto trades title...')
    )
    description = models.TextField(
        max_length=5000,
        validators=[MinLengthValidator(10)],
        null=True,
        blank=True,
        verbose_name=_('Crypto Trades Description'),
        help_text=_('Enter your crypto trades description...'),
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name=_('Created At'),
        help_text=_('Time when this trade was created')
    )

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title or "Untitled Trade"
    
class CryptoTradesSubTitle(models.Model):
    trade = models.ForeignKey(
        CryptoTrades,
        on_delete=models.CASCADE,
        related_name='sub_titles',
        verbose_name=_('Parent Crypto Trade'),
        help_text=_('Select the parent crypto trade...')
    )
    sub_title = models.CharField(
        max_length=280,
        validators=[MinLengthValidator(3)],
        null=True,
        blank=True,
        verbose_name=_('Sub Title'),
        help_text=_('Enter your crypto trades sub title...'),
    )

    def __str__(self):
        return self.sub_title or "Untitled SubTitle"

class StockCommoditiesTrades(models.Model):
    image = models.ImageField(
        upload_to='stock-commodities-trades/images/',
        validators=[VALIDATE_IMAGE_EXTENSION],
        null=True,
        blank=True,
        verbose_name=_('Stock Commodities Trades Image'),
        help_text=_('Upload your stock commodities trades image...'),
    )
    video = models.FileField(
        upload_to='stock-commodities-trades/videos/',
        validators=[
            FileExtensionValidator(allowed_extensions=['mp4', 'mov', 'avi', 'mkv']),
        ],
        null=True,
        blank=True,
        verbose_name=_('Stock Commodities Trades Video'),
        help_text=_('Upload your stock commodities trades video...')
    )
    title = models.CharField(
        max_length=280,
        validators=[MinLengthValidator(3)],
        null=True,
        blank=True,
        verbose_name=_('Stock Commodities Trades Title'),
        help_text=_('Enter your stock commodities trades title...')
    )
    description = models.TextField(
        max_length=5000,
        validators=[MinLengthValidator(10)],
        null=True,
        blank=True,
        verbose_name=_('Stock Commodities Trades Description'),
        help_text=_('Enter your stock commodities trades description...'),
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name=_('Created At'),
        help_text=_('Time when this trade was created')
    )

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title or "Untitled Trade"
    
class StockCommoditiesTradesSubTitle(models.Model):
    stock_commodities_trades = models.ForeignKey(
        StockCommoditiesTrades,
        on_delete=models.CASCADE,
        related_name='sub_titles',
        verbose_name=_('Parent Stock Commodities Trades'),
        help_text=_('Select the parent stock commodities trades...')
    )
    sub_title = models.CharField(
        max_length=280,
        validators=[MinLengthValidator(3)],
        null=True,
        blank=True,
        verbose_name=_('Sub Title'),
        help_text=_('Enter your stock commodities trades sub title...'),
    )

    def __str__(self):
        return self.sub_title or "Untitled SubTitle"

class MarketUpdates(models.Model):
    image = models.ImageField(
        upload_to='market-updates/images/',
        validators=[VALIDATE_IMAGE_EXTENSION],
        null=True,
        blank=True,
        verbose_name=_('Market Updates Image'),
        help_text=_('Upload your market updates image...'),
    )
    video = models.FileField(
        upload_to='market-updates/videos/',
        validators=[
            FileExtensionValidator(allowed_extensions=['mp4', 'mov', 'avi', 'mkv']),
        ],
        null=True,
        blank=True,
        verbose_name=_('Market Updates Video'),
        help_text=_('Upload your market updates video...')
    )
    title = models.CharField(
        max_length=280,
        validators=[MinLengthValidator(3)],
        null=True,
        blank=True,
        verbose_name=_('Market Updates Title'),
        help_text=_('Enter your market updates title...')
    )
    description = models.TextField(
        max_length=5000,
        validators=[MinLengthValidator(10)],
        null=True,
        blank=True,
        verbose_name=_('Market Updates Description'),
        help_text=_('Enter your market updates description...'),
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name=_('Created At'),
        help_text=_('Time when this trade was created')
    )

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title or "Untitled Trade"
    
class MarketUpdatesSubTitle(models.Model):
    market_updates = models.ForeignKey(
        MarketUpdates,
        on_delete=models.CASCADE,
        related_name='sub_titles',
        verbose_name=_('Parent market updates'),
        help_text=_('Select the parent market updates...')
    )
    sub_title = models.CharField(
        max_length=280,
        validators=[MinLengthValidator(3)],
        null=True,
        blank=True,
        verbose_name=_('Sub Title'),
        help_text=_('Enter your market updates sub title...'),
    )

    def __str__(self):
        return self.sub_title or "Untitled SubTitle"

EDUCATIONVIDEOSTATUS = [
    ('advance', 'Advance'),
    ('beginner', 'Beginner'),
]

class Education(models.Model):
    video = models.FileField(
        upload_to='education/videos/',
        verbose_name=_('Education Video'),
        help_text=_('Upload your education video...')
    )
    status = models.CharField(
        max_length=20,
        choices=EDUCATIONVIDEOSTATUS,
        verbose_name=_('Status'),
        help_text=_('Select the difficulty level of this video.')
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name=_('Created At'),
        help_text=_('Time when this education video was created')
    )

    class Meta:
        ordering = ['-created_at']
        verbose_name = _('Education Video')
        verbose_name_plural = _('Education Videos')

    def __str__(self):
        return f"{self.get_status_display()} Video"
    
class EcommerceVideo(models.Model):
    video = models.FileField(
        upload_to='e-commerce/videos/',
        verbose_name=_('E-commerce Video'),
        help_text=_('Upload your e-commerce video...')
    )
    created_at = models.DateTimeField(
        auto_now_add=True,
        verbose_name=_('Created At'),
        help_text=_('Time when this education video was created')
    )

    class Meta:
        ordering = ['-created_at']
        verbose_name = _('E-commerce Video')
        verbose_name_plural = _('E-commerce Videos')

    def __str__(self):
        return f"{self.get_status_display()} Video"

