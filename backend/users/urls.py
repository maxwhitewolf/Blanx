from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import RegisterView, ProfileView, FollowView, SuggestedUsersView, LoginView, CurrentUserView

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', LoginView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('me/', CurrentUserView.as_view(), name='current-user'),
    path('profile/<str:username>/', ProfileView.as_view(), name='profile'),
    path('follow/<int:pk>/', FollowView.as_view(), name='follow'),
    path('suggested/', SuggestedUsersView.as_view(), name='suggested_users'),
] 