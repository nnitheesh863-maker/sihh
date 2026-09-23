# 🧅 SIH26031: AI-Powered Onion Quality Assessment & Grading System

[![Smart India Hackathon 2026](https://img.shields.io/badge/SIH-2026-orange.svg)](https://www.sih.gov.in/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js 24 LTS](https://img.shields.io/badge/Node.js-24%20LTS-green.svg)](https://nodejs.org/)
[![FastAPI](https://img.shields.io/badge/AI-FastAPI%20%2B%20YOLOv8-blue.svg)](https://fastapi.tiangolo.com/)
[![React 19 + Vite](https://img.shields.io/badge/Frontend-React%20%2B%20Vite%20%2B%20Tailwind-purple.svg)](https://react.dev/)

> **Problem Statement ID**: SIH26031  
> **Theme**: Agriculture, Foodtech & Rural Development  
> **Solution**: Real-time multi-spectral AI computer vision system for automated grading, defect detection, and Mandi price linkage for post-harvest onion supply chains.

---

## 📌 Table of Contents
- [Problem Overview](#-problem-overview)
- [System Architecture](#-system-architecture)
- [Key Features](#-key-features)
- [Project Structure](#-project-structure)
- [Quick Start Guide](#-quick-start-guide)
- [Technology Stack](#-technology-stack)
- [AI Model Pipeline](#-ai-model-pipeline)
- [IoT & Sorting Mechanism](#-iot--sorting-mechanism)
- [API Documentation](#-api-documentation)
- [License](#-license)

---

## 🎯 Problem Overview
Post-harvest losses in Indian onion supply chains exceed 25-30% annually due to lack of objective grading, late detection of fungal rot/sprouting, and inaccurate size sorting at APMC Mandis (e.g., Lasalgaon, Nashik, Pune).

Our solution provides:
1. **Automated Defect Detection**: Detects black mold (*Aspergillus niger*), neck rot (*Botrytis*), sun scald, sprouting, skin cracks, and double bulbs in under 40ms per onion.
2. **Standardized Grading**: Classifies into Grade A (Export), Grade B (Domestic Wholesale), Grade C (Local Processing), and Reject (Composting).
3. **Mandi Price Prediction**: Dynamically maps graded batch quality to live e-NAM & APMC auction prices to protect farmer margins.
4. **Edge Hardware Integration**: Integrates high-speed camera conveyors with pneumatic sorting actuators.

---

## 🏗 System Architecture
```
                                  [Edge Camera & Conveyor]
                                             │
                                             ▼
[React 19 Web Dashboard]  ◄───►  [Node.js Gateway / Express]  ◄───►  [FastAPI AI Service]
[Flutter Mobile App]                  │             │                   │
                                      ▼             ▼                   ▼
                                [PostgreSQL]    [AWS S3]      [YOLOv8 + EfficientNet]
                                  (Prisma)     (Raw Images)      (ONNX Runtime)
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js**: v20+ or v24 LTS
- **Python**: v3.10+
- **PostgreSQL**: v16+ (or Supabase)
- **Docker** (optional for containerized deployment)

### 2. Full-Stack Setup in 3 Commands

```bash
# 1. Install dependencies
npm run install:all

# 2. Setup database and migrations
cd backend && npm run prisma:migrate && npm run prisma:seed && cd ..

# 3. Start development servers
npm run dev
```

---

## 📦 Project Structure
```
sih/
├── backend/          # Node.js + TypeScript + Express REST & WebSocket API
├── frontend/         # React 19 + Vite + TailwindCSS + Lucide Icons Dashboard
├── ai/               # YOLOv8 + OpenCV + FastAPI Inference Engine
├── docs/             # Technical architecture, API specs & deployment guides
├── docker/           # Dockerfiles and Nginx reverse proxy configs
└── scripts/          # Automation scripts for database seeding & dev runner
```

---

## 📄 License
Distributed under the MIT License. See [LICENSE](LICENSE) for details.
