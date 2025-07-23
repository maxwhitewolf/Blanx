from rest_framework import serializers
from .models import Story, StoryReaction, StoryComment

class StoryReactionSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()
    class Meta:
        model = StoryReaction
        fields = ('id', 'user', 'emoji', 'created_at')

class StoryCommentSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()
    class Meta:
        model = StoryComment
        fields = ('id', 'user', 'content', 'created_at')

class StorySerializer(serializers.ModelSerializer):
    reactions = StoryReactionSerializer(many=True, read_only=True)
    comments = StoryCommentSerializer(many=True, read_only=True)
    user = serializers.PrimaryKeyRelatedField(read_only=True)
    expires_at = serializers.DateTimeField(read_only=True)
    class Meta:
        model = Story
        fields = ('id', 'user', 'media', 'created_at', 'expires_at', 'viewers', 'reactions', 'comments') 