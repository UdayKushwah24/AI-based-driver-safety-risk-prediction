"""
╔════════════════════════════════════════════════════════════════════════════╗
║             SYSTEM ARCHITECTURE & DESIGN DOCUMENTATION                     ║
║        Complete technical design for AI Driver Safety System               ║
╚════════════════════════════════════════════════════════════════════════════╝

This document provides comprehensive technical documentation covering:
  • System architecture and component design
  • Data flow and sequences
  • Database schema relationships
  • Error handling and logging
  • Security considerations
  • Performance optimization strategies
  • Deployment architecture
  • Future scalability patterns

Version: 2.0.0
Last Updated: March 31, 2026
Status: Production Ready
"""

# ════════════════════════════════════════════════════════════════════════════
# I. SYSTEM-LEVEL ARCHITECTURE
# ════════════════════════════════════════════════════════════════════════════

"""
LAYERED ARCHITECTURE (3-TIER DESIGN)

┌─────────────────────────────────────────────────────────────────┐
│                    PRESENTATION LAYER                          │
│  • React Frontend (single-page application)                    │
│  • WebSocket real-time updates (1Hz push)                      │
│  • REST API consumption                                         │
│  • Local storage for auth tokens                               │
└──────────────────────┬──────────────────────────────────────────┘

┌──────────────────────┴──────────────────────────────────────────┐
│                     APPLICATION LAYER                          │
│  • FastAPI REST endpoints (20+ routes)                         │
│  • WebSocket handler (real-time streaming)                     │
│  • JWT authentication middleware                               │
│  • Rate limiting middleware                                    │
│  • Error handling & exception mapping                          │
│  • Request/Response validation                                 │
└──────────────────────┬──────────────────────────────────────────┘

┌──────────────────────┴──────────────────────────────────────────┐
│                    SERVICE LAYER                               │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Detection Services                                       │  │
│  │  • Drowsiness Service (EAR + MediaPipe)                 │  │
│  │  • Fog Detection Service (EfficientNet-B0)              │  │
│  │  • Accident Service (XGBoost prediction)                │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Business Logic Services                                 │  │
│  │  • Risk Engine (unified scoring)                        │  │
│  │  • Analytics Service (summary & trends)                 │  │
│  │  • Auth Service (registration, login, OTP)              │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Utility Services                                         │  │
│  │  • JWT Handler (token lifecycle)                        │  │
│  │  • Password Hash (bcrypt)                               │  │
│  │  • Logger (centralized logging)                         │  │
│  │  • Alert Player (audio notifications)                   │  │
│  └──────────────────────────────────────────────────────────┘  │
└──────────────────────┬──────────────────────────────────────────┘

┌──────────────────────┴──────────────────────────────────────────┐
│                     DATA LAYER                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Database                                                |  │
│  │  • MongoDB (document store)                             │  │
│  │  • Collections: users, alerts, events, predictions     │  │
│  │  • Indexes on frequently queried fields                 │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ ML Models (In-Memory)                                   │  │
│  │  • MediaPipe Face Landmarker (~100MB)                  │  │
│  │  • EfficientNet-B0 fog model (~85MB)                   │  │
│  │  • XGBoost accident model (~5MB)                       │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │ Input Sources                                           │  │
│  │  • Webcam stream (real-time video)                     │  │
│  │  • File uploads (image analysis)                       │  │
│  │  • API requests (structured data)                      │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
"""


# ════════════════════════════════════════════════════════════════════════════
# II. COMPONENT DESIGN PATTERNS
# ════════════════════════════════════════════════════════════════════════════

