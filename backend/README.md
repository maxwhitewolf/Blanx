# Django Backend for Social Media Platform

## Features
- User authentication (JWT)
- Posts, Stories, Comments, Likes, Follows
- Direct Messages (real-time with Channels)
- Notifications (real-time, Celery)
- PostgreSQL, Redis, Celery, Channels

## Setup

1. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

2. Set up PostgreSQL and Redis (see docker-compose.yml for example).

3. Set environment variables (or use .env):
   - `DJANGO_SECRET_KEY`, `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_HOST`, `POSTGRES_PORT`, `REDIS_URL`, etc.

4. Run migrations:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

5. Create superuser:
   ```bash
   python manage.py createsuperuser
   ```

6. Run development server:
   ```bash
   python manage.py runserver
   ```

7. Start Celery worker:
   ```bash
   celery -A config worker -l info
   ```

8. Start Channels/ASGI server (for WebSockets):
   ```bash
   daphne -p 8001 config.asgi:application
   ``` 