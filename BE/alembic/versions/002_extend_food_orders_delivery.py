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
    conn = op.get_bind()
    inspector = sa.inspect(conn)
    is_postgres = conn.dialect.name == 'postgresql'

    def enum_exists(name):
        if is_postgres:
            r = conn.execute(sa.text(f"SELECT 1 FROM pg_type WHERE typname = '{name}'"))
            return r.scalar() is not None
        return False

    def column_exists(table_name, column_name):
        columns = [c['name'] for c in inspector.get_columns(table_name)]
        return column_name in columns

    # Create enums
    delivery_type_enum = sa.Enum('pickup', 'delivery', name='delivery_type_enum')
    shipping_provider_enum = sa.Enum('GHN', 'Ahamove', name='shipping_provider_enum')
    delivery_status_enum = sa.Enum('pending', 'preparing', 'shipped', 'delivering', 'done', 'cancelled', name='delivery_status_enum')

    if is_postgres:
        if not enum_exists('delivery_type_enum'):
            delivery_type_enum.create(conn)
        if not enum_exists('shipping_provider_enum'):
            shipping_provider_enum.create(conn)
        if not enum_exists('delivery_status_enum'):
            delivery_status_enum.create(conn)

    # Add columns
    if not column_exists('food_orders', 'delivery_type'):
        op.add_column('food_orders', sa.Column('delivery_type', delivery_type_enum, nullable=False, server_default='pickup'))
    if not column_exists('food_orders', 'shipping_address_id'):
        op.add_column('food_orders', sa.Column('shipping_address_id', sa.Integer, sa.ForeignKey('shipping_addresses.address_id'), nullable=True))
    if not column_exists('food_orders', 'shipping_fee'):
        op.add_column('food_orders', sa.Column('shipping_fee', sa.Numeric(10, 2), nullable=False, server_default='0'))
    if not column_exists('food_orders', 'tracking_code'):
        op.add_column('food_orders', sa.Column('tracking_code', sa.String(100), nullable=True))
    if not column_exists('food_orders', 'shipping_provider'):
        op.add_column('food_orders', sa.Column('shipping_provider', shipping_provider_enum, nullable=True))
    if not column_exists('food_orders', 'delivery_status'):
        op.add_column('food_orders', sa.Column('delivery_status', delivery_status_enum, nullable=True))


def downgrade():
    conn = op.get_bind()
    inspector = sa.inspect(conn)
    is_postgres = conn.dialect.name == 'postgresql'

    def enum_exists(name):
        if is_postgres:
            r = conn.execute(sa.text(f"SELECT 1 FROM pg_type WHERE typname = '{name}'"))
            return r.scalar() is not None
        return False

    def column_exists(table_name, column_name):
        columns = [c['name'] for c in inspector.get_columns(table_name)]
        return column_name in columns

    if column_exists('food_orders', 'delivery_type'):
        op.drop_column('food_orders', 'delivery_type')
    if column_exists('food_orders', 'shipping_address_id'):
        op.drop_column('food_orders', 'shipping_address_id')
    if column_exists('food_orders', 'shipping_fee'):
        op.drop_column('food_orders', 'shipping_fee')
    if column_exists('food_orders', 'tracking_code'):
        op.drop_column('food_orders', 'tracking_code')
    if column_exists('food_orders', 'shipping_provider'):
        op.drop_column('food_orders', 'shipping_provider')
    if column_exists('food_orders', 'delivery_status'):
        op.drop_column('food_orders', 'delivery_status')

    # Drop enums
    if is_postgres:
        if enum_exists('delivery_type_enum'):
            sa.Enum(name='delivery_type_enum').drop(conn)
        if enum_exists('shipping_provider_enum'):
            sa.Enum(name='shipping_provider_enum').drop(conn)
        if enum_exists('delivery_status_enum'):
            sa.Enum(name='delivery_status_enum').drop(conn)
