import cloudinary
import cloudinary.uploader
from fastapi import APIRouter, UploadFile, File, HTTPException
from app.core.config import settings

router = APIRouter()

# Cấu hình Cloudinary bằng các biến môi trường trong .env
cloudinary.config(
  cloud_name = settings.CLOUDINARY_CLOUD_NAME,
  api_key = settings.CLOUDINARY_API_KEY,
  api_secret = settings.CLOUDINARY_API_SECRET
)

@router.post("/")
async def upload_image(file: UploadFile = File(...)):
    # Validate nếu file không phải là ảnh
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail={"error": "INVALID_FILE", "message": "Chỉ chấp nhận file định dạng hình ảnh"})
    
    try:
        # Gọi SDK để upload thẳng file object lên Cloudinary
        result = cloudinary.uploader.upload(file.file)
        
        # Trả về link an toàn (secure_url) để FrontEnd lưu vào DB
        return {
            "success": True,
            "url": result.get("secure_url"),
            "public_id": result.get("public_id"),
            "format": result.get("format"),
            "width": result.get("width"),
            "height": result.get("height")
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail={"error": "UPLOAD_FAILED", "message": str(e)})
