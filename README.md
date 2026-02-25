# 🚗 Real-Time Drowsiness Detection System

A real-time computer vision–based driver safety system that detects **drowsiness and yawning** using a live webcam feed and alerts the driver with an alarm sound.

---

## 📌 Project Description

Driver fatigue is one of the major causes of road accidents worldwide.  
This project uses **facial landmark detection** and **eye aspect ratio (EAR)** to monitor a driver’s alertness level in real-time.

If signs of drowsiness or frequent yawning are detected, the system immediately triggers an alert sound to wake the driver.

---

## 🎯 Motivation

According to road safety statistics:

- Thousands of accidents occur due to drowsy driving.
- Many cases go unreported because fatigue is difficult to measure.

This project aims to reduce such risks by implementing an intelligent monitoring system using Computer Vision.

---

## 🧠 How the System Works

1. Captures live video stream from the webcam.
2. Detects the face using Haar Cascade classifier.
3. Detects facial landmarks using Dlib’s 68-point predictor.
4. Calculates:
   - Eye Aspect Ratio (EAR)
   - Mouth Aspect Ratio (MAR)
5. If:
   - EAR falls below threshold → Drowsiness detected
   - MAR exceeds threshold → Yawning detected
6. Plays an alarm sound when fatigue is detected.

---

## 🛠️ Technologies Used

- Python
- OpenCV
- Dlib
- NumPy
- Haar Cascade Classifier
- Facial Landmark Detection (68-point model)

---

## 📂 Project Structure

```
Realtime-Drowsiness-Detection/
│
├── drowsiness_yawn.py
├── haarcascade_frontalface_default.xml
├── shape_predictor_68_face_landmarks.dat
├── Alert.wav
├── requirements.txt
└── README.md
```

---

## ⚙️ Installation Guide

### 1️⃣ Clone the Repository

```
git clone https://github.com/UdayKushwah24/AI-based-driver-safety-risk-prediction.git
```

### 2️⃣ Navigate to the Project Folder

```
cd Realtime-Drowsiness-Detection
```

### 3️⃣ Install Required Libraries

```
pip install -r requirements.txt
```

### 4️⃣ Run the Application

```
python drowsiness_yawn.py
```

Make sure your webcam is connected and enabled.

---

## 🔔 Output

- Real-time video monitoring
- Live fatigue detection
- On-screen warning messages
- Alarm sound when drowsiness is detected

---

## 🚀 Future Enhancements

- Deep learning–based eye state classification
- Mobile app integration
- Cloud-based driver monitoring
- Integration with IoT-based vehicle systems
- Dashboard analytics for fleet management

---

## 📊 Applications

- Smart Vehicles
- Fleet Management Systems
- AI-Based Driver Monitoring
- Road Safety Systems

---

## 👨‍💻 Author

**Uday Kushwah**  
B.Tech (AIML) Student  
Passionate about Artificial Intelligence & Computer Vision

---

 
