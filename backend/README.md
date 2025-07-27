# Django Backend for Social Media Platform

## Features
- User authentication (JWT)
- Posts, Stories, Comments, Likes, Follows
- Direct Messages (real-time with Channels)
- Notifications (real-time, Celery)
- PostgreSQL, Redis, Celery, Channels

## Setup

1. (Optional) create and activate a virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```
2. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

3. Set up PostgreSQL and Redis (see docker-compose.yml for example).

4. Copy `.env.example` to `.env` and set the following variables or export them in your shell:
   - `DJANGO_SECRET_KEY`, `POSTGRES_DB`, `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_HOST`, `POSTGRES_PORT`, `REDIS_URL`, etc.

5. Run migrations:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

6. Create superuser:
   ```bash
   python manage.py createsuperuser
   ```

7. Run development server:
   ```bash
   python manage.py runserver
   ```

8. Start Celery worker:
   ```bash
   celery -A config worker -l info
   ```
9. Start Celery beat scheduler:
   ```bash
   celery -A config beat -l info
   ```

10. Start Channels/ASGI server (for WebSockets):
   ```bash
   daphne -p 8001 config.asgi:application
   ```

