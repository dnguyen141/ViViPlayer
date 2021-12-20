from rest_framework import serializers
from session.models import ViViSession, Shot, UserStory, Sentence, MultipleChoiceQuestion


class SessionSerializer(serializers.ModelSerializer):
    video_path = serializers.FileField()
    owner = serializers.CharField(default=serializers.CurrentUserDefault())

    class Meta:
        model = ViViSession
        fields = '__all__'


class ShotSerializer(serializers.ModelSerializer):
    session = SessionSerializer()

    class Meta:
        model = Shot
        fields = ['id', 'session', 'title', 'time']

    def to_representation(self, obj):
        ret = super(ShotSerializer, self).to_representation(obj)
        ret.pop('session')

        return ret


class CreateShotSerializer(serializers.ModelSerializer):
    session = serializers.ReadOnlyField()

    class Meta:
        model = Shot
        fields = ['session', 'title', 'time']


class UserStorySerializer(serializers.ModelSerializer):
    class Meta:
        model = UserStory
        fields = '__all__'


class SentenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sentence
        fields = '__all__'


class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = MultipleChoiceQuestion
        fields = '__all__'
