# System Architecture & Data Flow

## 1. High-Level Architecture Overview
The system is divided into four distinct tiers:
1. **Edge Sensing Layer**: High-definition industrial RGB & Near-Infrared (NIR) line-scan cameras capturing 60 fps conveyor imagery.
2. **AI Inference Microservice**: FastAPI server hosting YOLOv8x for multi-defect segmentation and custom geometric sizing networks.
3. **Application Gateway & State Layer**: Node.js/Express service orchestrating JWT auth, batch management, telemetry, and Mandi price integration.
4. **Presentation & Action Layer**: React 19 web portal for Mandi officers/wholesalers and automated pneumatic flap actuators for physical segregation.

## 2. Data Flow Diagram
```
Camera Feed ──> Frame Ingestion (OpenCV) ──> AI Preprocessing (Letterbox/Normalize)
                                                      │
                                                      ▼
WebSocket Telemetry ◄── Grading Decision Engine ◄── YOLOv8 Inference (Bounding Boxes)
        │
        ▼
PostgreSQL / Supabase Storage (Prisma ORM)
```

## 3. Grading Standards Compliance
The grading algorithm adheres to **AGMARK Onion Grading & Marking Rules (2004)** and **Codex Alimentarius Standard for Onions (CXS 357-2023)**:
- **Grade A (Super Quality)**: Diameter 45-70mm, shape uniformity > 90%, zero mold/rot, skin layers intact (>2 layers).
- **Grade B (Standard Commercial)**: Diameter 35-45mm or 70-85mm, slight skin peeling (<15%), zero internal decay.
- **Grade C (Processing / Food Grade)**: Minor mechanical damage, slight sun scald (<10% surface), single split allowed.
- **Reject**: Visible black mold, neck rot, sprouted shoot > 5mm, severe soft rot.
