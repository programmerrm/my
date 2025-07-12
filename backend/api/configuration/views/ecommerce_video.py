from rest_framework import viewsets, status
from rest_framework.response import Response
from configuration.models import EcommerceVideo
from api.configuration.serializers.ecommerce_video import EcommerceVideoSerializer
from rest_framework.permissions import IsAuthenticated

class EcommerceVideoView(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request):
        queryset = EcommerceVideo.objects.all()
        serializer = EcommerceVideoSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    