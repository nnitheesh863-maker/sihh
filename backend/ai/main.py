"""
SIH26031 – AI Onion Grading Service
Python FastAPI + YOLOv8 + EfficientNet + OpenCV

Pipeline:
1. Receive image via POST /predict
2. OpenCV – preprocess (background removal, resize, normalize)
3. YOLOv8 – detect defects (rot, sprout, cuts, black spots)
4. EfficientNet – classify overall quality
5. Compute final grade (A/B/C/REJECTED) and score
6. Return structured JSON + annotated image
"""

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from typing import List, Optional
import numpy as np
import cv2
import io
import base64
import time
import logging
import os
import random  # DEMO: replace with real model inference

# ── Logging ──────────────────────────────────────────────────────────────────
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("onion-ai")

# ── FastAPI app ───────────────────────────────────────────────────────────────
app = FastAPI(
    title="SIH26031 – Onion AI Grading Service",
    description="YOLOv8 + EfficientNet powered onion quality analysis",
    version="1.0.0",
)

# ── Response Models ───────────────────────────────────────────────────────────

class Defect(BaseModel):
    type: str
    confidence: float
    areaPercentage: Optional[float] = None


class PredictionResponse(BaseModel):
    grade: str
    score: float
    size: str
    freshness: str
    damage: str
    recommendation: str
    defects: List[Defect]
    processedImage: str  # base64 or S3 URL
    modelVersion: str
    processingTimeMs: int


# ── Model Loading (lazy singleton) ───────────────────────────────────────────

_yolo_model = None
_efficientnet_model = None

def get_yolo_model():
    """Load YOLOv8 model once (singleton)."""
    global _yolo_model
    if _yolo_model is None:
        try:
            from ultralytics import YOLO
            model_path = os.getenv("YOLO_MODEL_PATH", "models/onion_defect_yolov8n.pt")
            if os.path.exists(model_path):
                _yolo_model = YOLO(model_path)
                logger.info(f"YOLOv8 model loaded from {model_path}")
            else:
                logger.warning("YOLOv8 model not found, running in DEMO mode")
        except ImportError:
            logger.warning("ultralytics not installed, running in DEMO mode")
    return _yolo_model


def get_efficientnet_model():
    """Load EfficientNet model once (singleton)."""
    global _efficientnet_model
    if _efficientnet_model is None:
        try:
            import torch
            from torchvision import models
            model_path = os.getenv("EFFICIENTNET_MODEL_PATH", "models/onion_quality_efficientnet.pth")
            if os.path.exists(model_path):
                _efficientnet_model = torch.load(model_path, map_location="cpu")
                _efficientnet_model.eval()
                logger.info("EfficientNet model loaded")
            else:
                logger.warning("EfficientNet model not found, running in DEMO mode")
        except ImportError:
            logger.warning("torch not installed, running in DEMO mode")
    return _efficientnet_model


# ── Image Processing ──────────────────────────────────────────────────────────

def preprocess_image(image_bytes: bytes) -> np.ndarray:
    """Decode and preprocess the image using OpenCV."""
    nparr = np.frombuffer(image_bytes, np.uint8)
    img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    if img is None:
        raise ValueError("Could not decode image")

    # Resize to standard dimension
    img_resized = cv2.resize(img, (640, 640))

    # Histogram equalization for better contrast
    img_yuv = cv2.cvtColor(img_resized, cv2.COLOR_BGR2YUV)
    img_yuv[:, :, 0] = cv2.equalizeHist(img_yuv[:, :, 0])
    img_eq = cv2.cvtColor(img_yuv, cv2.COLOR_YUV2BGR)

    return img_eq


def detect_defects_yolo(img: np.ndarray) -> List[dict]:
    """Run YOLOv8 defect detection. Falls back to demo mode if model unavailable."""
    yolo = get_yolo_model()

    if yolo is not None:
        results = yolo(img, conf=0.25, iou=0.45)
        defects = []
        names = yolo.names
        for r in results:
            for box in r.boxes:
                cls = int(box.cls[0])
                conf = float(box.conf[0])
                defects.append({
                    "type": names[cls],
                    "confidence": round(conf, 4),
                    "areaPercentage": None,
                })
        return defects

    # ── DEMO fallback ──
    possible_defects = ["Rot", "Sprout", "Cut", "BlackSpot", "Bruise", "Mold"]
    num_defects = random.randint(0, 3)
    return [
        {
            "type": random.choice(possible_defects),
            "confidence": round(random.uniform(0.02, 0.35), 4),
            "areaPercentage": round(random.uniform(1, 15), 2),
        }
        for _ in range(num_defects)
    ]


