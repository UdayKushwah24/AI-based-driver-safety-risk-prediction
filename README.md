🚀 Overview

The fog detection module uses a deep learning image classification model based on EfficientNet-B0 to classify input road images into:

Fog

Clear

This helps identify hazardous driving conditions in real time and supports safer decision-making.

🧠 Model Details

Architecture: EfficientNet-B0

Framework: PyTorch

Classes: 2 (Fog / Clear)

Input size: 224 × 224

Weights file: fog_model.pth

⚙️ API Implementation

A FastAPI endpoint is provided to perform fog detection from uploaded images.

Endpoint

POST /predict


Input

Image file (road scene)

Output

{
  "prediction": "Fog",
  "confidence": 0.92
}

🛠️ How It Works

User uploads a road image

Image is resized and normalized

Tensor passed to trained EfficientNet model

Model predicts fog or clear

Result returned via API

📂 Added Files
fog/
│
├── app.py          # FastAPI fog detection API
├── fog_model.pth   # Trained model weights

▶️ Run Locally

Install dependencies:

pip install fastapi uvicorn torch torchvision timm pillow


Start server:

uvicorn app:app --reload


Open:

http://127.0.0.1:8000/docs


Upload an image to test fog detection.

🎯 Role in Driver Safety Project

Fog detection improves the main system by:

Detecting low-visibility environments

Increasing accident-risk awareness

Supporting real-time driver alerts

Enhancing environmental risk analysis
