# from fastapi import FastAPI, File, UploadFile
# from PIL import Image
# import torch
# import timm
# import torch.nn as nn
# from torchvision import transforms
# import io

# app = FastAPI()

# device = torch.device("cpu")

# model = timm.create_model("efficientnet_b0", pretrained=False, num_classes=2)
# model.load_state_dict(torch.load("fog_model.pth", map_location=device))
# model.eval()

# transform = transforms.Compose([
#     transforms.Resize((224,224)),
#     transforms.ToTensor(),
#     transforms.Normalize([0.5],[0.5])
# ])

# @app.post("/predict")
# async def predict(file: UploadFile = File(...)):
#     contents = await file.read()
#     image = Image.open(io.BytesIO(contents)).convert("RGB")

#     img_tensor = transform(image).unsqueeze(0)

#     with torch.no_grad():
#         output = model(img_tensor)
#         prob = torch.softmax(output, dim=1)
#         confidence = prob.max().item()
#         _, pred = torch.max(output, 1)

#     label = "Clear" if pred.item() == 0 else "Fog/Smog"

#     return {
#         "prediction": label,
#         "confidence": round(confidence * 100, 2)
#     }



















# update code ====================================================================================

# ============================================================
# FOG DETECTION ML PROJECT (COMPLETE SINGLE FILE)
# ============================================================
# Author: You 😎
# Description:
# This project detects fog in images using CNN.
# Includes training, evaluation, prediction, logging, and utilities.
# ============================================================

# ===================== IMPORTS ===============================

import os
import cv2
import sys
import time
import random
import logging
import numpy as np
import tensorflow as tf
import matplotlib.pyplot as plt

from datetime import datetime
from tensorflow.keras.models import Sequential, load_model
from tensorflow.keras.layers import Conv2D, MaxPooling2D, Flatten, Dense, Dropout
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.callbacks import ModelCheckpoint, EarlyStopping

# ===================== GLOBAL CONFIG =========================

BASE_DIR = os.getcwd()
DATA_DIR = os.path.join(BASE_DIR, "data")
MODEL_PATH = os.path.join(BASE_DIR, "fog_model.h5")
LOG_FILE = os.path.join(BASE_DIR, "training.log")

IMG_SIZE = (224, 224)
BATCH_SIZE = 32
EPOCHS = 10
LEARNING_RATE = 0.001

# ===================== LOGGER SETUP ==========================

def setup_logger():
    """
    Setup logging system for debugging and tracking.
    Logs will be stored in training.log file.
    """
    logging.basicConfig(
        filename=LOG_FILE,
        level=logging.INFO,
        format="%(asctime)s - %(levelname)s - %(message)s"
    )
    logging.info("Logger initialized")

# ===================== DIRECTORY CHECK =======================

def check_directories():
    """
    Ensure required directories exist.
    """
    if not os.path.exists(DATA_DIR):
        print("❌ Data directory not found!")
        sys.exit()

    if not os.path.exists("models"):
        os.makedirs("models")

# ===================== DATA LOADING ==========================

def load_data():
    """
    Load dataset using ImageDataGenerator.
    Also performs augmentation.
    """

    logging.info("Loading data...")

    datagen = ImageDataGenerator(
        rescale=1./255,
        validation_split=0.2,
        rotation_range=15,
        zoom_range=0.1,
        horizontal_flip=True
    )

    train_data = datagen.flow_from_directory(
        DATA_DIR,
        target_size=IMG_SIZE,
        batch_size=BATCH_SIZE,
        class_mode='binary',
        subset='training'
    )

    val_data = datagen.flow_from_directory(
        DATA_DIR,
        target_size=IMG_SIZE,
        batch_size=BATCH_SIZE,
        class_mode='binary',
        subset='validation'
    )

    logging.info("Data loaded successfully")
    return train_data, val_data

# ===================== MODEL CREATION ========================

def build_model():
    """
    Build CNN model for fog detection.
    """

    logging.info("Building model...")

    model = Sequential()

    # First Convolution Layer
    model.add(Conv2D(32, (3,3), activation='relu', input_shape=(224,224,3)))
    model.add(MaxPooling2D(2,2))

    # Second Layer
    model.add(Conv2D(64, (3,3), activation='relu'))
    model.add(MaxPooling2D(2,2))

    # Third Layer
    model.add(Conv2D(128, (3,3), activation='relu'))
    model.add(MaxPooling2D(2,2))

    # Flatten
    model.add(Flatten())

    # Dense Layers
    model.add(Dense(128, activation='relu'))
    model.add(Dropout(0.5))

    # Output Layer
    model.add(Dense(1, activation='sigmoid'))

    logging.info("Model built successfully")
    return model

