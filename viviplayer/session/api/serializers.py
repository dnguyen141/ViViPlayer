from django.core.validators import FileExtensionValidator
from django.utils.translation import gettext_lazy as _
from rest_framework import serializers

from session.models import (
    ViViSession,
    Shot,
    UserStory,
    Sentence,
    Question
)

VID_VALIDATOR = FileExtensionValidator(
    allowed_extensions=["mp4", "mov", "wmv", "flv", "avi", "avchd", "webm", "mkv"]
)
IMG_VALIDATOR = FileExtensionValidator(
    allowed_extensions=["png", "jpg", "jpeg", "bmp", "gif"]
)


class SessionSerializer(serializers.ModelSerializer):
    video_path = serializers.FileField(validators=[VID_VALIDATOR], use_url=False)
    owner = serializers.ReadOnlyField(source="owner.username")
    tan = serializers.ReadOnlyField()

    class Meta:
        model = ViViSession
        fields = "__all__"


class ShotSerializer(serializers.ModelSerializer):
    session = serializers.ReadOnlyField(source="session.id")

    class Meta:
        model = Shot
        fields = "__all__"

    def to_representation(self, obj):
        ret = super(ShotSerializer, self).to_representation(obj)
        ret.pop("session")
        return ret


class UserStorySerializer(serializers.ModelSerializer):
    session = serializers.ReadOnlyField(source="session.id")
    author = serializers.ReadOnlyField(source="author.username")
    shot = serializers.PrimaryKeyRelatedField(queryset=Shot.objects.all())
    damit = serializers.CharField(min_length=5, max_length=500)
    moechteichals1 = serializers.CharField(min_length=5, max_length=500)
    moechteichals2 = serializers.CharField(min_length=5, max_length=500)

    class Meta:
        model = UserStory
        fields = "__all__"

    def create(self, validated_data):
        return UserStory.objects.create(**validated_data)


class SentenceSerializer(serializers.ModelSerializer):
    session = serializers.ReadOnlyField(source="session.id")
    author = serializers.ReadOnlyField(source="author.username")
    shot = serializers.PrimaryKeyRelatedField(queryset=Shot.objects.all())
    text = serializers.CharField(min_length=10, max_length=500)

    class Meta:
        model = Sentence
        fields = "__all__"

    def create(self, validated_data):
        return Sentence.objects.create(**validated_data)


class QuestionSerializer(serializers.ModelSerializer):
    session = serializers.ReadOnlyField(source="session.id")
    author = serializers.ReadOnlyField(source="author.username")
    shot = serializers.PrimaryKeyRelatedField(queryset=Shot.objects.all())
    title = serializers.CharField(max_length=500)
    typeOfQuestion = serializers.ReadOnlyField()
    choices = serializers.JSONField()
    answers = serializers.ReadOnlyField()
    correct_answer = serializers.CharField(max_length=500, allow_blank=True, required=False)

    def validate_choices(self, choices):
        if type(choices) == list and all(isinstance(choice, str) for choice in choices):
            return list(set(choices))
        raise serializers.ValidationError(_("Ungültiges Format für die Liste der Auswähle!"))

    def validate_correct_answer(self, correct_answer):
        choices = self.initial_data["choices"] + [""]
        if correct_answer not in choices:
            raise serializers.ValidationError(_("Ungültige Lösung für diese Frage!"))
        return correct_answer

    class Meta:
        model = Question
        fields = "__all__"


class AnswerSerializer(serializers.Serializer):
    question_id = serializers.IntegerField()
    answer = serializers.JSONField()

    def validate_answer(self, answer):
        if type(answer) != list or not all(isinstance(choice, str) for choice in answer):
            raise serializers.ValidationError(_("Ungültiges Format für die Antwort eines Benutzer!"))
        return answer
