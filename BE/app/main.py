from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from sqlalchemy import text
from .core.config import settings
from .core.database import engine, Base
from .modules.auth.router import router as auth_router
from .modules.users.router import router as users_router
from .modules.gym.router import router as gym_router, owner_router as gym_owner_router
from .modules.food.router import router as food_router
from .modules.gear.router import router as gear_router
from .modules.gamification.router import router as gamification_router
from .modules.fitcoin.router import router as fitcoin_router
from .modules.social.router import router as social_router
from .modules.notifications.router import router as notif_router
from .modules.ai_coaching.router import router as ai_router
from .modules.delivery.router import router as delivery_router
from .modules.guests.router import router as guests_router

# Import all models so Base.metadata is populated before create_all
from .modules.users.model import User, FitnessPassport, Follow  # noqa
from .modules.auth.model import GuestOTP  # noqa
from .modules.gym.model import Gym, GymMembership, WorkoutSession, ExerciseLog, GymAnnouncement  # noqa
from .modules.food.model import FoodProduct, FoodOrder, FoodReview  # noqa
from .modules.gear.model import GearItem, GearLifecycle, GearTransaction  # noqa
from .modules.gamification.model import Challenge, UserChallenge, Badge  # noqa
from .modules.fitcoin.model import FitcoinTransaction  # noqa
from .modules.social.model import SocialPost  # noqa
from .modules.notifications.model import Notification  # noqa
from .modules.delivery.model import ShippingAddress  # noqa
from .modules.guests.model import Guest, Voucher, GuestVoucher  # noqa


# Columns added by later migrations that may be missing from tables created by
# an earlier create_all run. create_all never ALTERs existing tables, so we
# reconcile these idempotently on startup (Postgres only — SQLite tests build
# the full schema from the models directly).
_COLUMN_BACKFILL = [
    "ALTER TABLE food_orders ADD COLUMN IF NOT EXISTS guest_id INTEGER",
    "ALTER TABLE food_orders ADD COLUMN IF NOT EXISTS applied_voucher_id INTEGER",
    "ALTER TABLE food_orders ADD COLUMN IF NOT EXISTS discount_amount NUMERIC(10, 2) DEFAULT 0",
]


async def _backfill_columns(conn):
    if engine.dialect.name != "postgresql":
        return
    for stmt in _COLUMN_BACKFILL:
        await conn.execute(text(stmt))


@asynccontextmanager
async def lifespan(app: FastAPI):
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        from .seed import seed_database
        await seed_database(conn)
    # Reconcile drifted columns in a separate transaction so a failure here can
    # never roll back create_all/seed or prevent the app from starting.
    try:
        async with engine.begin() as conn:
            await _backfill_columns(conn)
    except Exception as exc:  # pragma: no cover - defensive startup guard
        print(f"[startup] column backfill skipped: {exc}")
    yield


app = FastAPI(
    title="FitFuel+ API",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    redirect_slashes=False,
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


def _cors_headers():
    """CORS headers to inject directly into error responses.
    CORSMiddleware cannot add headers to 500 errors because Starlette's
    ServerErrorMiddleware intercepts them first at the outermost layer.
    """
    return {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "*",
        "Access-Control-Allow-Methods": "*",
    }


@app.exception_handler(Exception)
async def global_handler(request: Request, exc: Exception):
    if isinstance(exc, HTTPException):
        if isinstance(exc.detail, dict):
            return JSONResponse(
                status_code=exc.status_code,
                content={
                    "success": False,
                    "error": exc.detail.get("error", "HTTP_ERROR"),
                    "message": exc.detail.get("message", str(exc.detail)),
                    "detail": exc.detail
                },
                headers=_cors_headers(),
            )
        return JSONResponse(
            status_code=exc.status_code,
            content={"success": False, "error": "HTTP_ERROR", "message": exc.detail, "detail": None},
            headers=_cors_headers(),
        )
    return JSONResponse(
        status_code=500,
        content={"success": False, "error": "INTERNAL_ERROR", "message": str(exc), "detail": None},
        headers=_cors_headers(),
    )


@app.exception_handler(RequestValidationError)
async def validation_handler(request: Request, exc: RequestValidationError):
    return JSONResponse(
        status_code=422,
        content={"success": False, "error": "VALIDATION_ERROR", "message": str(exc.errors()), "detail": exc.errors()},
        headers=_cors_headers(),
    )


@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    if isinstance(exc.detail, dict):
        return JSONResponse(
            status_code=exc.status_code,
            content={
                "success": False,
                "error": exc.detail.get("error", "HTTP_ERROR"),
                "message": exc.detail.get("message", str(exc.detail)),
                "detail": exc.detail
            },
            headers=_cors_headers(),
        )
    return JSONResponse(
        status_code=exc.status_code,
        content={"success": False, "error": "HTTP_ERROR", "message": exc.detail, "detail": None},
        headers=_cors_headers(),
    )


app.include_router(auth_router, prefix="/api/auth", tags=["Auth"])
app.include_router(users_router, prefix="/api/users", tags=["Users"])
app.include_router(gym_router, prefix="/api/gym", tags=["Gym"])
app.include_router(gym_owner_router, prefix="/api/gym-owner", tags=["Gym Owner"])
app.include_router(food_router, prefix="/api/food", tags=["Food"])
app.include_router(gear_router, prefix="/api/gear", tags=["Gear"])
app.include_router(gamification_router, prefix="/api/gamification", tags=["Gamification"])
app.include_router(fitcoin_router, prefix="/api/fitcoin", tags=["FitCoin"])
app.include_router(social_router, prefix="/api/social", tags=["Social"])
app.include_router(notif_router, prefix="/api/notifications", tags=["Notifications"])
app.include_router(ai_router, prefix="/api/ai", tags=["AI Coaching"])
app.include_router(delivery_router, prefix="/api/delivery", tags=["Delivery"])
app.include_router(guests_router)


@app.api_route("/", methods=["GET", "HEAD"], tags=["Health"])
async def root():
    return {"status": "ok", "message": "FitFuel+ API is running"}


@app.get("/health", tags=["Health"])
async def health():
    return {"status": "ok", "version": "1.1.0-care-queue"}
