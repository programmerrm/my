from django.contrib import admin
from configuration.models import (
    Logo, 
    FooterLogo, 
    OfficialInfo, 
    Team, 
    Services, 
    WhyChooseUs, 
    Banner, 
    About,
    CryptoTrades,
    CryptoTradesSubTitle,
    StockCommoditiesTrades,
    StockCommoditiesTradesSubTitle,
    MarketUpdates,
    MarketUpdatesSubTitle,
    EcommerceVideo,
    Education,
    EcommerceService,
)

class FooterLogoAdmin(admin.ModelAdmin):
    list_display = ['logo', 'description']

class OfficialInfoAdmin(admin.ModelAdmin):
    list_display = ['Address', 'email', 'number']

class TeamAdmin(admin.ModelAdmin):
    list_display = ['title', 'description', 'url', 'image']

class ServicesAdmin(admin.ModelAdmin):
    list_display = ['title', 'description', 'image']

class WhyChooseUsAdmin(admin.ModelAdmin):
    list_display = ['title', 'description', 'image']

class BannerAdmin(admin.ModelAdmin):
    list_display = ['title', 'sub_title', 'video']

class CryptoTradesSubTitleInline(admin.TabularInline):
    model = CryptoTradesSubTitle
    extra = 1

class CryptoTradesAdmin(admin.ModelAdmin):
    inlines = [CryptoTradesSubTitleInline]
    list_display = ['title', 'description', 'created_at']
    search_fields = ['title', 'description']
    list_filter = ['created_at']
    readonly_fields = ['created_at']

class StockCommoditiesTradesSubTitleInline(admin.TabularInline):
    model = StockCommoditiesTradesSubTitle
    extra = 1

class StockCommoditiesTradesAdmin(admin.ModelAdmin):
    inlines = [StockCommoditiesTradesSubTitleInline]
    list_display = ['title', 'description', 'created_at']
    search_fields = ['title', 'description']
    list_filter = ['created_at']
    readonly_fields = ['created_at']

class MarketUpdatesInline(admin.TabularInline):
    model = MarketUpdatesSubTitle
    extra = 1

class MarketUpdatesAdmin(admin.ModelAdmin):
    inlines = [MarketUpdatesInline]
    list_display = ['title', 'description', 'created_at']
    search_fields = ['title', 'description']
    list_filter = ['created_at']
    readonly_fields = ['created_at']

# Register your models here.
admin.site.register(Logo)
admin.site.register(FooterLogo, FooterLogoAdmin)
admin.site.register(OfficialInfo, OfficialInfoAdmin)
admin.site.register(Team, TeamAdmin)
admin.site.register(Services, ServicesAdmin)
admin.site.register(WhyChooseUs, WhyChooseUsAdmin)
admin.site.register(Banner, BannerAdmin)
admin.site.register(About)
admin.site.register(CryptoTrades, CryptoTradesAdmin)
admin.site.register(StockCommoditiesTrades, StockCommoditiesTradesAdmin)
admin.site.register(MarketUpdates, MarketUpdatesAdmin)
admin.site.register(Education)
admin.site.register(EcommerceVideo)
admin.site.register(EcommerceService)
