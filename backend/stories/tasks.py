from celery import shared_task
from django.utils import timezone
from .models import Story

@shared_task
def delete_expired_stories():
    now = timezone.now()
    expired_stories = Story.objects.filter(created_at__lt=now - timezone.timedelta(hours=24))
    count = expired_stories.count()
    expired_stories.delete()
    return f"Deleted {count} expired stories." 