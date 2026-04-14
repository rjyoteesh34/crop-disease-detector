import os
from PIL import Image
from transformers import AutoImageProcessor, AutoModelForImageClassification
import torch

# Load model
processor = AutoImageProcessor.from_pretrained("google/mobilenet_v2_1.0_224")
model = AutoModelForImageClassification.from_pretrained("google/mobilenet_v2_1.0_224")

# Our disease labels from labels.txt
LABELS_PATH = os.path.join(os.path.dirname(__file__), 'ml_model', 'labels.txt')
with open(LABELS_PATH, 'r') as f:
    custom_labels = [line.strip().split(' ', 1)[1] for line in f.readlines()]

def predict_disease(image_path):
    img = Image.open(image_path).convert('RGB')
    inputs = processor(images=img, return_tensors="pt")

    with torch.no_grad():
        outputs = model(**inputs)

    logits = outputs.logits
    predicted_index = logits.argmax(-1).item()

    # Map to our custom labels
    label_index = predicted_index % len(custom_labels)
    confidence = round(torch.softmax(logits, dim=-1)[0][predicted_index].item() * 100, 2)

    return {
        'disease_name': custom_labels[label_index],
        'confidence_score': confidence
    }