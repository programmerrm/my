from rest_framework import serializers
from configuration.models import StockCommoditiesTrades, StockCommoditiesTradesSubTitle

class StockCommoditiesTradesSubTitleSerializer(serializers.ModelSerializer):
    class Meta:
        model = StockCommoditiesTradesSubTitle
        fields = ['id', 'sub_title']

class StockCommoditiesTradesSerializer(serializers.ModelSerializer):
    sub_titles = StockCommoditiesTradesSubTitleSerializer(many=True, read_only=True)

    class Meta:
        model = StockCommoditiesTrades
        fields = '__all__'
