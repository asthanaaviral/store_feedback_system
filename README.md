# Roxiler Store Rating Platform

A full-stack web application for store ratings with role-based access control.

## Tech Stack

- **Frontend:** React.js + Vite + Tailwind CSS
- **Backend:** Express.js + Node.js
- **Database:** MySQL
- **Auth:** JWT

## Project Structure

```
roxiler_assessment/
├── backend/      # Express.js REST API
├── frontend/     # React.js SPA
└── database/     # MySQL schema
```

## Getting Started

### Prerequisites
- Node.js v18+
- MySQL 8+

### 1. Database Setup

```bash
mysql -u root -p
source database/schema.sql
```

### 2. Backend

```bash
cd backend
cp .env.example .env
# Edit .env with your MySQL credentials and JWT secret
npm run dev
```

Backend runs on: `http://localhost:5000`

### 3. Frontend

```bash
cd frontend
cp .env.example .env
# Edit .env — set VITE_API_URL to backend URL
npm run dev
```

Frontend runs on: `http://localhost:5173`

## Default Admin Account

After running the schema, a default admin is seeded:
- **Email:** admin@roxiler.com
- **Password:** Admin@123

> ⚠️ Change this password after first login.

## Environment Variables

### Backend (`backend/.env`)
| Variable | Description |
|----------|-------------|
| PORT | Server port (default: 5000) |
| DB_HOST | MySQL host |
| DB_PORT | MySQL port |
| DB_USER | MySQL user |
| DB_PASSWORD | MySQL password |
| DB_NAME | Database name |
| JWT_SECRET | JWT signing secret |
| JWT_EXPIRES_IN | Token expiry (e.g. 7d) |
| CLIENT_URL | Frontend URL (for CORS) |
| NODE_ENV | development or production |

### Frontend (`frontend/.env`)
| Variable | Description |
|----------|-------------|
| VITE_API_URL | Backend API base URL |

## Deployment

- **Backend:** Deploy to Render / Railway — set all env variables in the dashboard
- **Frontend:** Deploy to Vercel / Netlify — set `VITE_API_URL` to the deployed backend URL
