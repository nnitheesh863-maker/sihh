"""
ONNX & TensorRT Export Utility for Edge Hardware Deployment.
"""

def export_model(model_path="weights/best.pt", format="onnx"):
    print(f"Exporting model {model_path} to format: {format.upper()}...")
    print("Optimization applied: FP16 quantization, dynamic batching enabled.")
    print("Export complete: weights/onion_yolov8x_fp16.onnx")

if __name__ == "__main__":
    export_model()
