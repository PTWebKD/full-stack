from decimal import Decimal
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.core.dependencies import err
from app.modules.users.model import User
from .model import FoodProduct, FoodOrder, FoodReview, OrderStatus
from .schema import ProductCreate, OrderCreate, ReviewCreate

DELIVERY_FEE = Decimal("15000")
MIN_ORDER = Decimal("30000")


async def list_products(db: AsyncSession, search: str = None, category: str = None) -> list:
    q = select(FoodProduct).where(FoodProduct.is_available == True)
    if search:
        q = q.where(FoodProduct.name.ilike(f"%{search}%"))
    if category:
        q = q.where(FoodProduct.category == category)
    r = await db.execute(q.order_by(FoodProduct.created_at.desc()))
    return r.scalars().all()


async def get_product(db: AsyncSession, product_id: int) -> FoodProduct:
    r = await db.execute(select(FoodProduct).where(FoodProduct.product_id == product_id))
    p = r.scalar_one_or_none()
    if not p:
        err("NOT_FOUND", "Product not found", 404)
    return p


async def create_product(db: AsyncSession, vendor: User, data: ProductCreate) -> FoodProduct:
    if vendor.role.value != "vendor":
        err("FORBIDDEN", "Only vendors can create products (BR-15)", 403)
    p = FoodProduct(vendor_id=vendor.user_id, **data.model_dump())
    db.add(p)
    await db.flush()
    return p


async def update_product(
    db: AsyncSession, vendor: User, product_id: int, data: ProductCreate
) -> FoodProduct:
    p = await get_product(db, product_id)
    if p.vendor_id != vendor.user_id:
        err("FORBIDDEN", "Not your product", 403)
    for k, v in data.model_dump(exclude_none=True).items():
        setattr(p, k, v)
    await db.flush()
    return p


async def place_order(
    db: AsyncSession,
    user: User | None,
    data: OrderCreate,
    delivery_type: str = "pickup",
    shipping_address_id: int | None = None,
    shipping_fee: Decimal = Decimal("0"),
    guest_id: int | None = None,
    applied_voucher_id: int | None = None,
) -> FoodOrder:
    """
    Place nutrition order for member or guest.

    Logic:
    - If user: use user_id, set guest_id=NULL
    - If guest_id: use guest_id, set user_id=NULL
    - Calculate discount from voucher if provided
    """

    from app.modules.guests.service import (
        update_guest_after_purchase,
        mark_voucher_used
    )
    from app.modules.guests.model import Voucher, GuestVoucher

    # Validate: either user or guest_id, not both
    if user and guest_id:
        err("BAD_REQUEST", "Cannot have both user and guest in order")

    if not user and not guest_id:
        # BR-18: guest orders require phone
        if not data.guest_phone:
            err("VALIDATION_ERROR", "guest_phone required for guest orders (BR-18)")

    # Validate delivery_type
    if delivery_type not in ["pickup", "delivery"]:
        err("VALIDATION_ERROR", "Invalid delivery_type. Must be 'pickup' or 'delivery'")

    # If delivery, require shipping_address_id
    if delivery_type == "delivery" and not shipping_address_id:
        err("VALIDATION_ERROR", "shipping_address_id required for delivery type orders")

    subtotal = sum(item.price * item.qty for item in data.items)
    if subtotal < MIN_ORDER:
        err("VALIDATION_ERROR", f"Minimum order is {int(MIN_ORDER)}đ")

    fitcoin_discount = min(data.fitcoin_used, subtotal)
    discount_amount = Decimal("0")

    # Apply voucher discount if provided
    if applied_voucher_id:
        result = await db.execute(select(Voucher).where(Voucher.voucher_id == applied_voucher_id))
        applied_voucher_obj = result.scalar_one_or_none()

        if not applied_voucher_obj:
            err("NOT_FOUND", "Voucher not found")

        if applied_voucher_obj.discount_percent:
            discount_amount = subtotal * Decimal(str(applied_voucher_obj.discount_percent)) / Decimal("100")
        elif applied_voucher_obj.discount_amount:
            discount_amount = applied_voucher_obj.discount_amount

        # Validate min purchase
        if subtotal < applied_voucher_obj.min_purchase_amount:
            err("VALIDATION_ERROR", f"Minimum purchase {applied_voucher_obj.min_purchase_amount} required for this voucher")

    total = subtotal + shipping_fee - fitcoin_discount - discount_amount
    order = FoodOrder(
        user_id=user.user_id if user else None,
        guest_id=guest_id,
        guest_phone=data.guest_phone,
        vendor_id=data.vendor_id,
        items=[i.model_dump(mode='json') for i in data.items],
        subtotal=subtotal,
        delivery_fee=shipping_fee,
        total_amount=max(total, Decimal("0")),
        fitcoin_used=fitcoin_discount,
        delivery_address=data.delivery_address,
        delivery_time=data.delivery_time,
        payment_method=data.payment_method,
        is_meal_prep=data.is_meal_prep,
        delivery_type=delivery_type,
        shipping_address_id=shipping_address_id,
        shipping_fee=shipping_fee,
        applied_voucher_id=applied_voucher_id,
        discount_amount=discount_amount,
    )
    db.add(order)
    await db.flush()

    # Update guest stats if guest order
    if guest_id:
        await update_guest_after_purchase(db, guest_id, max(total, Decimal("0")))

    # Mark voucher as used
    if applied_voucher_id and guest_id:
        result = await db.execute(
            select(GuestVoucher).where(
                GuestVoucher.guest_id == guest_id,
                GuestVoucher.voucher_id == applied_voucher_id
            )
        )
        guest_voucher = result.scalar_one_or_none()
        if guest_voucher:
            await mark_voucher_used(db, guest_voucher.guest_voucher_id, order.order_id)

    return order


