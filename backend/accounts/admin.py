from django.contrib import admin
from django.contrib.auth.hashers import make_password
from accounts.models import User, ActiveSession

class UserAdmin(admin.ModelAdmin):
    list_display = ['user_id', 'name', 'email', 'number', 'role', 'is_active', 'is_block', 'date_joined']

    def save_model(self, request, obj, form, change):
        if form.cleaned_data.get("password") and not obj.password.startswith("pbkdf2_"):
            obj.password = make_password(form.cleaned_data["password"])
        super().save_model(request, obj, form, change)

class ActiveSessionAdmin(admin.ModelAdmin):
    list_display = ['user', 'ip_address', 'user_agent', 'last_login']

# Register your models
admin.site.register(User, UserAdmin)
admin.site.register(ActiveSession, ActiveSessionAdmin)
