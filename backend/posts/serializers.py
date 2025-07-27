from rest_framework import serializers
from .models import Post, Comment
from users.serializers import UserSerializer

class CommentSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()
    replies = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ('id', 'user', 'content', 'parent', 'created_at', 'replies')

    def get_replies(self, obj):
        return CommentSerializer(obj.replies.all(), many=True).data

class PostSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    comments = CommentSerializer(many=True, read_only=True)
    like_count = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = ('id', 'user', 'image', 'caption', 'created_at', 'likes', 'like_count', 'comments')

    def get_like_count(self, obj):
        return obj.likes.count() 