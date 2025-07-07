from rest_framework import serializers
from configuration.models import OfficialInfo

class OfficialInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = OfficialInfo
        fields = '__all__'
