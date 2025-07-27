from django.urls import path
from .views import PostListCreateView, PostDetailView, FeedView, LikePostView, CommentCreateView, UserPostsView, LikedPostsView, SearchView

urlpatterns = [
    path('', PostListCreateView.as_view(), name='post-list-create'),
    path('<int:pk>/', PostDetailView.as_view(), name='post-detail'),
    path('feed/', FeedView.as_view(), name='feed'),
    path('search/', SearchView.as_view(), name='search'),
    path('<int:pk>/like/', LikePostView.as_view(), name='like-post'),
    path('<int:post_id>/comments/', CommentCreateView.as_view(), name='comment-create'),
    path('user/<str:username>/', UserPostsView.as_view(), name='user-posts'),
    path('liked/', LikedPostsView.as_view(), name='liked-posts'),
] 