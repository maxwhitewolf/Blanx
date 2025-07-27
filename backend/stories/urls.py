from django.urls import path
from .views import StoryListCreateView, StoryDetailView, StoryViewersView, MarkStoryAsViewedView, StoryReactionListCreateView, StoryCommentListCreateView

urlpatterns = [
    path('', StoryListCreateView.as_view(), name='story-list-create'),
    path('<int:pk>/', StoryDetailView.as_view(), name='story-detail'),
    path('<int:pk>/view/', MarkStoryAsViewedView.as_view(), name='story-mark-viewed'),
    path('<int:pk>/viewers/', StoryViewersView.as_view(), name='story-viewers'),
    path('<int:story_id>/reactions/', StoryReactionListCreateView.as_view(), name='story-reactions'),
    path('<int:story_id>/comments/', StoryCommentListCreateView.as_view(), name='story-comments'),
] 