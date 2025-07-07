from django.contrib import admin
from configuration.models import Logo, FooterLogo, OfficialInfo, Team, Services, WhyChooseUs, Banner, About

class FooterLogoAdmin(admin.ModelAdmin):
    list_display = ['logo', 'description']

class OfficialInfoAdmin(admin.ModelAdmin):
    list_display = ['Address', 'email', 'number']

class TeamAdmin(admin.ModelAdmin):
    list_display = ['title', 'description', 'image']

class ServicesAdmin(admin.ModelAdmin):
    list_display = ['title', 'description', 'image']

class WhyChooseUsAdmin(admin.ModelAdmin):
    list_display = ['title', 'description', 'image']

class BannerAdmin(admin.ModelAdmin):
    list_display = ['title', 'sub_title', 'video']

# Register your models here.
admin.site.register(Logo)
admin.site.register(FooterLogo, FooterLogoAdmin)
admin.site.register(OfficialInfo, OfficialInfoAdmin)
admin.site.register(Team, TeamAdmin)
admin.site.register(Services, ServicesAdmin)
admin.site.register(WhyChooseUs, WhyChooseUsAdmin)
admin.site.register(Banner, BannerAdmin)
admin.site.register(About)
