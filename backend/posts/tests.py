from django.urls import reverse
from rest_framework.test import APITestCase
from django.contrib.auth import get_user_model
from django.core.files.uploadedfile import SimpleUploadedFile
from django.test import override_settings
import tempfile

User = get_user_model()

@override_settings(MEDIA_ROOT=tempfile.mkdtemp())
class PostTests(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='tester', password='pass1234')

    def test_create_post(self):
        self.client.force_authenticate(user=self.user)
        url = reverse('post-list-create')
        image = SimpleUploadedFile('test.jpg', b'filecontent', content_type='image/jpeg')
        data = {'caption': 'Hello', 'image': image}
        response = self.client.post(url, data, format='multipart')
        self.assertEqual(response.status_code, 201)
        self.assertEqual(self.user.posts.count(), 1)
        post = self.user.posts.first()
        self.assertEqual(post.caption, 'Hello')

