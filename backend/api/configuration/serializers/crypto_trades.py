from rest_framework import serializers
from configuration.models import CryptoTrades, CryptoTradesSubTitle

class CryptoTradesSubTitleSerializer(serializers.ModelSerializer):
    class Meta:
        model = CryptoTradesSubTitle
        fields = ['id', 'sub_title']

class CryptoTradesSerializer(serializers.ModelSerializer):
    sub_titles = CryptoTradesSubTitleSerializer(many=True, read_only=True)

    class Meta:
        model = CryptoTrades
        fields = '__all__'
