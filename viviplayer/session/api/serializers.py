from rest_framework import serializers
from session.models import ViViSession, Shot


class SessionSerializer(serializers.ModelSerializer):

    owner = serializers.ReadOnlyField(source='owner.username')

    class Meta:
        model = ViViSession
        fields = '__all__'


class ShotSerializer(serializers.ModelSerializer):

    session = SessionSerializer()

    class Meta:
        model = Shot
        fields = ['session', 'title', 'time']

    def to_representation(self, obj):

        ret = super(ShotSerializer, self).to_representation(obj)
        ret.pop('session')

        return ret


class CreateShotSerializer(serializers.ModelSerializer):

    session = serializers.ReadOnlyField()


    class Meta:
        model = Shot
        fields = ['session', 'title', 'time']





