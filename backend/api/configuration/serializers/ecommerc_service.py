from rest_framework import serializers
from configuration.models import EcommerceService

class EcommerceServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = EcommerceService
        fields = '__all__'