"""
DETECTION SERVICE ARCHITECTURE (Template for all detection services)

┌─────────────────────────────────────────────────────┐
│                Service Interface                    │
│  • start()        - Initialize and spawn thread    │
│  • stop()         - Graceful shutdown              │
│  • get_state()    - Return current detection state │
│  • process_image()- Analyze single image           │
└────────────────────┬────────────────────────────────┘

┌────────────────────┴────────────────────────────────┐
│              Initialization Layer                   │
│  • Load ML model from disk                          │
│  • Validate configuration parameters                │
│  • Pre-allocate memory for processing               │
│  • Setup logging and error handlers                 │
└────────────────────┬────────────────────────────────┘

┌────────────────────┴────────────────────────────────┐
│            Processing Layer                         │
│  • Input validation & normalization                 │
│  • Feature extraction (landmarks, etc.)             │
│  • ML model inference                               │
│  • Post-processing and threshold application        │
└────────────────────┬────────────────────────────────┘

┌────────────────────┴────────────────────────────────┐
│          State Management Layer                     │
│  • Update internal state with results               │
│  • Trigger alerts if thresholds exceeded            │
│  • Log events to database                           │
│  • Maintain historical context (EAR history, etc.)  │
└────────────────────┬────────────────────────────────┘

┌────────────────────┴────────────────────────────────┐
│             Output Interface                        │
│  • State dict with all metrics                      │
│  • Risk score (0-100)                               │
│  • Confidence/probability scores                    │
│  • Timestamp and metadata                           │
└─────────────────────────────────────────────────────┘
"""


# ════════════════════════════════════════════════════════════════════════════
# III. DATA FLOW SEQUENCES
# ════════════════════════════════════════════════════════════════════════════

"""
SEQUENCE 1: USER LOGIN & AUTHENTICATION

Client                  FastAPI                Auth Service            Database
   |                       |                        |                      |
   |--- POST /auth/login --->|                       |                      |
   |                       |------ Login Request --->|                      |
   |                       |                    [Hash Check]                |
   |                       |                        |--- Query User ------->|
   |                       |                        |<---- User Data -------|
   |                       |                    [Hash Validate]             |
   |                       |<--- JWT Token ---------|                       |
   |<--- 200 + Token -------|                       |                       |

[Token Contains]
{
  "sub": "user_id",
  "exp": 1704067200,  // 60 minutes from now
  "iat": 1704063600
}
"""


"""
SEQUENCE 2: RISK ASSESSMENT REQUEST

Client/Webcam     Drowsiness Service    Fog Service    Risk Engine    Database
   |                    |                    |              |            |
   |-- Real-time -->    |                    |              |            |
   | frames            [Process EAR]         |              |            |
   |                [Yawn Detection]         |              |            |
   |<-- State Reply ---|                    |              |            |
   |
   |-- Same Frame -->                     |-- Analyze --->|            |
   |   (key frame)                        |  Visibility  |            |
   |                                    [Inference]        |            |
   |                                      |<-- Prediction|            |
   |
   |                                                   [Compute Score]|
   |                         Unified Risk = (D%0.6) + (F*0.4)        |
   |                                |<---- Risk Result ---|            |
   |
   |                    (Async) Store Events -------- Write Events -->|
   |<---- 200 OK -------|
   |  {risk_score, level, drowsy, fog_pred}
"""


"""
SEQUENCE 3: FILE UPLOAD FOR FOG DETECTION

Client                FastAPI            Validation        Fog Service    Storage
   |                     |                    |                 |           |
   |-- POST /fog/upload ->|                    |                 |           |
   |   (multipart/form)   |-- Validate ------->|                 |           |
   |                     |<---- OK ------------|                 |           |
   |                     |-- Save File --------|------> File Upload
   |                     |                    |<----- Path -------|           |
   |                     |-- Infer ------->                       |           |
   |                     |            [Load->Preprocess->Run]     |           |
   |                     |<--- Prediction ---|                    |           |
   |                     |-- Response ------>|                    |           |
   |<-- 200 + Result ----|                    |                    |           |
   |  {prediction, confidence}
"""


# ════════════════════════════════════════════════════════════════════════════
# IV. DATABASE SCHEMA RELATIONSHIPS
# ════════════════════════════════════════════════════════════════════════════

