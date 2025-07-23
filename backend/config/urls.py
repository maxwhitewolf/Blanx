from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('users.urls')),
    path('api/posts/', include('posts.urls')),
    path('api/stories/', include('stories.urls')),
    path('api/dm/', include('dm.urls')),
    path('api/notifications/', include('notifications.urls')),
] 