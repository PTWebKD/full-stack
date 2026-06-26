"""create_guests_vouchers_tables

Revision ID: 003_create_guests_vouchers
Revises: 002_extend_food_orders_delivery
Create Date: 2026-06-22 10:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '003_create_guests_vouchers'
down_revision = '002_extend_food_orders_delivery'
branch_labels = None
depends_on = None


def upgrade():
    conn = op.get_bind()
    inspector = sa.inspect(conn)
    tables = inspector.get_table_names()

    def column_exists(table_name, column_name):
        columns = [c['name'] for c in inspector.get_columns(table_name)]
        return column_name in columns

    def index_exists(table_name, index_name):
        indexes = [idx['name'] for idx in inspector.get_indexes(table_name)]
        return index_name in indexes

    def fk_exists(table_name, fk_name):
        fks = [fk['name'] for fk in inspector.get_foreign_keys(table_name)]
        return fk_name in fks

    # Create GUESTS table
    if 'guests' not in tables:
        op.create_table(
            'guests',
            sa.Column('guest_id', sa.Integer, primary_key=True),
            sa.Column('phone', sa.String(15), nullable=False, unique=True),
            sa.Column('email', sa.String(255), nullable=True),
            sa.Column('name', sa.String(255), nullable=True),
            sa.Column('first_visit_at', sa.DateTime, nullable=False, server_default=sa.func.now()),
            sa.Column('last_visit_at', sa.DateTime, nullable=True),
            sa.Column('total_purchases', sa.Integer, nullable=False, server_default='0'),
            sa.Column('total_spent', sa.Numeric(12, 2), nullable=False, server_default='0.00'),
            sa.Column('upsell_voucher_id', sa.Integer, nullable=True),
            sa.Column('voucher_last_shown_at', sa.DateTime, nullable=True),
            sa.Column('created_at', sa.DateTime, nullable=False, server_default=sa.func.now()),
            sa.Column('updated_at', sa.DateTime, nullable=False, server_default=sa.func.now()),
        )

    # Create VOUCHERS table
    if 'vouchers' not in tables:
        op.create_table(
            'vouchers',
            sa.Column('voucher_id', sa.Integer, primary_key=True),
            sa.Column('code', sa.String(50), nullable=False, unique=True),
            sa.Column('discount_percent', sa.Integer, nullable=False),
            sa.Column('discount_amount', sa.Numeric(10, 2), nullable=True),
            sa.Column('min_purchase_amount', sa.Numeric(10, 2), nullable=False, server_default='0'),
            sa.Column('applicable_to_nutrition', sa.Boolean, nullable=False, server_default='true'),
            sa.Column('applicable_to_membership', sa.Boolean, nullable=False, server_default='false'),
            sa.Column('max_uses', sa.Integer, nullable=True),
            sa.Column('current_uses', sa.Integer, nullable=False, server_default='0'),
            sa.Column('start_date', sa.DateTime, nullable=False),
            sa.Column('end_date', sa.DateTime, nullable=False),
            sa.Column('description', sa.Text, nullable=True),
            sa.Column('created_at', sa.DateTime, nullable=False, server_default=sa.func.now()),
            sa.Column('updated_at', sa.DateTime, nullable=False, server_default=sa.func.now()),
        )

    # Create GUEST_VOUCHERS table
    if 'guest_vouchers' not in tables:
        op.create_table(
            'guest_vouchers',
            sa.Column('guest_voucher_id', sa.Integer, primary_key=True),
            sa.Column('guest_id', sa.Integer, sa.ForeignKey('guests.guest_id', ondelete='CASCADE'), nullable=False),
            sa.Column('voucher_id', sa.Integer, sa.ForeignKey('vouchers.voucher_id', ondelete='CASCADE'), nullable=False),
            sa.Column('assigned_at', sa.DateTime, nullable=False, server_default=sa.func.now()),
            sa.Column('used_at', sa.DateTime, nullable=True),
            sa.Column('order_id', sa.Integer, sa.ForeignKey('food_orders.order_id', ondelete='SET NULL'), nullable=True),
            sa.UniqueConstraint('guest_id', 'voucher_id', name='uq_guest_voucher'),
        )

    # Add FK from GUESTS to VOUCHERS
    if conn.dialect.name != 'sqlite':
        if 'guests' in tables and 'vouchers' in tables:
            if not fk_exists('guests', 'fk_guests_voucher'):
                op.create_foreign_key(
                    'fk_guests_voucher',
                    'guests', 'vouchers',
                    ['upsell_voucher_id'], ['voucher_id'],
                    ondelete='SET NULL'
                )

    # Create indexes
    if 'guests' in tables or 'guests' not in tables:
        # If table was just created or exists, check index
        if not index_exists('guests', 'idx_guests_phone'):
            op.create_index('idx_guests_phone', 'guests', ['phone'])
        if not index_exists('guests', 'idx_guests_last_visit'):
            op.create_index('idx_guests_last_visit', 'guests', ['last_visit_at'])

    if 'guest_vouchers' in tables or 'guest_vouchers' not in tables:
        if not index_exists('guest_vouchers', 'idx_guest_vouchers_guest'):
            op.create_index('idx_guest_vouchers_guest', 'guest_vouchers', ['guest_id'])

    if 'vouchers' in tables or 'vouchers' not in tables:
        if not index_exists('vouchers', 'idx_vouchers_active'):
            op.create_index('idx_vouchers_active', 'vouchers', ['start_date', 'end_date'])

    # Extend FOOD_ORDERS table (nutrition orders)
    if not column_exists('food_orders', 'guest_id'):
        op.add_column('food_orders', sa.Column('guest_id', sa.Integer, sa.ForeignKey('guests.guest_id', ondelete='SET NULL'), nullable=True))
    if not column_exists('food_orders', 'applied_voucher_id'):
        op.add_column('food_orders', sa.Column('applied_voucher_id', sa.Integer, sa.ForeignKey('vouchers.voucher_id'), nullable=True))
    if not column_exists('food_orders', 'discount_amount'):
        op.add_column('food_orders', sa.Column('discount_amount', sa.Numeric(10, 2), nullable=False, server_default='0'))

    # Create index for food_orders guest_id
    if not index_exists('food_orders', 'idx_food_orders_guest'):
        op.create_index('idx_food_orders_guest', 'food_orders', ['guest_id'])


def downgrade():
    conn = op.get_bind()
    inspector = sa.inspect(conn)
    tables = inspector.get_table_names()

    def column_exists(table_name, column_name):
        columns = [c['name'] for c in inspector.get_columns(table_name)]
        return column_name in columns

    def index_exists(table_name, index_name):
        indexes = [idx['name'] for idx in inspector.get_indexes(table_name)]
        return index_name in indexes

    def fk_exists(table_name, fk_name):
        fks = [fk['name'] for fk in inspector.get_foreign_keys(table_name)]
        return fk_name in fks

    # Drop indexes
    if 'food_orders' in tables and index_exists('food_orders', 'idx_food_orders_guest'):
        op.drop_index('idx_food_orders_guest')
    if 'vouchers' in tables and index_exists('vouchers', 'idx_vouchers_active'):
        op.drop_index('idx_vouchers_active')
    if 'guest_vouchers' in tables and index_exists('guest_vouchers', 'idx_guest_vouchers_guest'):
        op.drop_index('idx_guest_vouchers_guest')
    if 'guests' in tables:
        if index_exists('guests', 'idx_guests_last_visit'):
            op.drop_index('idx_guests_last_visit')
        if index_exists('guests', 'idx_guests_phone'):
            op.drop_index('idx_guests_phone')

    # Remove columns from FOOD_ORDERS
    if 'food_orders' in tables:
        if column_exists('food_orders', 'discount_amount'):
            op.drop_column('food_orders', 'discount_amount')
        if column_exists('food_orders', 'applied_voucher_id'):
            op.drop_column('food_orders', 'applied_voucher_id')
        if column_exists('food_orders', 'guest_id'):
            op.drop_column('food_orders', 'guest_id')

    # Drop foreign key constraint before dropping tables
    if conn.dialect.name != 'sqlite':
        if 'guests' in tables and fk_exists('guests', 'fk_guests_voucher'):
            op.drop_constraint('fk_guests_voucher', 'guests', type_='foreignkey')

    # Drop tables
    if 'guest_vouchers' in tables:
        op.drop_table('guest_vouchers')
    if 'vouchers' in tables:
        op.drop_table('vouchers')
    if 'guests' in tables:
        op.drop_table('guests')
