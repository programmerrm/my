from django.urls import path
from api.configuration.views.logo import LogoViewSet
from api.configuration.views.footer_logo import FooterLogoViewSet
from api.configuration.views.official_info import OfficialInfoViewSet
from api.configuration.views.about import AboutViewSet
from api.configuration.views.banner import BannerViewSet
from api.configuration.views.services import ServicesViewSet
from api.configuration.views.team import TeamViewSet
from api.configuration.views.why_choose_us import WhyChooseUsViewSet
from api.configuration.views.crypto_trades import CryptoTradesView
from api.configuration.views.stock_commodities_trades import StockCommoditiesTradesView
from api.configuration.views.market_updates import MarketUpdatesView
from api.configuration.views.education import EducationView

urlpatterns = [
    path(
        'logo/',
        LogoViewSet.as_view({ 'get': 'list' }),
        name='logo',
    ),
    path(
        'footer-logo/',
        FooterLogoViewSet.as_view({ 'get': 'list' }),
        name='footer_logo',
    ),
    path(
        'official-info/',
        OfficialInfoViewSet.as_view({ 'get': 'list' }),
        name='official_info',
    ),
    path(
        'about/',
        AboutViewSet.as_view({ 'get': 'list' }),
        name='about',
    ),
    path(
        'banner/',
        BannerViewSet.as_view({ 'get': 'list' }),
        name='banner',
    ),
    path(
        'services/',
        ServicesViewSet.as_view({ 'get': 'list' }),
        name='services',
    ),
    path(
        'teams/',
        TeamViewSet.as_view({ 'get': 'list' }),
        name='team',
    ),
    path(
        'why-choose-us/',
        WhyChooseUsViewSet.as_view({ 'get': 'list' }),
        name='why-choose-us',
    ),
    path(
        'crypto-trades/',
        CryptoTradesView.as_view({ 'get': 'list' }),
        name='CryptoTrades'
    ),
    path(
        'stock-commodities-trades/',
        StockCommoditiesTradesView.as_view({ 'get': 'list' }),
        name='stock_commodities_trades',
    ),
    path(
        'market-updates/',
        MarketUpdatesView.as_view({ 'get': 'list' }),
        name='market_updates',
    ),
    path(
        'education/',
        EducationView.as_view({ 'get': 'list' }),
        name='education',
    ),
]
