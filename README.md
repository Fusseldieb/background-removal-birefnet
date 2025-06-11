# Background Removal Application

This application allows users to remove backgrounds from images using a BiRefNet model.

## Structure
- `frontend/`: React application with Tailwind CSS
- `backend/`: FastAPI server with ML model

## Features
- Upload images from device
- Input image URLs
- Remove background with AI
- Download images

## Setup Instructions
1. Start the backend: `cd backend && pip install -r requirements.txt && uvicorn main:app --reload`
2. Start the frontend: `cd frontend && npm install && npm start`
