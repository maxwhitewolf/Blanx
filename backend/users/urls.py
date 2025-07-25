from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import RegisterView, ProfileView, FollowView, SuggestedUsersView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('profile/<int:pk>/', ProfileView.as_view(), name='profile'),
    path('follow/<int:pk>/', FollowView.as_view(), name='follow'),
    path('suggested/', SuggestedUsersView.as_view(), name='suggested_users'),
]
