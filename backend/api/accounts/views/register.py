from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework.renderers import JSONRenderer
from rest_framework.parsers import JSONParser
from api.accounts.serializers.register import RegisterSerializer

class RegisterViewSet(viewsets.ViewSet):
    permission_classes = [AllowAny]
    parser_classes = [JSONParser]
    renderer_classes = [JSONRenderer]

    def create(self, request, *args, **kwargs):
        try:
            serializer = RegisterSerializer(data=request.data)
            if serializer.is_valid():
                serializer.save()
                return Response({
                    'success': True,
                    'message': 'Register successfully',
                    'data': serializer.data,
                }, status=status.HTTP_201_CREATED)
            return Response({
                'success': False,
                'message': 'Validation error',
                'errors': serializer.errors,
            }, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({
                'success': False,
                'message': 'Server error',
                'errors': str(e),
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
