from rest_framework import viewsets, status
from rest_framework.response import Response
from configuration.models import EcommerceService
from api.configuration.serializers.ecommerc_service import EcommerceServiceSerializer
from rest_framework.permissions import AllowAny

class EcommerceServiceView(viewsets.ViewSet):
    permission_classes = [AllowAny]

    def list(self, request):
        queryset = EcommerceService.objects.all()
        serializer = EcommerceServiceSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    