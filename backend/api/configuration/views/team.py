from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.parsers import JSONParser
from rest_framework.permissions import AllowAny
from api.configuration.serializers.team import TeamSerializer
from configuration.models import Team

class TeamViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]
    parser_classes = [JSONParser]

    def list(self, request, *args, **kwargs):
        teams = Team.objects.all()
        try:
            if teams:
                serializer = TeamSerializer(teams, many=True)
                return Response({
                    'success': True,
                    'message': 'Team data fetched successfully',
                    'data': serializer.data,
                }, status=status.HTTP_200_OK)
            return Response({
                'success': False,
                'message': 'No Team found in your database',
                'data': [],
            }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({
                'success': False,
                'message': 'An error occurred while fetching teams data.',
                'errors': str(e),
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
