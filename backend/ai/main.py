import logging
import time
import cv2
import numpy as np
import random
import base64
from fastapi import FastAPI, File, UploadFile, HTTPException, Form
from pydantic import BaseModel
from typing import List, Optional

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("onion-ai-multi-stage")

app = FastAPI(title="SIH26031 - Onion AI Pipeline")

# ── Response Models ───────────────────────────────────────────────────────────

class BoundingBox(BaseModel):
    xMin: float
    yMin: float
    xMax: float
    yMax: float

class OnionAnalysis(BaseModel):
    id: str
    bbox: BoundingBox
    size: str
    qualityClass: str
    disease: Optional[str] = None
    diseaseConfidence: float
    severity: str
    grade: str

class BatchQualityReport(BaseModel):
    totalOnions: int
    healthyCount: int
    damagedCount: int
    rottenCount: int
    sproutedCount: int
    undersizedCount: int
    gradeAPercentage: int
    ursPercentage: int
    qualityScore: int
    primaryDiseaseDetected: Optional[str] = None
    overallRiskLevel: str
    recommendations: List[str]

class PredictionResponse(BaseModel):
    qualityGatePassed: bool
    qualityGateMessage: str
    batchReport: Optional[BatchQualityReport] = None
    onions: List[OnionAnalysis] = []
    processedImage: Optional[str] = None
    processingTimeMs: int

# ── Phase 4: Image Quality Gate ───────────────────────────────────────────────

def check_image_quality(img: np.ndarray) -> tuple[bool, str]:
    # Blur detection
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    blur_val = cv2.Laplacian(gray, cv2.CV_64F).var()
    if blur_val < 30:
        return False, "Image quality too low (Blurry). Please move closer and keep onion in focus."
    
    # Brightness detection
    mean_brightness = np.mean(gray)
    if mean_brightness < 40:
        return False, "Image quality too low (Too dark). Please use natural light."
    if mean_brightness > 240:
        return False, "Image quality too low (Overexposed). Please avoid harsh direct light."

    return True, "Image passed quality gate."

# ── Phase 1-7: AI Pipeline (Mock Implementation) ──────────────────────────────

def run_multi_stage_pipeline(img: np.ndarray) -> tuple[List[dict], str]:
    h, w = img.shape[:2]
    num_onions = random.randint(1, 4)
    onions = []
    
    annotated = img.copy()

    for i in range(num_onions):
        # 1. Detect Onion
        x_min = round(random.uniform(0.05, 0.7), 2)
        y_min = round(random.uniform(0.05, 0.7), 2)
        width = round(random.uniform(0.15, 0.4), 2)
        height = round(random.uniform(0.15, 0.4), 2)
        x_max = min(1.0, x_min + width)
        y_max = min(1.0, y_min + height)
        
        # 2. Size Estimation
        size = random.choice(["Small", "Medium", "Large"])
        
        # 3. Quality Detection
        quality_classes = ["Healthy", "Damaged", "Rotten", "Sprouted", "Undersized"]
        q_class = random.choices(quality_classes, weights=[60, 15, 10, 10, 5])[0]
        
        # 4. Disease Detection
        disease = None
        conf = 0.0
        severity = "Low"
        
        if q_class in ["Damaged", "Rotten"]:
            diseases = ["Black_Fungus", "Purple_Blotch", "Downy_Mildew", "Stemphylium_Blight", "Botrytis"]
            conf = random.uniform(0.4, 0.98)
            if conf < 0.60:
                disease = "Uncertain Result"
            else:
                disease = random.choice(diseases)
                if conf > 0.85: severity = "High"
                elif conf > 0.75: severity = "Medium"
        
        # 5. Grading
        grade = "A" if q_class == "Healthy" else "URS"
        
        onion_data = {
            "id": f"ONION-{(i+1):02d}",
            "bbox": {"xMin": x_min, "yMin": y_min, "xMax": x_max, "yMax": y_max},
            "size": size,
            "qualityClass": q_class,
            "disease": disease,
            "diseaseConfidence": conf,
            "severity": severity,
            "grade": grade
        }
        onions.append(onion_data)
        
        # Draw bounding box
        x1, y1 = int(x_min * w), int(y_min * h)
        x2, y2 = int(x_max * w), int(y_max * h)
        color = (0, 200, 0) if grade == "A" else (0, 0, 200)
        cv2.rectangle(annotated, (x1, y1), (x2, y2), color, 3)
        label = f"{onion_data['id']}: {grade}"
        cv2.putText(annotated, label, (x1 + 5, y1 - 5), cv2.FONT_HERSHEY_SIMPLEX, 0.6, (255, 255, 255), 2, cv2.LINE_AA)

    _, buffer = cv2.imencode(".jpg", annotated)
    b64 = base64.b64encode(buffer).decode("utf-8")
    processed_image = f"data:image/jpeg;base64,{b64}"
    
    return onions, processed_image