def classify_quality_efficientnet(img: np.ndarray) -> dict:
    """Run EfficientNet quality classification. Falls back to demo mode."""
    model = get_efficientnet_model()

    if model is not None:
        import torch
        from torchvision import transforms
        transform = transforms.Compose([
            transforms.ToPILImage(),
            transforms.Resize((224, 224)),
            transforms.ToTensor(),
            transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225]),
        ])
        tensor = transform(img).unsqueeze(0)
        with torch.no_grad():
            output = model(tensor)
            probs = torch.softmax(output, dim=1)
            grade_idx = probs.argmax().item()
            score = float(probs.max()) * 100

        grade_map = {0: "A", 1: "B", 2: "C", 3: "REJECTED"}
        return {
            "score": round(score, 2),
            "grade": grade_map.get(grade_idx, "C"),
        }

    # ── DEMO fallback ──
    score = round(random.uniform(55, 98), 2)
    if score >= 85:
        grade = "A"
    elif score >= 70:
        grade = "B"
    elif score >= 50:
        grade = "C"
    else:
        grade = "REJECTED"
    return {"score": score, "grade": grade}


def compute_final_result(
    quality: dict,
    defects: List[dict],
) -> dict:
    """Compute freshness, damage level, size, and recommendation from AI outputs."""
    score = quality["score"]
    grade = quality["grade"]
    total_defect_conf = sum(d["confidence"] for d in defects)

    # Freshness based on score
    if score >= 80:
        freshness = "HIGH"
    elif score >= 60:
        freshness = "MEDIUM"
    else:
        freshness = "LOW"

    # Damage based on defect confidence sum
    if total_defect_conf < 0.1:
        damage = "LOW"
    elif total_defect_conf < 0.4:
        damage = "MEDIUM"
    else:
        damage = "HIGH"

    # Size estimation (demo: could use contour area)
    size_choices = ["Small", "Medium", "Large"]
    size = random.choice(size_choices)

    # Recommendation
    if grade in ("A", "B"):
        recommendation = "ACCEPT"
    elif grade == "C":
        recommendation = "CONDITIONAL_ACCEPT"
    else:
        recommendation = "REJECT"

    return {
        "freshness": freshness,
        "damage": damage,
        "size": size,
        "recommendation": recommendation,
    }


def annotate_image(img: np.ndarray, grade: str, score: float) -> str:
    """Draw grade overlay on image and return as base64."""
    annotated = img.copy()
    color = (0, 200, 0) if grade == "A" else (0, 165, 255) if grade == "B" else (0, 0, 200)
    cv2.putText(
        annotated,
        f"Grade: {grade} | Score: {score:.1f}",
        (20, 40),
        cv2.FONT_HERSHEY_SIMPLEX,
        1.0,
        color,
        2,
        cv2.LINE_AA,
    )
    _, buffer = cv2.imencode(".jpg", annotated)
    b64 = base64.b64encode(buffer).decode("utf-8")
    return f"data:image/jpeg;base64,{b64}"


# ── API Endpoints ─────────────────────────────────────────────────────────────

@app.get("/health")
async def health():
    return {"status": "healthy", "service": "onion-ai", "version": "1.0.0"}


@app.post("/predict", response_model=PredictionResponse)
async def predict(image: UploadFile = File(...)):
    """
    Full AI pipeline: preprocess → YOLOv8 defect detection → EfficientNet grading.
    """
    if not image.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")

    start_time = time.time()

    try:
        image_bytes = await image.read()
        img = preprocess_image(image_bytes)
    except Exception as e:
        logger.error(f"Image preprocessing failed: {e}")
        raise HTTPException(status_code=400, detail=f"Image processing error: {str(e)}")

    try:
        defects = detect_defects_yolo(img)
        quality = classify_quality_efficientnet(img)
        final = compute_final_result(quality, defects)
        processed_image = annotate_image(img, quality["grade"], quality["score"])
    except Exception as e:
        logger.error(f"AI inference failed: {e}")
        raise HTTPException(status_code=500, detail=f"AI inference error: {str(e)}")

    processing_time_ms = int((time.time() - start_time) * 1000)

    logger.info(
        f"Prediction complete: grade={quality['grade']}, score={quality['score']}, "
        f"defects={len(defects)}, time={processing_time_ms}ms"
    )

    return PredictionResponse(
        grade=quality["grade"],
        score=quality["score"],
        size=final["size"],
        freshness=final["freshness"],
        damage=final["damage"],
        recommendation=final["recommendation"],
        defects=[Defect(**d) for d in defects],
        processedImage=processed_image,
        modelVersion="1.0.0",
        processingTimeMs=processing_time_ms,
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
