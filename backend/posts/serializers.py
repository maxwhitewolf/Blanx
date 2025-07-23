from rest_framework import serializers
from .models import Post, Comment
import re

class CommentSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()
    replies = serializers.SerializerMethodField()

    class Meta:
        model = Comment
        fields = ('id', 'user', 'content', 'parent', 'created_at', 'replies')

    def get_replies(self, obj):
        return CommentSerializer(obj.replies.all(), many=True).data

class PostSerializer(serializers.ModelSerializer):
    user = serializers.StringRelatedField()
    comments = CommentSerializer(many=True, read_only=True)
    like_count = serializers.SerializerMethodField()
    tags = serializers.SerializerMethodField()

    class Meta:
        model = Post
        fields = (
            'id',
            'user',
            'image',
            'caption',
            'tags',
            'created_at',
            'likes',
            'like_count',
            'comments',
        )

    def get_like_count(self, obj):
        return obj.likes.count()
<<<<<<< HEAD

    def get_tags(self, obj):
        return re.findall(r'#(\w+)', obj.caption or '')
=======
>>>>>>> 2acea2a (Refine ASGI routing)
