from rest_framework import serializers
from configuration.models import Education

class EducationSerializer(serializers.ModelSerializer):

    class Meta:
        model = Education
        fields = '__all__'
