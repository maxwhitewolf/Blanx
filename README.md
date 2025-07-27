# BLANX Social Media Platform

BLANX is a full-stack social media project consisting of a Django backend and a React frontend. The backend exposes a REST API with real-time features while the frontend provides the client application. Docker and `docker-compose` are used for local development.

## Architecture

```
./backend   - Django project with Celery and Channels
./frontend  - React application using Redux and Tailwind
./docker-compose.yml - Containers for PostgreSQL, Redis, Django, Daphne and Celery
```

### Backend
- Django 4 with REST Framework
- PostgreSQL for persistent storage
- Redis for caching and Celery broker
- Channels + Daphne for WebSocket support

### Frontend
- React with Redux Toolkit
- TailwindCSS for styling
- Communicates with the backend via REST and WebSockets

## Setup

### Backend
1. `cd backend`
2. Install dependencies (ideally inside a virtual environment):
   ```bash
   pip install -r requirements.txt
   ```
3. Copy `.env.example` to `.env` and adjust values as needed.
4. Apply migrations and create a superuser:
   ```bash
   python manage.py migrate
   python manage.py createsuperuser
   ```
5. Run the development server:
   ```bash
   python manage.py runserver
   ```
   - For WebSockets run `daphne -p 8001 config.asgi:application`.
   - Start background workers using Celery:
     ```bash
     celery -A config worker -l info
     celery -A config beat -l info
     ```

### Frontend
1. `cd frontend`
2. Install packages:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm start
   ```

## Docker Usage
1. Ensure a `.env` file exists at the repository root (see `.env.example`).
2. Build and start all services:
   ```bash
   docker-compose up --build
   ```
   - Django API available at `http://localhost:8000`
   - ASGI/Daphne at `http://localhost:8001`
3. Stop the stack with `docker-compose down`.

## Running Tests

### Backend (Django)
Use the provided test settings to run the Django test suite:

```bash
cd backend
python manage.py test --settings=config.settings_test
```

### Frontend (React)
React tests can be executed via the npm script at the project root:

```bash
npm test
```

This command proxies to the `frontend` package and runs `react-scripts test`.

