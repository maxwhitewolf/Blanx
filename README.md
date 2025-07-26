# Blanx

This is a simple social media platform with a Django backend and React frontend.

## Setup
Install dependencies (backend and frontend):
```bash
pip install -r backend/requirements.txt
cd frontend && npm install
```

Run backend:
```bash
python backend/manage.py runserver
```

Run frontend:
```bash
npm --prefix frontend start
```

## Tests
```bash
python backend/manage.py test
npm --prefix frontend test --silent
```


## Authentication
Users can sign in using either their username or email address. The login API
returns JWT access and refresh tokens on success.