"""
COLLECTION RELATIONSHIPS & INDICES

Users Collection
├─ _id (ObjectId)
├─ email (string) ← UNIQUE INDEX, used for login
├─ password_hash (string)
├─ name (string)
├─ created_at (ISODate) ← INDEX for recent users
└─ last_login (ISODate)

Alerts Collection
├─ _id (ObjectId)
├─ user_id (Foreign Key → Users._id) ← COMPOUND INDEX
├─ alert_type (enum)
├─ severity (enum) ← INDEX for filtering high-priority alerts
├─ created_at (ISODate) ← COMPOUND INDEX for recent alerts
└─ acknowledged (boolean) ← INDEX for unread alerts

Drowsiness Events
├─ _id (ObjectId)
├─ user_id (Foreign Key → Users._id) ← COMPOUND INDEX
├─ event_type (enum: drowsy|yawning)
├─ ear_score (float)
├─ timestamp (ISODate) ← COMPOUND INDEX
└─ risk_score (float) ← TEXT SEARCH on ear_score

Fog Predictions
├─ _id (ObjectId)
├─ user_id (Foreign Key → Users._id) ← COMPOUND INDEX
├─ prediction (enum: Clear|Fog)
├─ confidence (float)
├─ timestamp (ISODate) ← COMPOUND INDEX
└─ risk_score (float)

OTP Requests
├─ _id (ObjectId)
├─ email (string) ← INDEX for fast lookups
├─ otp_code (hashed)
├─ expires_at (ISODate) ← TTL INDEX (auto-delete expired)
└─ verified (boolean)


INDEX STRATEGY:
• Single Indexes: email (users), severity (alerts), confidence (fog)
• Compound Indexes: (user_id, -timestamp) for time-range queries
• Sparse Indexes: last_login (many users never logged in)
• TTL Indexes: expire OTP records automatically
• Unique Indexes: Prevent duplicate emails in users collection
"""


# ════════════════════════════════════════════════════════════════════════════
# V. ERROR HANDLING & RECOVERY
# ════════════════════════════════════════════════════════════════════════════

"""
ERROR HANDLING HIERARCHY

┌─ Application Level ─┐              ┌─ Graceful Degradation ─┐
│ Try-catch blocks    │──────────->  │ Continue with defaults │
│ Input validation    │              │ Log warning            │
│ Database retries    │              │ Notify user (optional) │
└─────────────────────┘              └────────────────────────┘

Exception Types & Recovery:

1. MODEL_ERROR (ML Model Issues)
   ├─ Model file not found
   │  └─ Recovery: Load from backup location
   ├─ Model inference crash
   │  └─ Recovery: Return cached result or default
   └─ Out of memory
      └─ Recovery: Reduce batch size, free memory

2. DATABASE_ERROR (Connection Issues)
   ├─ Connection timeout
   │  └─ Recovery: Retry with exponential backoff (3 attempts)
   ├─ Query failure
   │  └─ Recovery: Log and return empty result
   └─ Authentication failure
      └─ Recovery: Re-init connection with new credentials

3. VALIDATION_ERROR (Input Invalid)
   ├─ Invalid email format
   │  └─ Recovery: Return 400 Bad Request with error details
   ├─ Oversized file upload
   │  └─ Recovery: Return 413 Payload Too Large
   └─ Missing required field
      └─ Recovery: Return 422 Unprocessable Entity

4. AUTHENTICATION_ERROR (Auth Issues)
   ├─ Expired token
   │  └─ Recovery: Return 401 Unauthorized, user re-login
   ├─ Invalid signature
   │  └─ Recovery: Return 403 Forbidden
   └─ Missing token
      └─ Recovery: Return 401 Unauthorized

5. RATE_LIMIT_ERROR (Too Many Requests)
   └─ Recovery: Return 429 Too Many Requests, advise wait time

LOGGING STRATEGY:
- DEBUG: Detailed operation steps, variable values
- INFO: Major events (startup, login, model load)
- WARNING: Recoverable errors, degraded operation
- ERROR: Failures that impact functionality
- CRITICAL: System-wide failures
"""


# ════════════════════════════════════════════════════════════════════════════
# VI. SECURITY ARCHITECTURE
# ════════════════════════════════════════════════════════════════════════════

