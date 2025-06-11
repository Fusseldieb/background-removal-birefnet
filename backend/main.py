from fastapi import FastAPI, UploadFile, File, HTTPException, Form
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import uvicorn
import os
import uuid
import shutil
from PIL import Image
from io import BytesIO
import aiofiles
from app.model import background_remover
from app.loadimg import load_img
import base64

# Create app
app = FastAPI(title="Background Removal API")

# Create upload and output directories if they don't exist
UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "uploads")
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "outputs")
os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(OUTPUT_DIR, exist_ok=True)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve static files
app.mount("/images", StaticFiles(directory=OUTPUT_DIR), name="images")

@app.get("/")
async def root():
    """API health check endpoint"""
    return {"status": "online", "message": "Background Removal API is running"}

@app.post("/remove-background/upload")
async def remove_background_upload(file: UploadFile = File(...)):
    """Remove background from uploaded image file"""
    # Validate file
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    try:
        # Generate unique filenames
        filename = f"{uuid.uuid4()}"
        input_path = os.path.join(UPLOAD_DIR, filename)
        output_path = os.path.join(OUTPUT_DIR, f"{filename}.png")
        
        # Save uploaded file
        async with aiofiles.open(input_path, 'wb') as out_file:
            content = await file.read()
            await out_file.write(content)
        
        # Process image
        processed_image, _ = background_remover.remove_background(input_path)
        
        # Save processed image
        processed_image.save(output_path, format="PNG")
        
        # Return result
        return {
            "success": True,
            "filename": f"{filename}.png",
            "image_url": f"/images/{filename}.png"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        # Clean up upload
        if os.path.exists(input_path):
            os.remove(input_path)

@app.post("/remove-background/url")
async def remove_background_url(image_url: str = Form(...)):
    """Remove background from image at URL"""
    try:
        # Generate unique filename for output
        filename = f"{uuid.uuid4()}.png"
        output_path = os.path.join(OUTPUT_DIR, filename)
        
        # Process image from URL
        processed_image, _ = background_remover.remove_background(image_url)
        
        # Save processed image
        processed_image.save(output_path, format="PNG")
        
        # Return result
        return {
            "success": True,
            "filename": filename,
            "image_url": f"/images/{filename}"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/remove-background/base64")
async def remove_background_base64(image_data: str = Form(...)):
    """Remove background from base64 encoded image"""
    try:
        # Decode base64 image
        if "base64," in image_data:
            image_data = image_data.split("base64,")[1]
        
        image_bytes = base64.b64decode(image_data)
        img = Image.open(BytesIO(image_bytes))
        
        # Generate unique filename for output
        filename = f"{uuid.uuid4()}.png"
        output_path = os.path.join(OUTPUT_DIR, filename)
        
        # Process image
        processed_image, _ = background_remover.remove_background(img)
        
        # Save processed image
        processed_image.save(output_path, format="PNG")
        
        # Return result
        return {
            "success": True,
            "filename": filename,
            "image_url": f"/images/{filename}"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/images/{filename}")
async def get_image(filename: str):
    """Get processed image by filename"""
    image_path = os.path.join(OUTPUT_DIR, filename)
    if not os.path.exists(image_path):
        raise HTTPException(status_code=404, detail="Image not found")
    return FileResponse(image_path)

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
