from rest_framework import serializers
from session.models import ViViSession, Shot, UserStory, Sentence, MultipleChoiceQuestion
from django.core.validators import FileExtensionValidator, RegexValidator

VID_VALIDATOR = FileExtensionValidator(allowed_extensions=['mp4', 'mov', 'wmv', 'flv', 'avi', 'avchd', 'webm', 'mkv'])
IMG_VALIDATOR = FileExtensionValidator(allowed_extensions=['png', 'jpg', 'jpeg', 'bmp', 'gif'])
US_VALIDATOR = RegexValidator(
    regex=r"^Damit .* möchte ich als .*$",
    message="User Story must start with \"Damit\" and contain \"möchte ich als\""
)


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
    session = serializers.ReadOnlyField(source='session.session_id')
    author = serializers.ReadOnlyField(source='author.username')
    desc = serializers.CharField(min_length=20, max_length=500, validators=[US_VALIDATOR])
    shot = serializers.PrimaryKeyRelatedField(queryset=Shot.objects.all())

    class Meta:
        model = UserStory
        fields = '__all__'


class SentenceSerializer(serializers.ModelSerializer):
    session = serializers.ReadOnlyField(source='session.session_id')
    author = serializers.ReadOnlyField(source='author.username')
    text = serializers.CharField(max_length=500)
    shot = serializers.PrimaryKeyRelatedField(queryset=Shot.objects.all())

    class Meta:
        model = Sentence
        fields = '__all__'

    def create(self, validated_data):
        return Sentence.objects.create(**validated_data)


class QuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = MultipleChoiceQuestion
        fields = '__all__'