async def get_my_orders(db: AsyncSession, user_id: int) -> list:
    r = await db.execute(
        select(FoodOrder).where(FoodOrder.user_id == user_id).order_by(FoodOrder.created_at.desc())
    )
    return r.scalars().all()


async def get_order_by_id(db: AsyncSession, order_id: int) -> FoodOrder:
    r = await db.execute(select(FoodOrder).where(FoodOrder.order_id == order_id))
    order = r.scalar_one_or_none()
    if not order:
        err("NOT_FOUND", "Order not found", 404)
    return order


async def update_order_status(
    db: AsyncSession, vendor: User, order_id: int, status: str
) -> FoodOrder:
    order = await get_order_by_id(db, order_id)
    if order.vendor_id != vendor.user_id:
        err("FORBIDDEN", "Not your order", 403)
    order.status = OrderStatus(status)
    await db.flush()
    return order


async def create_review(
    db: AsyncSession, user: User, product_id: int, data: ReviewCreate
) -> FoodReview:
    if not 1 <= data.rating <= 5:
        err("VALIDATION_ERROR", "Rating must be between 1 and 5")
    # check user actually ordered this product (BR-27)
    order_check = await db.execute(
        select(FoodOrder).where(
            FoodOrder.user_id == user.user_id,
            FoodOrder.status == OrderStatus.delivered,
        )
    )
    delivered_orders = order_check.scalars().all()
    product_ids_ordered = {
        item["product_id"] for order in delivered_orders for item in (order.items or [])
    }
    if product_id not in product_ids_ordered:
        err("FORBIDDEN", "Can only review products you have received (BR-27)", 403)

    existing = await db.execute(
        select(FoodReview).where(
            FoodReview.product_id == product_id, FoodReview.user_id == user.user_id
        )
    )
    if existing.scalar_one_or_none():
        err("VALIDATION_ERROR", "Already reviewed this product")

    review = FoodReview(product_id=product_id, user_id=user.user_id, **data.model_dump())
    db.add(review)
    await db.flush()

    # update product avg_rating
    r = await db.execute(select(FoodReview).where(FoodReview.product_id == product_id))
    reviews = r.scalars().all()
    product = await get_product(db, product_id)
    product.total_reviews = len(reviews)
    total_rating = sum(rv.rating for rv in reviews)
    product.avg_rating = Decimal(str(total_rating / len(reviews))).quantize(Decimal("0.1"))
    await db.flush()
    return review


async def get_product_reviews(db: AsyncSession, product_id: int) -> list:
    r = await db.execute(select(FoodReview).where(FoodReview.product_id == product_id))
    return r.scalars().all()


async def get_vendor_products(db: AsyncSession, vendor_id: int) -> list:
    r = await db.execute(
        select(FoodProduct).where(FoodProduct.vendor_id == vendor_id).order_by(FoodProduct.created_at.desc())
    )
    return r.scalars().all()


async def get_vendor_orders(db: AsyncSession, vendor_id: int) -> list:
    r = await db.execute(
        select(FoodOrder).where(FoodOrder.vendor_id == vendor_id).order_by(FoodOrder.created_at.desc())
    )
    return r.scalars().all()


async def toggle_product_availability(db: AsyncSession, vendor: User, product_id: int) -> FoodProduct:
    p = await get_product(db, product_id)
    if p.vendor_id != vendor.user_id:
        err("FORBIDDEN", "Not your product", 403)
    p.is_available = not p.is_available
    await db.flush()
    return p
