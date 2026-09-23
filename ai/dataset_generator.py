"""
Synthetic Onion Image & Defect Annotation Generator.
Used for domain augmentation under varying conveyor lighting conditions.
"""

import os
import random

def generate_synthetic_metadata(num_samples=100):
    dataset = []
    defects = ["healthy", "black_mold", "neck_rot", "sprouted", "skin_crack", "sun_scald"]
    
    for i in range(num_samples):
        sample = {
            "image_id": f"SYN_ONION_{i+1:05d}",
            "diameter_mm": round(random.uniform(32.0, 88.0), 1),
            "defect": random.choices(defects, weights=[0.55, 0.10, 0.08, 0.12, 0.10, 0.05])[0],
            "confidence": round(random.uniform(0.88, 0.99), 3),
            "lighting_lux": random.randint(450, 1200)
        }
        dataset.append(sample)
    
    return dataset

if __name__ == "__main__":
    data = generate_synthetic_metadata(20)
    print(f"Generated {len(data)} synthetic evaluation records.")
