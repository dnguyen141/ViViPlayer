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
    tan = serializers.ReadOnlyField()

    class Meta:
        model = ViViSession
        fields = '__all__'


class ShotSerializer(serializers.ModelSerializer):
    session = serializers.ReadOnlyField(source='session.id')

    class Meta:
        model = Shot
        fields = '__all__'

    def to_representation(self, obj):
        ret = super(ShotSerializer, self).to_representation(obj)
        ret.pop('session')
        return ret


class UserStorySerializer(serializers.ModelSerializer):
    session = serializers.ReadOnlyField(source='session.id')
    author = serializers.ReadOnlyField(source='author.username')
    desc = serializers.CharField(min_length=10, max_length=500, validators=[US_VALIDATOR])
    shot = serializers.PrimaryKeyRelatedField(queryset=Shot.objects.all())

    class Meta:
        model = UserStory
        fields = '__all__'

    def create(self, validated_data):
        return UserStory.objects.create(**validated_data)


class SentenceSerializer(serializers.ModelSerializer):
    session = serializers.ReadOnlyField(source='session.id')
    author = serializers.ReadOnlyField(source='author.username')
    text = serializers.CharField(min_length=10, max_length=500)
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
