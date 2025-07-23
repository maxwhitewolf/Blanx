from django.contrib import admin
from django.contrib.auth import get_user_model

User = get_user_model()

class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'followers_count', 'following_count')
    filter_horizontal = ('followers',)

    def followers_count(self, obj):
        return obj.followers.count()
    followers_count.short_description = 'Followers'

    def following_count(self, obj):
        return obj.following.count()
    following_count.short_description = 'Following'

admin.site.register(User, UserAdmin) 