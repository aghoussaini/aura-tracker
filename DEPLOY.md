# Deployment Guide

## Option 1: Railway (Recommended - Easiest)

Railway offers a generous free tier and automatic deployments.

### Deploy Backend:
1. Go to [railway.app](https://railway.app) and sign in with GitHub
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your `aura-tracker` repository
4. Set the root directory to `backend`
5. Add environment variables:
   - `SECRET_KEY`: (click generate)
   - `JWT_SECRET_KEY`: (click generate)
   - `FLASK_APP`: `app.py`
6. Railway will auto-detect Python and deploy
7. Copy your backend URL (e.g., `https://aura-tracker-backend.up.railway.app`)

### Deploy Frontend:
1. Create another service in the same project
2. Set root directory to `frontend`
3. Add environment variable:
   - `VITE_API_URL`: Your backend URL from step 7
4. Set build command: `npm install && npm run build`
5. Set start command: `npx serve dist -s`

---

## Option 2: Render

### One-Click Deploy:
The `render.yaml` in the repo root enables Blueprint deployment.

1. Go to [render.com](https://render.com) and sign in
2. Click "New" → "Blueprint"
3. Connect your GitHub repo
4. Render will read `render.yaml` and create both services
5. Update the frontend's `VITE_API_URL` with your actual backend URL

---

## Option 3: Docker (Local or VPS)

```bash
# Clone and run
git clone <your-repo>
cd aura-tracker
docker compose up --build

# Access:
# Frontend: http://localhost:3000
# Backend:  http://localhost:5000
```

---

## Option 4: Manual Local Development

### Backend:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
flask db upgrade
python app.py
# Runs on http://localhost:5000
```

### Frontend:
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:5173
```

---

## Environment Variables

### Backend:
| Variable | Description | Default |
|----------|-------------|---------|
| `SECRET_KEY` | Flask session secret | `dev-secret-key` |
| `JWT_SECRET_KEY` | JWT signing key | `jwt-secret-key` |
| `DATABASE_URL` | Database connection | SQLite (local file) |

### Frontend:
| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:5000` |
