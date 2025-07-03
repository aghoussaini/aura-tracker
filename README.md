# Aura Tracker

This repository contains a Flask backend and a React frontend for a simple authentication demo.

## Backend

The backend is located in `backend/` and uses Flask with SQLAlchemy. It exposes `/signup`, `/login`, and `/signout` endpoints. When signing up, provide a username, first name, last name, password and password confirmation.

To run the backend:

```bash
cd backend
pip install -r requirements.txt
python app.py
```

## Frontend

The React frontend is located in `frontend/`. It provides login and sign up forms built with shadcn components and Radix UI primitives.

```bash
cd frontend
npm install
npm run dev
```

The frontend expects the backend to be running on `http://localhost:5000`.

## Docker

Both the frontend and backend can be started using Docker Compose:

```bash
docker compose up --build
```

The frontend will be available on <http://localhost:3000> and the backend on <http://localhost:5000>.
