from rest_framework import viewsets, status
from rest_framework.response import Response
from configuration.models import MarketUpdates
from api.configuration.serializers.market_updates import MarketUpdatesSerializer
from rest_framework.permissions import IsAuthenticated

class MarketUpdatesView(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request):
        queryset = MarketUpdates.objects.all()
        serializer = MarketUpdatesSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    