# ===================== MODEL SUMMARY =========================

def print_model_summary(model):
    """
    Print model architecture.
    """
    print("\n===== MODEL SUMMARY =====")
    model.summary()

# ===================== TRAINING ==============================

def train_model():
    """
    Train the CNN model.
    """

    logging.info("Training started")

    train_data, val_data = load_data()
    model = build_model()

    print_model_summary(model)

    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=LEARNING_RATE),
        loss='binary_crossentropy',
        metrics=['accuracy']
    )

    checkpoint = ModelCheckpoint(
        MODEL_PATH,
        monitor='val_accuracy',
        save_best_only=True,
        verbose=1
    )

    early_stop = EarlyStopping(
        monitor='val_loss',
        patience=3,
        restore_best_weights=True
    )

    start_time = time.time()

    history = model.fit(
        train_data,
        validation_data=val_data,
        epochs=EPOCHS,
        callbacks=[checkpoint, early_stop]
    )

    end_time = time.time()

    logging.info(f"Training completed in {end_time - start_time} seconds")

    return history

# ===================== PLOTTING ==============================

def plot_graphs(history):
    """
    Plot accuracy and loss graphs.
    """

    plt.figure()
    plt.plot(history.history['accuracy'], label='Train Accuracy')
    plt.plot(history.history['val_accuracy'], label='Validation Accuracy')
    plt.legend()
    plt.title("Accuracy Graph")

    plt.figure()
    plt.plot(history.history['loss'], label='Train Loss')
    plt.plot(history.history['val_loss'], label='Validation Loss')
    plt.legend()
    plt.title("Loss Graph")

    plt.show()

# ===================== IMAGE VALIDATION ======================

def validate_image(path):
    """
    Validate image before processing.
    """
    if not os.path.exists(path):
        print("❌ Image not found")
        return False

    if not path.lower().endswith(('.png', '.jpg', '.jpeg')):
        print("❌ Invalid image format")
        return False

    return True

# ===================== PREPROCESS ============================

def preprocess_image(path):
    """
    Convert image to model input format.
    """

    img = cv2.imread(path)
    img = cv2.resize(img, IMG_SIZE)
    img = img / 255.0

    img = np.reshape(img, (1, 224, 224, 3))

    return img

# ===================== PREDICTION ============================

def predict_image(path):
    """
    Predict fog or no fog.
    """

    if not validate_image(path):
        return

    if not os.path.exists(MODEL_PATH):
        print("❌ Train model first")
        return

    model = load_model(MODEL_PATH)

    img = preprocess_image(path)

    prediction = model.predict(img)[0][0]

    print(f"Prediction Score: {prediction}")

    if prediction > 0.5:
        print("🌫️ Fog Detected")
    else:
        print("☀️ Clear Weather")

# ===================== RANDOM TEST ===========================

def random_test():
    """
    Test model on random images from dataset.
    """

    fog_path = os.path.join(DATA_DIR, "fog")
    clear_path = os.path.join(DATA_DIR, "clear")

    fog_images = os.listdir(fog_path)
    clear_images = os.listdir(clear_path)

    img1 = random.choice(fog_images)
    img2 = random.choice(clear_images)

    print("\nTesting Fog Image:")
    predict_image(os.path.join(fog_path, img1))

    print("\nTesting Clear Image:")
    predict_image(os.path.join(clear_path, img2))

# ===================== MODEL EVALUATION ======================

def evaluate_model():
    """
    Evaluate model performance on validation set.
    """

    if not os.path.exists(MODEL_PATH):
        print("❌ Train model first")
        return

    train_data, val_data = load_data()
    model = load_model(MODEL_PATH)

    loss, acc = model.evaluate(val_data)

    print(f"\nValidation Accuracy: {acc}")
    print(f"Validation Loss: {loss}")

# ===================== MENU ================================

def menu():
    """
    CLI menu for user interaction.
    """

    while True:
        print("\n========== FOG DETECTION ==========")
        print("1. Train Model")
        print("2. Predict Image")
        print("3. Random Test")
        print("4. Evaluate Model")
        print("5. Exit")

        choice = input("Enter choice: ")

        if choice == "1":
            history = train_model()
            plot_graphs(history)

        elif choice == "2":
            path = input("Enter image path: ")
            predict_image(path)

        elif choice == "3":
            random_test()

        elif choice == "4":
            evaluate_model()

        elif choice == "5":
            print("Exiting... Goodbye sir 😄")
            break

        else:
            print("Invalid choice")

# ===================== MAIN ================================

def main():
    """
    Entry point of the application.
    """

    setup_logger()
    check_directories()

    print("🚀 Fog Detection System Started")

    menu()

# ===================== RUN ================================

if __name__ == "__main__":
    main()
