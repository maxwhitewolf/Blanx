from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from django.contrib.auth.models import update_last_login
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.settings import api_settings

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    followers_count = serializers.SerializerMethodField()
    following_count = serializers.SerializerMethodField()
    posts_count = serializers.SerializerMethodField()
    is_following = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = (
            'id',
            'username',
            'email',
            'avatar',
            'bio',
            'followers_count',
            'following_count',
            'posts_count',
            'is_following',
        )

    def get_followers_count(self, obj):
        return obj.followers.count()

    def get_following_count(self, obj):
        return obj.following.count()

    def get_posts_count(self, obj):
        return obj.posts.count()

    def get_is_following(self, obj):
        request = self.context.get('request')
        if not request or request.user.is_anonymous:
            return False
        return obj.followers.filter(id=request.user.id).exists()

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'avatar', 'bio')

    def create(self, validated_data):
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


class LoginSerializer(TokenObtainPairSerializer):
    """Custom serializer allowing login via username or email."""

    username_field = 'login'

    def validate(self, attrs):
        login = attrs.get('login')
        password = attrs.get('password')

        # Try authenticating with username first
        user = authenticate(username=login, password=password)

        # If not found, try treating login as email
        if user is None:
            try:
                user_obj = User.objects.get(email=login)
            except User.DoesNotExist:
                user_obj = None
            if user_obj is not None:
                user = authenticate(username=user_obj.username, password=password)

        if user is None:
            raise serializers.ValidationError('Invalid credentials')

        self.user = user
        refresh = self.get_token(self.user)
        data = {
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        }
        if api_settings.UPDATE_LAST_LOGIN:
            update_last_login(None, self.user)
        return data 