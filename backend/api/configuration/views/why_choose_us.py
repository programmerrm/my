from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.parsers import JSONParser
from rest_framework.permissions import AllowAny
from api.configuration.serializers.why_choose_us import WhyChooseUsSerializer
from configuration.models import WhyChooseUs

class WhyChooseUsViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]
    parser_classes = [JSONParser]

    def list(self, request, *args, **kwargs):
        why_choose_us = WhyChooseUs.objects.all()
        try:
            if why_choose_us:
                serializer = WhyChooseUsSerializer(why_choose_us, many=True)
                return Response({
                    'success': True,
                    'message': 'Why Choose Us data fetched successfully',
                    'data': serializer.data,
                }, status=status.HTTP_200_OK)
            return Response({
                'success': False,
                'message': 'No Why Choose Us found in your database',
                'data': [],
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({
                'success': False,
                'message': 'An error occurred while fetching why choose us data.',
                'errors': str(e),
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
