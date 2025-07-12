from rest_framework import viewsets, status
from rest_framework.response import Response
from configuration.models import CryptoTrades
from api.configuration.serializers.crypto_trades import CryptoTradesSerializer
from rest_framework.permissions import IsAuthenticated

class CryptoTradesView(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request):
        queryset = CryptoTrades.objects.all()
        serializer = CryptoTradesSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    