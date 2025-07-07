from rest_framework import serializers
from configuration.models import Services

class ServicesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Services
        fields = '__all__'
