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

@router.post("")
async def upload_image(file: UploadFile = File(...)):
    # Validate nếu file không phải là ảnh
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail={"error": "INVALID_FILE", "message": "Chỉ chấp nhận file định dạng hình ảnh"})
    
    try:
        # Gọi SDK để upload thẳng file object lên Cloudinary
        result = cloudinary.uploader.upload(file.file)
        
        # Sử dụng sức mạnh AI của Cloudinary để tự động Crop ảnh
        transformed_url, options = cloudinary.utils.cloudinary_url(
            result.get("public_id"),
            width=800,
            height=800,
            crop="fill",       # Cắt ảnh lấp đầy khung hình (không bị viền trắng)
            gravity="auto",    # AI tự động nhận diện vật thể chính (món ăn) để focus vào giữa khung hình
            fetch_format="auto", # Tối ưu định dạng webp
            quality="auto"     # Tối ưu dung lượng
        )
        
        # Trả về link an toàn (secure_url) đã được cắt ghép chuẩn chỉnh để FrontEnd lưu vào DB
        return {
            "success": True,
            "url": transformed_url,
            "public_id": result.get("public_id"),
            "format": result.get("format"),
            "width": 800,
            "height": 800
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail={"error": "UPLOAD_FAILED", "message": str(e)})
