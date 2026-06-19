"""extend_food_orders_with_delivery

Revision ID: 002_extend_food_orders_delivery
Revises: 001_add_shipping_addresses
Create Date: 2026-06-19 23:55:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '002_extend_food_orders_delivery'
down_revision = '001_add_shipping_addresses'
branch_labels = None
depends_on = None


def upgrade():
    # Create enums
    delivery_type_enum = sa.Enum('pickup', 'delivery', name='delivery_type_enum')
    shipping_provider_enum = sa.Enum('GHN', 'Ahamove', name='shipping_provider_enum')
    delivery_status_enum = sa.Enum('pending', 'preparing', 'shipped', 'delivering', 'done', 'cancelled', name='delivery_status_enum')

    delivery_type_enum.create(op.get_bind())
    shipping_provider_enum.create(op.get_bind())
    delivery_status_enum.create(op.get_bind())

    # Add columns
    op.add_column('food_orders', sa.Column('delivery_type', delivery_type_enum, nullable=False, server_default='pickup'))
    op.add_column('food_orders', sa.Column('shipping_address_id', sa.Integer, sa.ForeignKey('shipping_addresses.address_id'), nullable=True))
    op.add_column('food_orders', sa.Column('shipping_fee', sa.Numeric(10, 2), nullable=False, server_default='0'))
    op.add_column('food_orders', sa.Column('tracking_code', sa.String(100), nullable=True))
    op.add_column('food_orders', sa.Column('shipping_provider', shipping_provider_enum, nullable=True))
    op.add_column('food_orders', sa.Column('delivery_status', delivery_status_enum, nullable=True))


def downgrade():
    op.drop_column('food_orders', 'delivery_type')
    op.drop_column('food_orders', 'shipping_address_id')
    op.drop_column('food_orders', 'shipping_fee')
    op.drop_column('food_orders', 'tracking_code')
    op.drop_column('food_orders', 'shipping_provider')
    op.drop_column('food_orders', 'delivery_status')

    # Drop enums
    sa.Enum(name='delivery_type_enum').drop(op.get_bind())
    sa.Enum(name='shipping_provider_enum').drop(op.get_bind())
    sa.Enum(name='delivery_status_enum').drop(op.get_bind())