"""
SECURITY LAYERS & CONTROLS

┌─────────────────────────────────────┐
│        AUTHENTICATION LAYER          │
├─────────────────────────────────────┤
│ • JWT tokens (HS256 HMAC SHA-256)  │
│ • Token expiration (60 min default) │
│ • Bcrypt password hashing (cost=12)│
│ • Refresh token flow (future)       │
└──────────────┬──────────────────────┘

┌──────────────┴──────────────────────┐
│      AUTHORIZATION LAYER            │
├─────────────────────────────────────┤
│ • Route-level access control        │
│ • User ownership validation         │
│ • Role-based access (future)        │
└──────────────┬──────────────────────┘

┌──────────────┴──────────────────────┐
│     INPUT VALIDATION LAYER          │
├─────────────────────────────────────┤
│ • Email format validation          │
│ • File type/size validation        │
│ • SQL injection prevention         │
│ • XSS prevention (JSON sanitize)   │
│ • CSRF token (future)              │
└──────────────┬──────────────────────┘

┌──────────────┴──────────────────────┐
│      TRANSPORT SECURITY            │
├─────────────────────────────────────┤
│ • HTTPS/TLS recommended            │
│ • CORS restrictions                │
│ • Secure headers (X-Frame-Options) │
│ • Rate limiting (120 req/min)      │
└────────────────────────────────────┘


PASSWORD SECURITY:
- Minimum 8 characters
- Require: uppercase + lowercase + digit + special char
- Hash with bcrypt (cost factor: 12)
- Never store plaintext
- Use constant-time comparison for validation

JWT SECURITY:
- Secret key: minimum 32 characters, cryptographically random
- Algorithms: HS256 (current) or RS256 (asymmetric in future)
- Claims: sub (user_id), exp (expiration), iat (issued_at)
- Token stored in httpOnly cookie (frontend: localStorage for now)
- Validation: signature check + expiration check + algorithm check

DATA PROTECTION:
- Sensitive fields: passwords, OTP codes (stored hashed)
- Email validation: prevent fake accounts
- File uploads: validate MIME types, enforce size limits
- Database: connection with authentication, no admin creds in code
"""


# ════════════════════════════════════════════════════════════════════════════
# VII. PERFORMANCE OPTIMIZATION STRATEGIES
# ════════════════════════════════════════════════════════════════════════════

"""
PERFORMANCE PROFILE & BOTTLENECKS

Current Performance:
┌─────────────────────────────────────┐
│ Operation               │ Time      │
├────────────────────────┼──────────┤
│ Face Landmark (CPU)    │ 45ms     │  ← CRITICAL PATH
│ EAR Calculation        │ 2ms      │
│ Fog Inference (GPU)    │ 150ms    │  ← CRITICAL PATH
│ Risk Score Compute     │ 1ms      │
│ DB Query (indexed)     │ 50ms     │
│ API Response           │ 150ms    │  ← Total E2E
└─────────────────────────────────────┘

OPTIMIZATION OPPORTUNITIES:

1. Model Inference Caching
   - Cache recent fog predictions (5 min)
   - Skip inference if similar frame seen recently
   - Expected improvement: 40% reduction in fog calls

2. Batch Processing
   - Process multiple frames in single GPU batch
   - Reduces per-frame overhead
   - Future: Move to async/queue-based architecture

3. Database Indexing
   - Create indexes on (user_id, -timestamp)
   - Use sparse indexes for optional fields
   - Expected improvement: 3-5x faster queries

4. Connection Pooling
   - Reuse MongoDB connections (PyMongo handles automatically)
   - Cache JWT validation results (redis, future)
   - HTTP connection keep-alive (FastAPI default)

5. Data Compression
   - Gzip responses over 1KB (FastAPI middleware)
   - Compress model files on disk
   - Expected improvement: 60% smaller downloads

6. CPU/GPU Optimization
   - Run MediaPipe on CPU (lighter than GPU setup)
   - Run EfficientNet on GPU if available
   - Fall back to CPU gracefully
   - Use quantized models for low-power devices (future)

SCALING STRATEGIES:

Vertical Scaling (Single Machine, Higher Performance):
- Upgrade CPU/GPU for faster inference
- Increase RAM for larger model batches
- Use faster SSD for database access

Horizontal Scaling (Multiple Machines):
- Load balancer in front of multiple API instances
- Shared database (MongoDB Atlas)
- Redis for distributed caching
- Message queue (RabbitMQ) for event processing

Cloud Deployment:
- Containerize with Docker
- Deploy to Kubernetes (auto-scaling)
- Use managed database (MongoDB Atlas, AWS RDS)
- CDN for static assets
- API Gateway (AWS API Gateway, Google Cloud)
"""


