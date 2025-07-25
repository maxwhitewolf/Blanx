from django.contrib import admin
from django.urls import path, include
from posts.views import SearchView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('users.urls')),
    path('api/posts/', include('posts.urls')),
    path('api/search/', SearchView.as_view(), name='search'),
    path('api/stories/', include('stories.urls')),
    path('api/dm/', include('dm.urls')),
    path('api/notifications/', include('notifications.urls')),
] 
