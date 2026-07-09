import enum
from datetime import datetime
from sqlalchemy import Column, Integer, String, Boolean, Numeric, ForeignKey, Enum, Text, DateTime, Date
from sqlalchemy.orm import relationship
from sqlalchemy.types import JSON
from app.core.database import Base


class UserRole(str, enum.Enum):
    member = "member"
    vendor = "vendor"
    gym_owner = "gym_owner"


class FitnessGoal(str, enum.Enum):
    bulk = "bulk"
    cut = "cut"
    maintain = "maintain"


class User(Base):
    __tablename__ = "users"

    user_id = Column(Integer, primary_key=True, index=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    phone = Column(String(15), unique=True)
    password_hash = Column(String(255), nullable=False)
    role = Column(Enum(UserRole, name="user_role"), nullable=False, default=UserRole.member)
    display_name = Column(String(100), nullable=False)
    avatar_url = Column(String(500))
    fitness_goal = Column(Enum(FitnessGoal, name="fitness_goal"))
    xp_total = Column(Integer, default=0, nullable=False)
    current_level = Column(Integer, default=1, nullable=False)
    current_streak = Column(Integer, default=0, nullable=False)
    longest_streak = Column(Integer, default=0, nullable=False)
    fitcoin_balance = Column(Numeric(12, 2), default=0, nullable=False)
    tdee = Column(Integer)
    referred_by = Column(Integer, ForeignKey("users.user_id", ondelete="SET NULL"))
    last_active_date = Column(Date, nullable=True)
    allergens = Column(JSON, default=list, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    terms_accepted_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    passport = relationship("FitnessPassport", back_populates="user", uselist=False)
    shipping_addresses = relationship("ShippingAddress", back_populates="user", cascade="all, delete-orphan")


class FitnessPassport(Base):
    __tablename__ = "fitness_passport"

    passport_id = Column(Integer, primary_key=True)
    user_id = Column(
        Integer, ForeignKey("users.user_id", ondelete="CASCADE"), unique=True, nullable=False
    )
    total_sessions = Column(Integer, default=0, nullable=False)
    total_volume = Column(Numeric(12, 2), default=0, nullable=False)
    longest_streak = Column(Integer, default=0, nullable=False)
    body_weight_log = Column(JSON, default=list)
    body_photos = Column(JSON, default=list)
    milestone_badges = Column(JSON, default=list)
    is_public = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)

    user = relationship("User", back_populates="passport")


class Follow(Base):
    __tablename__ = "follows"

    follower_id = Column(
        Integer, ForeignKey("users.user_id", ondelete="CASCADE"), primary_key=True
    )
    following_id = Column(
        Integer, ForeignKey("users.user_id", ondelete="CASCADE"), primary_key=True
    )
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)


class BodyMetric(Base):
    """schema_erd.sql: BODY_METRICS — periodic body composition measurements."""
    __tablename__ = "body_metrics"

    metric_id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    recorded_at = Column(DateTime, default=datetime.utcnow, nullable=False)
    weight_kg = Column(Numeric(5, 2))
    height_cm = Column(Numeric(5, 2))
    body_fat_pct = Column(Numeric(4, 2))
    muscle_mass_kg = Column(Numeric(5, 2))
    waist_cm = Column(Numeric(5, 2))
    chest_cm = Column(Numeric(5, 2))
    arm_cm = Column(Numeric(5, 2))
    thigh_cm = Column(Numeric(5, 2))


class BodyPhoto(Base):
    """schema_erd.sql: BODY_PHOTOS — progress photos attached to a member's passport."""
    __tablename__ = "body_photos"

    photo_id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    photo_url = Column(String(500), nullable=False)
    recorded_at = Column(DateTime, default=datetime.utcnow, nullable=False)


class MilestoneAchievement(Base):
    """schema_erd.sql: MILESTONE_ACHIEVEMENTS — one row per milestone a member has hit."""
    __tablename__ = "milestone_achievements"

    achievement_id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    milestone_code = Column(String(50), nullable=False)
    badge_id = Column(Integer, ForeignKey("badges.badge_id"), nullable=True)
    fitcoin_rewarded = Column(Numeric(12, 2), default=0, nullable=False)
    xp_rewarded = Column(Integer, default=0, nullable=False)
    achieved_at = Column(DateTime, default=datetime.utcnow, nullable=False)


class Referral(Base):
    """schema_erd.sql: REFERRALS — tracked invite of a friend by phone number."""
    __tablename__ = "referrals"

    referral_id = Column(Integer, primary_key=True)
    referrer_id = Column(Integer, ForeignKey("users.user_id", ondelete="CASCADE"), nullable=False)
    friend_phone = Column(String(15), nullable=False)
    friend_user_id = Column(Integer, ForeignKey("users.user_id", ondelete="SET NULL"), nullable=True)
    status = Column(String(30), default="pending", nullable=False)
    expired_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow, nullable=False)
