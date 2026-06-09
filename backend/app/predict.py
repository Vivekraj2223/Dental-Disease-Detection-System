import torch
from app.model import model, CLASS_NAMES, device
from app.utils import preprocess_image


def predict_image(image):
    input_tensor = preprocess_image(image).to(device)

    with torch.no_grad():
        outputs = model(input_tensor)

        probs = torch.softmax(outputs, dim=1)

        confidence, prediction = torch.max(probs, dim=1)

    confidence = confidence.item()

    disease = CLASS_NAMES[prediction.item()]

    if disease == "non_dental":
        return {
            "status": "Invalid Image / Not Dental",
            "disease": disease,
            "confidence": round(confidence * 100, 2)
        }

    if confidence < 0.80:
        return {
            "status": "Unidentified",
            "disease": "Unknown",
            "confidence": round(confidence * 100, 2)
        }

    return {
        "status": "Disease Detected",
        "disease": disease,
        "confidence": round(confidence * 100, 2)
    }