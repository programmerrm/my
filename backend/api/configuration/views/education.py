from rest_framework import viewsets, status
from rest_framework.response import Response
from configuration.models import Education
from api.configuration.serializers.education import EducationSerializer
from rest_framework.permissions import IsAuthenticated

class EducationView(viewsets.ViewSet):
    permission_classes = [IsAuthenticated]

    def list(self, request):
        queryset = Education.objects.all()
        serializer = EducationSerializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    