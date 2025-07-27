from django.urls import path
from .views import ConversationListView, MessageListCreateView, GetOrCreateConversationView

urlpatterns = [
    path('conversations/', ConversationListView.as_view(), name='conversation-list'),
    path('conversations/create/', GetOrCreateConversationView.as_view(), name='create-conversation'),
    path('conversations/<int:conversation_id>/messages/', MessageListCreateView.as_view(), name='message-list-create'),
] 