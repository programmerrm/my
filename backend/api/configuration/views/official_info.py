from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.parsers import JSONParser
from rest_framework.permissions import AllowAny
from api.configuration.serializers.official_info import OfficialInfoSerializer
from configuration.models import OfficialInfo

class OfficialInfoViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]
    parser_classes = [JSONParser]

    def list(self, request, *args, **kwargs):
        official_info = OfficialInfo.objects.first()
        try:
            if official_info:
                serializer = OfficialInfoSerializer(official_info)
                return Response({
                    'success': True,
                    'message': '',
                    'data': serializer.data,
                }, status=status.HTTP_200_OK)
            return Response({
                'success': False,
                'message': 'No official info found in your database',
                'data': [],
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({
                'success': False,
                'message': 'An error occurred while fetching official info data.',
                'errors': str(e),
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

