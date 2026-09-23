# REST & WebSocket API Specification

## Base URL
`http://localhost:5000/api/v1`

## Authentication
All secured endpoints require a Bearer token in the `Authorization` header:
```
Authorization: Bearer <JWT_ACCESS_TOKEN>
```

## Endpoints

### 1. Authentication
- `POST /auth/register` - Register new farmer / Mandi inspector / admin
- `POST /auth/login` - Login and receive Access & Refresh JWTs
- `POST /auth/refresh` - Exchange Refresh Token for new Access Token
- `GET /auth/profile` - Get current authenticated user profile

### 2. Onion Batch & Grading
- `POST /batches` - Create a new sorting batch
- `GET /batches` - List batches with pagination & filter by status
- `GET /batches/:id` - Detailed batch metrics and defect breakdown
- `POST /batches/:id/assess` - Upload image/video stream for AI grading
- `GET /batches/:id/export/pdf` - Download verified AGMARK compliance certificate

### 3. Mandi Market Prices
- `GET /mandi/prices` - Live APMC Mandi price benchmarks
- `GET /mandi/trends` - 30-day historical price forecasting
- `GET /mandi/recommendation` - Optimal sell time & location recommendation

### 4. Real-time WebSockets
- `socket.on('join_batch', { batchId })` - Subscribe to live grading stream
- `socket.emit('frame_graded', { onionId, grade, defects, confidence })` - Live onion event
- `socket.emit('conveyor_telemetry', { rpm, temp, humidity, count })` - Conveyor metrics
