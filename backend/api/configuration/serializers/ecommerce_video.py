from rest_framework import serializers
from configuration.models import EcommerceVideo

class EcommerceVideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = EcommerceVideo
        fields = '__all__'
