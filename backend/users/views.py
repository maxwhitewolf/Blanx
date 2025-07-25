from rest_framework import generics, permissions, status, views
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserSerializer, RegisterSerializer
from django.shortcuts import get_object_or_404

User = get_user_model()

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

class ProfileView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

class FollowView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]
    def post(self, request, pk):
        user = request.user
        to_follow = get_object_or_404(User, pk=pk)
        if to_follow != user:
            user.following.add(to_follow)
        return Response({'status': 'followed'})
    def delete(self, request, pk):
        user = request.user
        to_unfollow = get_object_or_404(User, pk=pk)
        user.following.remove(to_unfollow)
        return Response({'status': 'unfollowed'})

class SuggestedUsersView(generics.ListAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
    def get_queryset(self):
        return User.objects.exclude(pk=self.request.user.pk)[:5]
