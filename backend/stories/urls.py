from django.urls import path
from .views import StoryListCreateView, StoryViewersView, StoryReactionListCreateView, StoryCommentListCreateView

urlpatterns = [
    path('', StoryListCreateView.as_view(), name='story-list-create'),
    path('<int:pk>/viewers/', StoryViewersView.as_view(), name='story-viewers'),
    path('<int:story_id>/reactions/', StoryReactionListCreateView.as_view(), name='story-reactions'),
    path('<int:story_id>/comments/', StoryCommentListCreateView.as_view(), name='story-comments'),
]
