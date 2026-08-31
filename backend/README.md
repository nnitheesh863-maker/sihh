# SIH26031 – AI-Powered Onion Quality Assessment & Grading System

Production-grade backend for the Smart India Hackathon 2026 problem statement **SIH26031**.

## Architecture

```
React Dashboard / Flutter App
          │
      HTTPS REST API (Nginx)
          │
 Node.js + Express + TypeScript (Gateway)
          │
 ┌────────┼────────────┐
 │        │            │
PostgreSQL  AWS S3   Python FastAPI
 (Prisma)            (YOLOv8 + EfficientNet + OpenCV)
```

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js 24 LTS |
| Framework | Express.js + TypeScript |
| Database | PostgreSQL + Prisma ORM |
| Auth | JWT (Access + Refresh tokens) |
| Storage | AWS S3 |
| AI Service | Python FastAPI + YOLOv8 + EfficientNet |
| Real-time | Socket.IO |
| Docs | Swagger / OpenAPI 3.0 |
| Security | Helmet, CORS, Rate Limiting, bcrypt |
| Logging | Winston |
| Containers | Docker + Docker Compose + Nginx |
| CI/CD | GitHub Actions |

## Quick Start

### Prerequisites
- Node.js 24+
- PostgreSQL 16+
- Python 3.11+ (for AI service)
- Docker (optional)

### 1. Clone & Install

```bash
cd backend
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
# Edit .env with your credentials
```

### 3. Database Setup

```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed demo data
npm run prisma:seed
```

### 4. Start Dev Server

```bash
npm run dev
```

### 5. Start AI Service (separate terminal)

```bash
cd ai
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

## Docker (One Command)

```bash
docker compose up --build
```

This starts:
- PostgreSQL on port 5432
- Node.js Backend on port 5000
- Python AI Service on port 8000
- Nginx on port 80

## API Endpoints

| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Register user | Public |
| POST | `/api/auth/login` | Login | Public |
| POST | `/api/auth/refresh` | Refresh tokens | Public |
| POST | `/api/auth/logout` | Logout | Public |
| POST | `/api/onions/analyze` | Upload & grade onion | 🔒 All |
| GET | `/api/onions/history` | Analysis history | 🔒 All |
| GET | `/api/onions/:id` | Get analysis | 🔒 All |
| DELETE | `/api/onions/:id` | Delete analysis | 🔒 Farmer |
| GET | `/api/farmers/profile` | Get profile | 🔒 Farmer |
| PUT | `/api/farmers/profile` | Update profile | 🔒 Farmer |
| GET | `/api/procurement/dashboard` | Dashboard stats | 🔒 Officer |
| GET | `/api/procurement/analyses` | All analyses | 🔒 Officer |
| GET | `/api/certificate/:id` | Get certificate | 🔒 All |
| GET | `/api/certificate/:id/pdf` | Download PDF | 🔒 All |
| GET | `/api/admin/users` | All users | 🔒 Admin |
| GET | `/api/admin/statistics` | Platform stats | 🔒 Admin |
| GET | `/api/admin/models` | AI model info | 🔒 Admin |

## API Documentation

After starting the server: **http://localhost:5000/api/docs**

## Health Check

```
GET http://localhost:5000/health
```

## Demo Credentials (after seeding)

| Role | Email | Password |
|---|---|---|
| Admin | admin@oniongrading.in | Admin@123 |
| Officer | officer@oniongrading.in | Officer@123 |
| Farmer | farmer@example.com | Farmer@123 |

## AI Pipeline

```
Image Upload → OpenCV Preprocess → YOLOv8 Defect Detection → EfficientNet Quality Grade → Score + Certificate
```

### Grade Scale
| Grade | Score | Recommendation |
|---|---|---|
| A | 85–100 | Accept |
| B | 70–84 | Accept |
| C | 50–69 | Conditional Accept |
| REJECTED | < 50 | Reject |

## AWS Deployment

| Service | Purpose |
|---|---|
| AWS EC2 | Node.js + Python containers |
| AWS RDS | PostgreSQL database |
| AWS S3 | Image + certificate storage |
| AWS CloudWatch | Monitoring + logs |
| GitHub Actions | CI/CD pipeline |

## Folder Structure

```
backend/
├── src/
│   ├── ai/              # AI service client
│   ├── aws/             # S3 service
│   ├── config/          # DB, env config
│   ├── controllers/     # Route handlers
│   ├── docs/            # Swagger config
│   ├── middlewares/     # Auth, validate, upload, error
│   ├── repositories/    # Data access layer
│   ├── routes/          # Express routers
│   ├── services/        # Business logic
│   ├── sockets/         # Socket.IO
│   ├── types/           # TypeScript types
│   ├── utils/           # Logger, errors, response
│   ├── validators/      # Zod schemas
│   ├── app.ts           # Express factory
│   └── server.ts        # Entry point
├── ai/                  # Python FastAPI AI service
├── prisma/              # Schema + migrations + seed
├── docker/              # Nginx config
├── tests/               # Integration tests
├── Dockerfile
├── docker-compose.yml
└── .github/workflows/   # GitHub Actions CI/CD
```
