<<<<<<< HEAD
# Real-Time-Drowsiness-Detection-System

Drowsiness detection is a safety technology that can prevent accidents that are caused by drivers who fell asleep while driving. The objective of this project is to build a drowsiness detection system that will detect drowsiness through the implementation of computer vision system that automatically detects drowsiness in real-time from a live video stream and then alert the user with an alarm notification.

## Motivation 
According to the National Highway Traffic Safety Administration, every year about 100,000 police-reported crashes involve drowsy driving. These crashes result in more than 1,550 fatalities and 71,000 injuries. The real number may be much higher, however, as it is difficult to determine whether a driver was drowsy at the time of a crash. So, we tried to build a system, that detects whether a person is drowsy and alert him.

## Built With

* [OpenCV Library](https://opencv.org/) - Most used computer vision library. Highly efficient. Facilitates real-time image processing.
* [imutils library](https://github.com/jrosebr1/imutils) -  A collection of helper functions and utilities to make working with OpenCV easier.
* [Dlib library](http://dlib.net/) - Implementations of state-of-the-art CV and ML algorithms (including face recognition).
* [scikit-learn library](https://scikit-learn.org/stable/) - Machine learning in Python. Simple. Efficient. Beautiful, easy to use API.
* [Numpy](http://www.numpy.org/) - NumPy is the fundamental package for scientific computing with Python. 


  Made with Aman | Uday
=======
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


**Aman Kushwah**  
B.Tech (AIML) Student  
Passionate about Artificial Intelligence & Computer Vision
--- 
>>>>>>> 72f4c188d679672c7c6f7c223e53ae431c799ed0
