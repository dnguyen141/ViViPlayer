from rest_framework import serializers
from session.models import ViViSession, Shot


class SessionSerializer(serializers.ModelSerializer):

    class Meta:
        model = ViViSession
        fields = '__all__'


class ShotSerializer(serializers.ModelSerializer):

    session = SessionSerializer()

    class Meta:
        model = Shot
        fields = '__all__'


class FilteredShotSerializer(serializers.ListSerializer):

    def to_representation(self, data):
        data = data.filter(session=True)
        return super(FilteredListSerializer, self).to_representation(data)
