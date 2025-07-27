# BLANX

This repository contains both the Django backend and the React frontend for the social media platform.

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
