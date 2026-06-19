"""add_shipping_addresses_table

Revision ID: 001_add_shipping_addresses
Revises:
Create Date: 2026-06-19 23:54:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '001_add_shipping_addresses'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    op.create_table(
        'shipping_addresses',
        sa.Column('address_id', sa.Integer, primary_key=True),
        sa.Column('user_id', sa.Integer, sa.ForeignKey('users.user_id'), nullable=False),
        sa.Column('full_name', sa.String(100), nullable=False),
        sa.Column('phone', sa.String(15), nullable=False),
        sa.Column('address_line', sa.String(300), nullable=False),
        sa.Column('ward', sa.String(100), nullable=False),
        sa.Column('district', sa.String(100), nullable=False),
        sa.Column('city', sa.String(100), nullable=False, server_default='Ho Chi Minh'),
        sa.Column('is_default', sa.Boolean, nullable=False, server_default='false'),
        sa.Column('created_at', sa.DateTime, nullable=False, server_default=sa.func.now()),
    )
    op.create_index('ix_shipping_addresses_user_id', 'shipping_addresses', ['user_id'])


def downgrade():
    op.drop_table('shipping_addresses')
