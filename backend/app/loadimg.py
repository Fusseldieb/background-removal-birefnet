import requests
from PIL import Image
from io import BytesIO
import os
from typing import Union, Literal, Optional

def load_img(
    img_path: Union[str, Image.Image], 
    output_type: Literal["pil", "bytes"] = "pil"
) -> Union[Image.Image, bytes, None]:
    """
    Load an image from a file path, URL, or PIL Image object.
    
    Args:
        img_path: Path to image file, URL, or PIL Image object
        output_type: Return type, either 'pil' for PIL Image or 'bytes' for byte data
        
    Returns:
        Image data in the requested format or None if loading failed
    """
    # If already PIL Image
    if isinstance(img_path, Image.Image):
        if output_type == "pil":
            return img_path
        elif output_type == "bytes":
            img_byte_arr = BytesIO()
            img_path.save(img_byte_arr, format=img_path.format or "PNG")
            return img_byte_arr.getvalue()
        return None
    
    # Handle URLs
    if img_path.startswith(("http://", "https://")):
        try:
            response = requests.get(img_path, stream=True, timeout=10)
            response.raise_for_status()
            img = Image.open(BytesIO(response.content))
            if output_type == "pil":
                return img
            elif output_type == "bytes":
                img_byte_arr = BytesIO()
                img.save(img_byte_arr, format=img.format or "PNG")
                return img_byte_arr.getvalue()
        except (requests.RequestException, IOError) as e:
            print(f"Error loading image from URL: {e}")
            return None
    
    # Handle local file paths
    elif os.path.exists(img_path):
        try:
            img = Image.open(img_path)
            if output_type == "pil":
                return img
            elif output_type == "bytes":
                img_byte_arr = BytesIO()
                img.save(img_byte_arr, format=img.format or "PNG")
                return img_byte_arr.getvalue()
        except IOError as e:
            print(f"Error loading image from path: {e}")
            return None
    
    # If neither URL nor valid file path
    print(f"Invalid image source: {img_path}")
    return None