# ════════════════════════════════════════════════════════════════════════════
# VIII. DEPLOYMENT ARCHITECTURE
# ════════════════════════════════════════════════════════════════════════════

"""
DEPLOYMENT TOPOLOGY

DEVELOPMENT (Local Machine)
─────────────────────────────
┌─────────────────────────────────────┐
│  Developer Laptop                   │
├─────────────────────────────────────┤
│ FastAPI (8000)                      │
│ MongoDB (27017)                     │
│ React Dev Server (5173)             │
│ Webcam input (local)                │
└─────────────────────────────────────┘


STAGING (Pre-Production)
─────────────────────────────
┌──────────────────────┐   ┌──────────────────────┐
│  Web Server (AWS)    │   │  Database (AWS RDS)  │
│ FastAPI + Gunicorn   │   │  MongoDB Aurora      │
│ Port 8000            │   │ Multi-region backup  │
│ TLS/SSL enabled      │   │ Daily backups        │
│ Monitoring enabled   │   │ Automated failover   │
└──────────────────────┘   └──────────────────────┘


PRODUCTION (Scalable)
─────────────────────────────
                    ┌──────────────────┐
                    │  Load Balancer   │
                    │  (Health checks) │
                    └────────┬─────────┘
                             │
        ┌────────────────────┼────────────────────┐
        │                    │                    │
    ┌───▼──┐             ┌───▼──┐             ┌───▼──┐
    │ API  │             │ API  │             │ API  │
    │ Pod1 │             │ Pod2 │             │ Pod3 │
    │ :8000│             │ :8000│             │ :8000│
    └──────┘             └──────┘             └──────┘
        │                    │                    │
        └────────────────────┼────────────────────┘
                             │
                    ┌────────▼────────┐
                    │  MongoDB Atlas  │
                    │  (Sharded Cluster)
                    └────────────────┘


CONTAINER ORCHESTRATION (Kubernetes)
─────────────────────────────
┌─────────────────────────────────────────────┐
│  Kubernetes Cluster                        │
├─────────────────────────────────────────────┤
│                                             │
│  ┌────────────────────────────────────┐   │
│  │  API Service (Deployment)          │   │
│  │  - replicas: 3                     │   │
│  │  - resource: cpu=500m, mem=512Mi   │   │
│  │  - autoscale: 3-10 pods            │   │
│  └────────────────────────────────────┘   │
│                                             │
│  ┌────────────────────────────────────┐   │
│  │  ConfigMap                         │   │
│  │  - Environment variables           │   │
│  └────────────────────────────────────┘   │
│                                             │
│  ┌────────────────────────────────────┐   │
│  │  Secrets                           │   │
│  │  - JWT secret, DB credentials      │   │
│  └────────────────────────────────────┘   │
│                                             │
└─────────────────────────────────────────────┘
"""


# ════════════════════════════════════════════════════════════════════════════
# IX. MONITORING & OBSERVABILITY
# ════════════════════════════════════════════════════════════════════════════

