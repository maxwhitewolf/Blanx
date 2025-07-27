from rest_framework import generics, permissions, status
from .models import Story, StoryReaction, StoryComment
from .serializers import StorySerializer, StoryReactionSerializer, StoryCommentSerializer
from django.utils import timezone
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

class StoryListCreateView(generics.ListCreateAPIView):
    serializer_class = StorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        # Show stories from followed users and self, not expired, distinct and ordered
        now = timezone.now()
        return Story.objects.filter(
            user__in=list(user.following.all()) + [user], 
            created_at__gte=now - timezone.timedelta(hours=24)
        ).distinct().order_by('-created_at')

    def perform_create(self, serializer):
        instance = serializer.save(user=self.request.user)
        if not instance.expires_at:
            instance.expires_at = instance.created_at + timezone.timedelta(hours=24)
            instance.save(update_fields=["expires_at"])

class StoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Story.objects.all()
    serializer_class = StorySerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        # Only allow users to see stories from followed users and self
        user = self.request.user
        return Story.objects.filter(user__in=list(user.following.all()) + [user])

class StoryViewersView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    def get(self, request, pk):
        story = get_object_or_404(Story, pk=pk)
        viewers = story.viewers.all()
        return Response([{'id': u.id, 'username': u.username} for u in viewers])

class MarkStoryAsViewedView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request, pk):
        story = get_object_or_404(Story, pk=pk)
        # Add current user to viewers
        story.viewers.add(request.user)
        return Response({'status': 'viewed'})

class StoryReactionListCreateView(generics.ListCreateAPIView):
    serializer_class = StoryReactionSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        story_id = self.kwargs['story_id']
        return StoryReaction.objects.filter(story_id=story_id)
    def perform_create(self, serializer):
        story_id = self.kwargs['story_id']
        serializer.save(user=self.request.user, story_id=story_id)

class StoryCommentListCreateView(generics.ListCreateAPIView):
    serializer_class = StoryCommentSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        story_id = self.kwargs['story_id']
        return StoryComment.objects.filter(story_id=story_id)
    def perform_create(self, serializer):
        story_id = self.kwargs['story_id']
        serializer.save(user=self.request.user, story_id=story_id) 