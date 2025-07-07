from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.parsers import JSONParser
from rest_framework.permissions import AllowAny
from api.configuration.serializers.banner import BannerSerializer
from configuration.models import Banner

class BannerViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]
    parser_classes = [JSONParser]

    def list(self, request, *args, **kwargs):
        banner = Banner.objects.first()
        try:
            if banner:
                serializer = BannerSerializer(banner)
                return Response({
                    'success': True,
                    'message': 'Banner data fetched successfully',
                    'data': serializer.data,
                }, status=status.HTTP_200_OK)
            return Response({
                'success': False,
                'message': 'No Banner found in your database',
                'data': [],
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({
                'success': False,
                'message': 'An error occurred while fetching banner data.',
                'errors': str(e),
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
