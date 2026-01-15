# RTSP Livestream Overlay Web Application

This project is a web application that plays a livestream video from an RTSP source and allows users to create, manage, and display custom overlays on top of the video in real time.

The application converts RTSP streams to an HLS-compatible format for browser playback and provides full CRUD APIs for overlay management with persistent storage using MongoDB.

---

## Tech Stack

- Frontend: React
- Backend: Flask (Python)
- Database: MongoDB Atlas
- Video Streaming: RTSP → HLS using FFmpeg
- Overlay Interaction: Drag & Resize using react-rnd

---

## Project Structure

rtsp-overlay-app/
├── backend/
│ ├── app.py
│ ├── requirements.txt
│ ├── .env
│ └── stream/
├── frontend/
│ ├── src/
│ └── package.json
└── README.md

---

## Prerequisites

Ensure the following are installed:

- Python 3.9+
- Node.js 18+
- MongoDB Atlas account
- FFmpeg
- VLC Media Player

---

## Backend Setup (Flask + MongoDB)

1. Navigate to backend folder

cd backend

2. Install dependencies

pip install -r requirements.txt

3. Create .env file inside backend folder

MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/overlaydb?retryWrites=true&w=majority

Replace <username>, <password>, and <cluster> with MongoDB Atlas credentials.

4. Start backend server

python app.py

Expected output:

MongoDB connected successfully
Running on http://127.0.0.1:5000

---

## Frontend Setup (React)

1. Navigate to frontend folder

cd frontend

2. Install dependencies

npm install

3. Start frontend server

npm run dev

Frontend runs at:

http://localhost:5173

---

## RTSP Streaming Setup

### Create RTSP Stream using VLC

1. Open VLC Media Player
2. Media → Stream
3. Add a video file
4. Click Stream → Next
5. Choose RTSP as destination
6. Set:
   Port: 8554
   Path: /stream
7. Select profile: Video - H.264 + MP3 (MP4)
8. Click Stream

RTSP URL:

rtsp://127.0.0.1:8554/stream

Keep VLC running.

---

### Convert RTSP to HLS using FFmpeg

From backend folder:

ffmpeg -i rtsp://127.0.0.1:8554/stream -c:v libx264 -preset veryfast -tune zerolatency -f hls -hls_time 2 -hls_list_size 5 -hls_flags delete_segments stream/stream.m3u8

This generates:

- stream.m3u8
- stream0.ts, stream1.ts, etc.

Do not stop this process.

---

## Running the Application Locally

Three terminals must be running:

1. FFmpeg (RTSP → HLS)
2. Flask backend
3. React frontend

Open the application at:

http://localhost:5173

---

## How to Change the RTSP URL

1. Stop the FFmpeg process
2. Replace the RTSP URL in the FFmpeg command:

ffmpeg -i rtsp://NEW_RTSP_URL -c:v libx264 -preset veryfast -tune zerolatency -f hls stream/stream.m3u8

3. Restart FFmpeg
4. Refresh the frontend

No code changes required.

---

## API Documentation (Overlay CRUD)

Base URL:

http://localhost:5000

### Get All Overlays

GET /overlays

Response:

[
{
"_id": "65a123...",
"type": "text",
"content": "Hello World",
"x": 60,
"y": 60,
"width": 220,
"height": 50
}
]

---

### Create Overlay

POST /overlays

Request Body:

{
"type": "text",
"content": "Sample Text",
"x": 50,
"y": 50,
"width": 200,
"height": 40
}

Response:

{
"status": "created"
}

---

### Update Overlay

PUT /overlays/{id}

Request Body:

{
"x": 120,
"y": 80,
"width": 260,
"height": 60
}

Response:

{
"status": "updated"
}

---

### Delete Overlay

DELETE /overlays/{id}

Response:

{
"status": "deleted"
}

---

## User Guide

### Livestream Playback

- Video starts automatically
- Play, pause, and volume controls available
- Stream uses HLS for browser compatibility

### Overlay Management

- Enter text in input field
- Click Add Text Overlay
- Click overlay to select
- Drag to move
- Resize from corners
- Double-click to delete
- Changes are saved automatically

### Persistence

- Overlays are stored in MongoDB Atlas
- Reloading the page restores overlays

---

## Notes

- MongoDB databases and collections are created automatically on first write
- Environment variables are used for security
- This project is intended for development and demonstration

---

## Demo Video

A demo video demonstrating setup, livestream playback, and overlay management is provided separately as required.
