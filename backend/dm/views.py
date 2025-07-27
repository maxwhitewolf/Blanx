from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.pagination import PageNumberPagination
from .models import Conversation, Message
from .serializers import ConversationSerializer, MessageSerializer
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model

User = get_user_model()

class IsParticipant(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.user in obj.participants.all()

class MessagePagination(PageNumberPagination):
    page_size = 20
    page_size_query_param = 'page_size'
    max_page_size = 100

class ConversationListView(generics.ListAPIView):
    serializer_class = ConversationSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        return Conversation.objects.filter(participants=self.request.user)

class GetOrCreateConversationView(APIView):
    permission_classes = [permissions.IsAuthenticated]
    
    def post(self, request):
        try:
            other_user_id = request.data.get('user_id')
            if not other_user_id:
                return Response({'error': 'user_id is required'}, status=status.HTTP_400_BAD_REQUEST)
            
            try:
                other_user = User.objects.get(id=other_user_id)
            except User.DoesNotExist:
                return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
            
            # Don't allow messaging yourself
            if other_user == request.user:
                return Response({'error': 'Cannot message yourself'}, status=status.HTTP_400_BAD_REQUEST)
            
            # Check if conversation already exists
            existing_conversation = Conversation.objects.filter(
                participants=request.user
            ).filter(
                participants=other_user
            ).first()
            
            if existing_conversation:
                # Return existing conversation
                return Response({
                    'conversation_id': existing_conversation.id,
                    'created': False
                })
            else:
                # Create new conversation
                conversation = Conversation.objects.create()
                conversation.participants.add(request.user, other_user)
                return Response({
                    'conversation_id': conversation.id,
                    'created': True
                })
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class MessageListCreateView(generics.ListCreateAPIView):
    serializer_class = MessageSerializer
    permission_classes = [permissions.IsAuthenticated, IsParticipant]
    pagination_class = MessagePagination
    def get_queryset(self):
        conversation_id = self.kwargs['conversation_id']
        conversation = get_object_or_404(Conversation, pk=conversation_id, participants=self.request.user)
        self.check_object_permissions(self.request, conversation)
        return Message.objects.filter(conversation=conversation).order_by('timestamp')
    def perform_create(self, serializer):
        conversation_id = self.kwargs['conversation_id']
        conversation = get_object_or_404(Conversation, pk=conversation_id, participants=self.request.user)
        self.check_object_permissions(self.request, conversation)
        serializer.save(sender=self.request.user, conversation=conversation) 