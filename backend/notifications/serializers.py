from rest_framework import serializers
from .models import Notification

class NotificationSerializer(serializers.ModelSerializer):
    sender = serializers.StringRelatedField()
    recipient = serializers.StringRelatedField()
    target_post = serializers.StringRelatedField()

    class Meta:
        model = Notification
        fields = ('id', 'recipient', 'sender', 'verb', 'target_post', 'is_read', 'created_at') 