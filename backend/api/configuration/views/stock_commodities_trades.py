from rest_framework import viewsets, status
from rest_framework.response import Response
from configuration.models import StockCommoditiesTrades
from api.configuration.serializers.stock_commodities_trades import StockCommoditiesTradesSerializer
from rest_framework.permissions import IsAuthenticated

class StockCommoditiesTradesView(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request):
        queryset = StockCommoditiesTrades.objects.all()
        serializer = StockCommoditiesTradesSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    