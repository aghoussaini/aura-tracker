# Aura Tracker Frontend

This React app provides simple login and sign up forms for the Aura Tracker API built with shadcn and Radix UI.

## Development

Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

The app expects the backend API to be running on `http://localhost:5000`.

### Docker

To build the production image and run it along with the backend, use docker compose from the project root:

```bash
docker compose up --build
```
