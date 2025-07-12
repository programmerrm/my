from rest_framework import serializers
from configuration.models import MarketUpdates, MarketUpdatesSubTitle

class MarketUpdatesSubTitleSerializer(serializers.ModelSerializer):
    class Meta:
        model = MarketUpdatesSubTitle
        fields = ['id', 'sub_title']

class MarketUpdatesSerializer(serializers.ModelSerializer):
    sub_titles = MarketUpdatesSubTitleSerializer(many=True, read_only=True)

    class Meta:
        model = MarketUpdates
        fields = '__all__'
