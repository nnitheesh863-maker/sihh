# 🧅 PeelVision AI: Smart Onion Quality Assessment & Disease Diagnostic Platform

[![SIH 2026 Platform](https://img.shields.io/badge/SIH-2026-orange.svg)](https://www.sih.gov.in/)
[![Platform Branding](https://img.shields.io/badge/Brand-PeelVision%20AI-emerald.svg)](/)
[![AI Vision Engine](https://img.shields.io/badge/AI-YOLO11n%20Pathology-blue.svg)](https://github.com/ultralytics/ultralytics)
[![Frontend](https://img.shields.io/badge/Frontend-React%2019%20%2B%20Vite%20%2B%20Tailwind-purple.svg)](https://react.dev/)
[![Backend](https://img.shields.io/badge/Backend-Node.js%20%2B%20Express%20%2B%20TypeScript-green.svg)](https://nodejs.org/)
[![Database](https://img.shields.io/badge/Database-PostgreSQL%20%2B%20Prisma-indigo.svg)](https://www.prisma.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

> **PeelVision AI** is an enterprise-grade agricultural computer vision and post-harvest quality assessment system. Leveraging the ultra-efficient **YOLO11n** architecture, it provides real-time multi-spectral onion pathology diagnosis, APMC AGMARKNET standardized grading, agronomic treatment prescriptions ($Rx$), and tamper-proof digital quality certificates.

---

## 📌 Table of Contents
1. [Key Features](#-key-features)
2. [Complete Technology Stack](#-complete-technology-stack)
3. [System Architecture](#-system-architecture)
4. [AI Pathology & Diagnostic Knowledge Base](#-ai-pathology--diagnostic-knowledge-base)
5. [APMC Grading & Certification Standard](#-apmc-grading--certification-standard)
6. [Project Structure](#-project-structure)
7. [Installation & Quick Start](#-installation--quick-start)
8. [API Endpoints](#-api-endpoints)
9. [License](#-license)

---

## 🌟 Key Features

### 1. 🔍 YOLO11n Crop Vision & Pathology Inspector
- Real-time bounding box detection, scale measurement, and pathology diagnosis in **<120ms**.
- Detects fungal sporulation, neck rot, basal rot, purple blotch, and desiccation defects with confidence scoring.
- Intelligent visual feedback with emerald glow bounding frames for **Grade A Clean Specimen** and amber/red alert bounding boxes for diseased specimens.

### 2. 📄 Clean White Official PDF Quality Report (<2MB)
- Generates instant, vector-crisp **APMC Quality Certificates** featuring the official **PeelVision AI** logo.
- Comprehensive diagnostic breakdown: Quality Score (`0-100`), Assigned Grade (`A`, `B`, `C`, `Reject`), Size Category (`45-65mm`), and Moisture/Freshness level.
- Specific Agronomic Treatment Prescriptions ($Rx$) and Curing/Storage guidelines.
- Cryptographic digital verification stamp with scannable QR Code.

### 3. 📊 Interactive Executive Analytics & Risk Matrix
- **Batch Quality Rate Matrix**: Dynamic animated gauge bars tracking percentages for `Healthy`, `Damage`, `Rot`, and `Size`.
- **Smart Environmental Context Engine**: Real-time risk modeling based on crop harvest stage and rainfall conditions.
- **AI Agronomic Recommendations**: Structured, priority-coded actionable advice for farmers and APMC mandi officers.

### 4. 🛡️ Resilient Dual-Layer Architecture
- Built-in local fallback engine for zero-downtime offline functionality.
- Automatic session caching, token resiliency, and vector rendering avoiding client-side canvas color parsing crashes.

---

## 🛠️ Complete Technology Stack

### 🖥️ Frontend Stack
| Layer / Tool | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | **React 19** | Ultra-responsive component architecture |
| **Build Tool** | **Vite 8** | Lightning-fast HMR and optimized asset bundling |
| **Language** | **TypeScript 5** | Strict end-to-end type safety |
| **Styling** | **Tailwind CSS 4 + Vanilla CSS** | Clean glassmorphic design system and responsive grid |
| **Animations** | **Framer Motion** | Micro-interactions, laser scanning beams, and 3D bio-growth animations |
| **Icons** | **Lucide React** | High-fidelity UI iconography |
| **PDF Engine** | **jsPDF (Vector Direct)** | High-res vector PDF generation with custom PeelVision logo |
| **Canvas API** | **HTML5 Canvas 2D** | Real-time proportional bounding box renderer |

### ⚙️ Backend & API Gateway
| Layer / Tool | Technology | Purpose |
| :--- | :--- | :--- |
| **Runtime** | **Node.js 20+ / 24 LTS** | High-performance asynchronous execution runtime |
| **Server Framework** | **Express.js** | Modular REST API routing, rate limiting, and CORS security |
| **Language** | **TypeScript** | Structured enterprise backend codebase |
| **ORM** | **Prisma ORM** | Schema migrations and type-safe database queries |
| **PDF Generation** | **PDFKit** | Server-side cryptographic PDF certificate streaming |
| **QR Code Engine** | **QRCode** | Dynamic base64 QR generation for certificate authentication |
| **Storage Layer** | **Multer + S3 / Local Storage** | Dual-mode asset pipeline for raw and processed inspection images |
| **Security** | **Helmet, JWT, Rate-Limiter** | Enterprise HTTP headers, secure auth cookies, and DDoS throttling |

### 🤖 AI & Computer Vision Engine
| Component | Specification |
| :--- | :--- |
| **Model Architecture** | **YOLO11n (Ultralytics)** — Nano Vision Detection & Segmentation |
| **Inference Framework** | **FastAPI / PyTorch / ONNX Runtime** |
| **Image Preprocessing** | **OpenCV (cv2)** — Scale normalization, illumination compensation, color space conversion |
| **Detection Speed** | **< 120 ms** on CPU / **< 18 ms** with CUDA GPU acceleration |
| **Classes Diagnosed** | `Healthy`, `Black_Mold`, `Basal_Rot`, `Neck_Rot`, `Purple_Blotch`, `Stemphylium_Blight`, `Downy_Mildew`, `Botrytis_Leaf_Blight` |

### 🗄️ Database & Storage
| Component | Technology |
| :--- | :--- |
| **Primary Database** | **PostgreSQL (v16+)** via Prisma Client |
| **Cloud Storage** | **Supabase / AWS S3 / Cloudflare R2** compatible storage |
| **In-Memory Store** | **Node Memory Cache** for offline demo and resilient local sessions |

---

## 🏛️ System Architecture

```
                                    ┌────────────────────────┐
                                    │   Crop Ingestion /     │
                                    │ Camera Hardware / Web  │
                                    └───────────┬────────────┘
                                                │
                                                ▼
┌─────────────────────────┐          ┌───────────────────────────┐          ┌─────────────────────────┐
│   React 19 Dashboard    │  ◄─────► │   Node.js Express Gateway │  ◄─────► │  YOLO11n Vision Engine  │
│  (Vite + Tailwind CSS)  │          │   (TypeScript + Prisma)   │          │   (FastAPI / PyTorch)   │
└─────────────────────────┘          └─────────────┬─────────────┘          └─────────────────────────┘
                                                   │
                         ┌─────────────────────────┴─────────────────────────┐
                         ▼                                                   ▼
             ┌───────────────────────┐                           ┌───────────────────────┐
             │ PostgreSQL (Database) │                           │ S3 / Local Media Hub  │
             │   Users & Certs       │                           │ Originals & Processed │
             └───────────────────────┘                           └───────────────────────┘
```

---

## 🔬 AI Pathology & Diagnostic Knowledge Base

PeelVision AI incorporates an agronomic pathology knowledge base conforming to Indian Council of Agricultural Research (ICAR) and APMC standards:

| Disease Class | Scientific Pathogen | Symptoms | Agronomic Treatment ($Rx$) |
| :--- | :--- | :--- | :--- |
| **Healthy Specimen** | *Allium cepa* (Grade A) | Intact dry outer scales, firm closed neck, uniform color | Cure in dry shade for 10-14 days; store at 0-2°C with 65-70% humidity. |
| **Black Mold** | *Aspergillus niger* | Black powdery spore masses along veins and under tunic | Isolate bulbs immediately; spray crates with 0.1% Carbendazim before loading. |
| **Fusarium Basal Rot** | *Fusarium oxysporum* | Water-soaked decay of basal plate with whitish/pink mycelium | Apply *Trichoderma viride* bulb dip or Carbendazim (1 g/L) for lot quarantine. |
| **Botrytis Neck Rot** | *Botrytis allii* | Soft, sunken tissue around the neck progressing into scales | Isolate affected lots; accelerate dry air ventilation (30-35°C for 24-48 hrs). |
| **Purple Blotch** | *Alternaria porri* | Elliptical water-soaked lesions with dark purple/brown center | Spray Mancozeb 75 WP (2.5 g/L) or Tebuconazole + Trifloxystrobin WG (0.6 g/L). |
| **Stemphylium Blight** | *Stemphylium vesicarium*| Elongated yellow-brown to dark brown lesions on outer scales | Apply Azoxystrobin 18.2% + Difenoconazole 11.4% SC (1 ml/L). |
| **Downy Mildew** | *Peronospora destructor*| Pale green/yellow patches with violet-grey downy fungal growth | Apply Metalaxyl-M 4% + Mancozeb 64% WP (2.5 g/L) or Dimethomorph 50% WP (1 g/L). |
| **Botrytis Leaf Blight**| *Botrytis squamosa* | Silvery-white necrotic spots causing premature scale drying | Apply Iprodione 50% WP (2 g/L) or Chlorothalonil 75% WP (2 g/L). |

---

## 🎖️ APMC Grading & Certification Standard

| Grade Category | Minimum Score | Defect Tolerance | Intended Market Channel |
| :--- | :---: | :---: | :--- |
| **Grade A (Export Premium)** | **$\ge 88$** | $0\%$ Active Pathogens, $<2\%$ Blemish | International Export, High-end Retail, APMC Grade 1 Auction |
| **Grade B (Domestic Wholesale)**| **$70 - 87$** | $<5\%$ Minor Scale Scuffing | Domestic Wholesale Mandis, Inter-State Distribution |
| **Grade C (Processing Grade)** | **$50 - 69$** | Minor Lesions / Conditional Accept | Dehydration, Onion Powder & Flake Processing Units |
| **Reject (Quarantine)** | **$< 50$** | High Rot / Severe Mold Spores | Lot Quarantine, Segregation, Composting |

---

## 📂 Project Structure

```
sih/
├── backend/                  # Node.js + Express + TypeScript Backend
│   ├── prisma/               # Prisma Schema & Database Seeder
│   ├── src/
│   │   ├── config/           # Environment & JWT Configuration
│   │   ├── controllers/      # Auth, Detection, Analysis & Certificate Handlers
│   │   ├── middleware/       # Auth JWT, Upload Multer & Error Middleware
│   │   ├── repositories/     # Database Repositories with Resilient Memory Stores
│   │   ├── routes/           # Express Route Definitions
│   │   ├── services/         # Detection, AI Client, Storage & PDF Services
│   │   └── server.ts         # Application Server Entry Point
│   └── uploads/              # Local Media Storage (Originals, Processed, Certs)
│
├── frontend/                 # React 19 + Vite + Tailwind CSS Frontend
│   ├── public/               # Static Assets & PeelVision AI Logo (`logo.png`)
│   ├── src/
│   │   ├── api/              # Axios Client & API Endpoints
│   │   ├── components/       # UI Components (Navbar, BoundingBoxViewer, QualityCertificate, LoadingOverlay, etc.)
│   │   ├── context/          # Global Auth & State Contexts
│   │   ├── pages/            # ScannerPage, HistoryPage, APMCCentersPage, Dashboards
│   │   └── App.tsx           # Main Application Router & Shell
│   └── vite.config.ts        # Vite Dev Server & Backend Proxy Setup
│
├── ai/                       # YOLO11n Computer Vision Inference Engine
└── README.md                 # Complete System Documentation
```

---

## 🚀 Installation & Quick Start

### 1. Prerequisites
- **Node.js**: v20.x or v24.x LTS
- **npm**: v10+
- **Git**

### 2. Clone and Install Dependencies

```bash
# Clone the repository
git clone https://github.com/nnitheesh863-maker/sihh.git
cd sihh

# Install Backend Dependencies
cd backend
npm install

# Install Frontend Dependencies
cd ../frontend
npm install
```

### 3. Environment Configuration

Create a `.env` file in the `backend/` directory:

```env
PORT=5000
NODE_ENV=development
JWT_SECRET=peelvision_super_secret_jwt_key_2026
JWT_REFRESH_SECRET=peelvision_refresh_secret_jwt_key_2026
AI_SERVICE_URL=http://localhost:8000
FRONTEND_URL=http://localhost:5173
```

### 4. Run Development Servers

Open two terminal instances:

**Terminal 1 (Backend Server):**
```bash
cd backend
npm run dev
# Server running at: http://localhost:5000
```

**Terminal 2 (Frontend Client):**
```bash
cd frontend
npm run dev
# Frontend running at: http://localhost:5173
```

### 5. Access the Platform
- **Web App**: [http://localhost:5173](http://localhost:5173)
- **Interactive API Documentation (Swagger)**: [http://localhost:5000/api/docs](http://localhost:5000/api/docs)
- **Server Health Check**: [http://localhost:5000/health](http://localhost:5000/health)

---

## 📡 API Endpoints Reference

### 🔐 Authentication (`/api/auth`)
- `POST /api/auth/login` — Authenticate user and return JWT access tokens.
- `POST /api/auth/register` — Register a new farmer, trader, or officer account.
- `POST /api/auth/refresh` — Refresh access token using refresh cookie.
- `GET /api/auth/me` — Retrieve current user profile.

### 🔬 AI Detection & Quality Analysis (`/api/detection`)
- `POST /api/detection/analyze` — Upload multipart onion image for YOLO11n diagnostic inference and grade assignment.
- `GET /api/detection/history` — Get paginated historical scan records for the authenticated user.
- `GET /api/detection/{id}` — Retrieve specific analysis record and pathology findings.

### 📜 Certificates & Reports (`/api/certificate`)
- `GET /api/certificate/{analysisId}` — Retrieve certificate metadata and cryptographic QR.
- `GET /api/certificate/{analysisId}/pdf` — Download clean white vector PDF quality certificate with the PeelVision logo.

---

## 📄 License
This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for details.

Developed for **Smart India Hackathon (SIH 2026)** — **PeelVision AI Platform**.
