"""care_queue

Revision ID: 005_care_queue
Revises: 004_ai_workout_engine
Create Date: 2026-06-26 23:58:00.000000

"""
from alembic import op
import sqlalchemy as sa


revision = '005_care_queue'
down_revision = '004_ai_workout_engine'
branch_labels = None
depends_on = None


def upgrade():
    conn = op.get_bind()
    inspector = sa.inspect(conn)
    if 'care_recommendations' not in inspector.get_table_names():
        op.create_table(
            'care_recommendations',
            sa.Column('rec_id', sa.Integer, primary_key=True),
            sa.Column('gym_id', sa.Integer, sa.ForeignKey('gyms.gym_id', ondelete='CASCADE'), nullable=False),
            sa.Column('member_id', sa.Integer, sa.ForeignKey('users.user_id', ondelete='CASCADE'), nullable=False),
            sa.Column('type', sa.String(50), nullable=False),
            sa.Column('priority', sa.String(20), nullable=False),
            sa.Column('reason', sa.Text, nullable=True),
            sa.Column('status', sa.String(20), nullable=False, server_default='pending'),
            sa.Column('result', sa.String(50), nullable=True),
            sa.Column('created_at', sa.DateTime, nullable=False, server_default=sa.func.now()),
        )
        op.create_index('ix_care_recommendations_gym_id', 'care_recommendations', ['gym_id'])
        op.create_index('ix_care_recommendations_member_id', 'care_recommendations', ['member_id'])


def downgrade():
    conn = op.get_bind()
    inspector = sa.inspect(conn)
    if 'care_recommendations' in inspector.get_table_names():
        op.drop_table('care_recommendations')
