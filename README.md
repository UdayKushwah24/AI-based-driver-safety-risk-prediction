# 🚗 AI-Based Driver Safety Risk Prediction System

An **AI-powered Driver Monitoring System** that detects unsafe driving conditions in real time using **Computer Vision and Machine Learning**.

The system analyzes the driver and environment to predict potential safety risks and alert the driver before accidents occur.

---

# 📌 Project Overview

Road accidents often occur due to **driver fatigue, yawning, and poor environmental visibility** such as fog.
This project integrates multiple AI modules to monitor driver behavior and surroundings to enhance road safety.

The system includes:

* 😴 **Drowsiness Detection**
* 🥱 **Yawning Detection**
* 🌫 **Fog Detection**
* 📊 **Driver Safety Risk Prediction**
* 📈 **Dashboard Visualization**

---

# 🧠 Technologies Used

| Technology                | Purpose                   |
| ------------------------- | ------------------------- |
| Python                    | Core Programming          |
| OpenCV                    | Image Processing          |
| MediaPipe                 | Facial Landmark Detection |
| TensorFlow / Scikit-Learn | Machine Learning          |
| Flask                     | Web Backend               |
| HTML/CSS/JavaScript       | Frontend Interface        |

---

# 📂 Project Structure

```
AI-BASED-DRIVER-SAFETY-RISK-PREDICTION
│
├── backend
│   └── Machine Learning models and backend logic
│
├── frontend
│   └── Web interface files
│
├── Dashboard
│   └── Data visualization and analytics
│
├── Drowsiness_and_Yawning_Detection
│   └── Driver fatigue detection system
│
├── fog_detection
│   └── Fog detection module
│
├── tests
│   └── Testing scripts
│
├── app.py
│   └── Main Flask application
│
├── requirements.txt
│   └── Python dependencies
│
└── README.md
```

---

# ⚙️ Installation Guide

### 1️⃣ Clone the Repository

```
git clone https://github.com/UdayKushwah24/AI-based-driver-safety-risk-prediction.git
```

### 2️⃣ Navigate to the Project

```
cd AI-based-driver-safety-risk-prediction
```

### 3️⃣ Create Virtual Environment

```
python -m venv venv
```

### 4️⃣ Activate Virtual Environment

Windows:

```
venv\Scripts\activate
```

Linux / Mac:

```
source venv/bin/activate
```

### 5️⃣ Install Dependencies

```
pip install -r requirements.txt
```

---

# ▶️ Running the Application

Start the Flask server:

```
python app.py
```

Open the browser and go to:

```
http://127.0.0.1:5000
```

---

# 🧩 System Modules

### 1️⃣ Drowsiness Detection

Detects if the driver is sleepy using **Eye Aspect Ratio (EAR)** and facial landmark analysis.

### 2️⃣ Yawning Detection

Monitors mouth movement to detect yawning patterns.

### 3️⃣ Fog Detection

Analyzes visibility conditions using image processing techniques.

### 4️⃣ Risk Prediction

Predicts the level of driver risk using machine learning models.

---

# 📊 Dashboard

The dashboard provides real-time insights including:

* Driver alertness level
* Risk prediction score
* Environmental visibility status
* System alerts

---

# 🚀 Future Enhancements

* Mobile App Integration
* GPS-based accident prediction
* Cloud deployment
* Real-time driver alert notifications
* Integration with smart vehicle systems

---

# ⭐ Support

If you found this project helpful, please give it a **⭐ star on GitHub**.
