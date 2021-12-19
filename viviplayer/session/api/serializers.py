from rest_framework import serializers
from session.models import ViViSession, Shot, UserStory, Sentence, MultipleChoiceQuestion
from django.core.validators import FileExtensionValidator

VID_VALIDATOR = FileExtensionValidator(allowed_extensions=['mp4', 'mov', 'wmv', 'flv', 'avi', 'avchd', 'webm', 'mkv'])
IMG_VALIDATOR = FileExtensionValidator(allowed_extensions=['png', 'jpg', 'jpeg', 'bmp', 'gif'])


class SessionSerializer(serializers.ModelSerializer):
    video_path = serializers.FileField(validators=[VID_VALIDATOR])
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


class UserStorySerializer(serializers.ModelSerializer):
    session = serializers.ReadOnlyField(source='session.id')
    author = serializers.ReadOnlyField(source='author.username')

    class Meta:
        model = UserStory
        fields = '__all__'


class SentenceSerializer(serializers.ModelSerializer):
    session = serializers.ReadOnlyField(source='session.id')
    author = serializers.ReadOnlyField(source='author.username')

    class Meta:
        model = Sentence
        fields = '__all__'


class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = MultipleChoiceQuestion
        fields = '__all__'