"""
MONITORING STRATEGY

KEY METRICS TO TRACK:

Application Metrics:
  • Request count (total, by endpoint)
  • Response time (p50, p95, p99)
  • Error rate by status code
  • Successful WebSocket connections
  • Avg risk score (for trend analysis)

Infrastructure Metrics:
  • CPU usage
  • Memory usage
  • Disk I/O
  • Network bandwidth
  • Database connection pool size

Model Metrics:
  • Inference latency (drowsiness, fog)
  • Model inference accuracy
  • Model prediction distribution
  • Cache hit rate

Security Metrics:
  • Failed login attempts
  • Rate limit violations
  • Invalid token attempts
  • File upload rejections

Business Metrics:
  • Daily active users
  • High-risk alert frequency
  • Avg session duration
  • Feature usage (fog detection, etc.)

Logging Framework:
┌────────────────────────────────────┐
│ Application Logs                   │
│ ├─ API request logs                │
│ ├─ Model inference logs            │
│ ├─ Database query logs             │
│ └─ Authentication logs             │
└──────────────┬─────────────────────┘
               │
        ┌──────▼────────┐
        │ Log Aggregator│ (ELK Stack in production)
        │ Elasticsearch │
        └──────┬────────┘
               │
        ┌──────▼────────┐
        │ Visualization │
        │ Kibana/Grafana│
        └───────────────┘

ALERTING (Critical Issues):
  • API response time > 5 seconds
  • Error rate > 5%
  • Database connection failure
  • Model inference crash
  • Disk space < 10%
  • CPU usage > 90% for 5 minutes
"""


# ════════════════════════════════════════════════════════════════════════════
# X. FUTURE ARCHITECTURAL ENHANCEMENTS
# ════════════════════════════════════════════════════════════════════════════

"""
PHASE 2: MICROSERVICES ARCHITECTURE (Future)

Current: Monolithic FastAPI
Problem: Single point of failure, difficult to scale individual components
Solution: Microservices with queue-based communication

┌──────────────────┐
│  API Gateway     │
│  (Authentication)│
└────────┬─────────┘
         │
    ┌────┴─────────────────────────┐
    │                              │
┌───▼──────────────┐      ┌────────▼────────┐
│ Risk Computation │      │ Detection Svc   │
│ Microservice     │      │ (Drowsiness)    │
│                  │      │                 │
│ ├─ Risk Engine   │      │ ├─ MediaPipe    │
│ ├─ Alerting      │      │ ├─ EAR Calc     │
│ └─ Analytics     │      │ └─ Yawn Detect  │
└────────┬─────────┘      └────┬────────────┘
         │                     │
    ┌────▼─────────────────────▼───┐
    │  Message Queue (RabbitMQ)    │
    │  - Risk updates              │
    │  - Detection results         │
    └────┬────────────────────────┬┘
         │                        │
    ┌────▼──────────┐      ┌─────▼────────┐
    │  Database Svc │      │  Fog Detect  │
    │  (Persistence)│      │  Microservice│
    │               │      │              │
    │ ├─ MongoDB    │      │ ├─ EfficientNet
    │ ├─ Logging    │      │ ├─ Inference │
    │ └─ Archival   │      │ └─ Caching   │
    └───────────────┘      └──────────────┘

Benefits:
- Independent scaling (fog inference can handle 10x load)
- Fault isolation (one service crashes ≠ system down)
- Technology heterogeneity (use Python + Go + Rust as needed)
- Easier testing and deployment


PHASE 3: EVENT-DRIVEN ARCHITECTURE

Current: Synchronous API calls
Future: Asynchronous event streaming

┌─────────────────────────────────────────────────┐
│  Event Stream (Kafka/Pulsar)                    │
├─────────────────────────────────────────────────┤
│                                                 │
│  Events Published:                              │
│  • frame_received                              │
│  • drowsiness_detected                         │
│  • risk_score_updated                          │
│  • alert_generated                             │
│  • user_login                                  │
│                                                 │
│  Event Subscribers:                            │
│  • AlertService (triggers notifications)       │
│  • AnalyticsService (builds reports)           │
│  • WebSocketHandler (real-time updates)       │
│  • DatabaseService (event sourcing)            │
│  • NotificationService (emails, SMS)           │
└─────────────────────────────────────────────────┘
"""

print(__doc__)