def generate_batch_report(onions: List[dict], context: dict = None) -> dict:
    total = len(onions)
    healthy = sum(1 for o in onions if o["qualityClass"] == "Healthy")
    damaged = sum(1 for o in onions if o["qualityClass"] == "Damaged")
    rotten = sum(1 for o in onions if o["qualityClass"] == "Rotten")
    sprouted = sum(1 for o in onions if o["qualityClass"] == "Sprouted")
    undersized = sum(1 for o in onions if o["qualityClass"] == "Undersized")
    
    grade_a = sum(1 for o in onions if o["grade"] == "A")
    grade_a_pct = int((grade_a / total) * 100) if total > 0 else 0
    urs_pct = 100 - grade_a_pct
    
    score = max(0, 100 - (damaged*5) - (rotten*10) - (sprouted*8) - (undersized*3))
    
    diseases_found = [o["disease"] for o in onions if o["disease"] and o["disease"] != "Uncertain Result"]
    primary_disease = diseases_found[0] if diseases_found else None
    
    # Calculate visual risk
    visual_risk = "High" if rotten > 0 or diseases_found else "Medium" if damaged > 0 else "Low"
    
    # Calculate environmental risk
    env_risk = "Low"
    if context:
        stage = context.get('cropStage', '')
        rainfall = context.get('rainfall', '')
        if rainfall == 'High (Recent)' and stage == 'Growing (Field)':
            env_risk = "High"
        elif rainfall == 'High (Recent)' or stage == 'Storage (1+ Month)':
            env_risk = "Medium"
    
    # Overall risk combination
    risk_map = {"Low": 0, "Medium": 1, "High": 2}
    max_risk = max(risk_map[visual_risk], risk_map[env_risk])
    risk = ["Low", "Medium", "High"][max_risk]
    
    recs = []
    if primary_disease:
        recs.append(f"🔴 HIGH PRIORITY: Separate onions affected by {primary_disease} immediately.")
    if rotten > 0:
        recs.append("🔴 HIGH PRIORITY: Remove visibly rotten material to prevent spreading.")
    
    if env_risk == "High" or env_risk == "Medium":
        recs.append("Management: Reduce excess moisture and improve ventilation.")
    
    if risk == "High":
        recs.append("When to consult an expert: If symptoms continue spreading, consult a qualified agricultural expert.")
        
    if not recs:
        recs.append("Prevention: Maintain appropriate storage conditions and inspect batches regularly.")
        recs.append("Batch looks good. Store in cool, dry conditions.")
        
    return {
        "totalOnions": total,
        "healthyCount": healthy,
        "damagedCount": damaged,
        "rottenCount": rotten,
        "sproutedCount": sprouted,
        "undersizedCount": undersized,
        "gradeAPercentage": grade_a_pct,
        "ursPercentage": urs_pct,
        "qualityScore": score,
        "primaryDiseaseDetected": primary_disease,
        "overallRiskLevel": risk,
        "recommendations": recs
    }

# ── API Endpoint ──────────────────────────────────────────────────────────────

@app.post("/predict", response_model=PredictionResponse)
async def predict(image: UploadFile = File(...), context: Optional[str] = Form(None)):
    start_time = time.time()
    try:
        img_bytes = await image.read()
        nparr = np.frombuffer(img_bytes, np.uint8)
        img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        if img is None:
            raise ValueError("Invalid image")
    except Exception as e:
        logger.error(f"Decode error: {e}")
        raise HTTPException(status_code=400, detail="Invalid image format")

    # Parse context
    context_data = None
    if context:
        import json
        try:
            context_data = json.loads(context)
        except Exception:
            pass

    # Gate
    passed, msg = check_image_quality(img)
    if not passed:
        return PredictionResponse(
            qualityGatePassed=False,
            qualityGateMessage=msg,
            processingTimeMs=int((time.time() - start_time) * 1000)
        )

    # Pipeline
    onions, processed_image = run_multi_stage_pipeline(img)
    report = generate_batch_report(onions, context_data)

    return PredictionResponse(
        qualityGatePassed=True,
        qualityGateMessage=msg,
        batchReport=report,
        onions=onions,
        processedImage=processed_image,
        processingTimeMs=int((time.time() - start_time) * 1000)
    )

@app.get("/health")
async def health():
    return {"status": "ok"}
