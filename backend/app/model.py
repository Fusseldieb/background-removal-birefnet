import torch
from torchvision import transforms
from typing import Union, Tuple
from PIL import Image
from transformers import AutoModelForImageSegmentation
import os
from app.loadimg import load_img

# Ensure model caching directory exists
os.makedirs(os.path.join(os.path.expanduser("~"), ".cache/huggingface"), exist_ok=True)

# Set the precision for matrix multiplication
torch.set_float32_matmul_precision("high")

# Image transformation pipeline
transform_image = transforms.Compose(
    [
        transforms.Resize((1024, 1024)),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225]),
    ]
)

class BackgroundRemover:
    def __init__(self):
        self.device = "cuda" if torch.cuda.is_available() else "cpu"
        print(f"Using device: {self.device}")
        
        # Load the BiRefNet model
        self.model = AutoModelForImageSegmentation.from_pretrained(
            "ZhengPeng7/BiRefNet", trust_remote_code=True
        )
        self.model.to(self.device)
        self.model.eval()
        
    def remove_background(self, image: Union[Image.Image, str]) -> Tuple[Image.Image, Image.Image]:
        """
        Remove background from image and return both transparent version and original.
        
        Args:
            image: Input image (PIL Image or path/URL)
            
        Returns:
            Tuple of processed image (with transparent background) and original
        """
        # Load the image
        im = load_img(image, output_type="pil")
        if im is None:
            raise ValueError("Failed to load image")
            
        im = im.convert("RGB")
        origin = im.copy()
        
        # Process the image
        processed_image = self._process(im)
        
        return processed_image, origin
    
    def _process(self, image: Image.Image) -> Image.Image:
        """
        Apply BiRefNet segmentation to remove background
        
        Args:
            image: Input RGB image
            
        Returns:
            Image with background removed (transparent)
        """
        # Save original image size
        image_size = image.size
        
        # Preprocess image
        input_images = transform_image(image).unsqueeze(0).to(self.device)
        
        # Predict mask
        with torch.no_grad():
            preds = self.model(input_images)[-1].sigmoid().cpu()
            
        pred = preds[0].squeeze()
        pred_pil = transforms.ToPILImage()(pred)
        
        # Resize mask to original image size
        mask = pred_pil.resize(image_size)
        
        # Apply mask as alpha channel
        image.putalpha(mask)
        
        return image

# Initialize the model
background_remover = BackgroundRemover()
