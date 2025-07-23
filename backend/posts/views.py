from rest_framework import generics, permissions, status, views
from rest_framework.response import Response
from rest_framework.pagination import PageNumberPagination
from django.db.models import Count
from .models import Post, Comment
from .serializers import PostSerializer, CommentSerializer
from django.shortcuts import get_object_or_404
from django.contrib.auth import get_user_model
from users.serializers import UserSerializer

User = get_user_model()

class IsOwnerOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        return request.method in permissions.SAFE_METHODS or obj.user == request.user

class PostPagination(PageNumberPagination):
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 50

class PostListCreateView(generics.ListCreateAPIView):
    queryset = Post.objects.all().order_by('-created_at')
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = PostPagination
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class PostDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]

class FeedView(generics.ListAPIView):
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = PostPagination
    def get_queryset(self):
        user = self.request.user
        following_ids = list(user.following.values_list('id', flat=True)) + [user.id]
        return Post.objects.filter(user_id__in=following_ids).order_by('-created_at')

class LikePostView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]
    def post(self, request, pk):
        post = get_object_or_404(Post, pk=pk)
        post.likes.add(request.user)
        return Response({'status': 'liked'})
    def delete(self, request, pk):
        post = get_object_or_404(Post, pk=pk)
        post.likes.remove(request.user)
        return Response({'status': 'unliked'})

class CommentCreateView(generics.CreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [permissions.IsAuthenticated]
    def perform_create(self, serializer):
        post_id = self.kwargs['post_id']
        post = get_object_or_404(Post, pk=post_id)
        serializer.save(user=self.request.user, post=post)

class UserPostsView(generics.ListAPIView):
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = PostPagination
    def get_queryset(self):
        username = self.kwargs['username']
        user = get_object_or_404(User, username=username)
        return Post.objects.filter(user=user).order_by('-created_at')

class LikedPostsView(generics.ListAPIView):
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = PostPagination
    def get_queryset(self):
        user = self.request.user
        return Post.objects.filter(likes=user).order_by('-created_at')
<<<<<<< HEAD


class ExploreView(generics.ListAPIView):
    """Return trending or recent posts with optional filters."""
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticated]
    pagination_class = PostPagination

    def get_queryset(self):
        qs = Post.objects.all()

        tag = self.request.query_params.get('tag')
        if tag:
            qs = qs.filter(caption__icontains=f"#{tag}")

        username = self.request.query_params.get('user')
        if username:
            qs = qs.filter(user__username=username)

        sort = self.request.query_params.get('sort')
        if sort == 'recent':
            qs = qs.order_by('-created_at')
        else:
            qs = qs.annotate(like_count=Count('likes')).order_by('-like_count', '-created_at')
        return qs


class SearchView(views.APIView):
    """Search posts by caption and users by username."""
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        query = request.query_params.get('q', '').strip()
        if not query:
            return Response([])

        user_qs = User.objects.filter(username__icontains=query)[:5]
        post_qs = Post.objects.filter(caption__icontains=query)[:5]

        users = UserSerializer(user_qs, many=True, context={'request': request}).data
        posts = PostSerializer(post_qs, many=True, context={'request': request}).data

        return Response({'users': users, 'posts': posts})
=======
>>>>>>> 2acea2a (Refine ASGI routing)
