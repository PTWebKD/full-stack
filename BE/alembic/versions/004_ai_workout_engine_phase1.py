"""ai_workout_engine_phase1

Revision ID: 004_ai_workout_engine
Revises: 003_create_guests_vouchers
Create Date: 2026-06-25 00:00:00.000000
"""
from alembic import op
import sqlalchemy as sa

revision = '004_ai_workout_engine'
down_revision = '003_create_guests_vouchers'
branch_labels = None
depends_on = None


def upgrade():
    conn = op.get_bind()
    inspector = sa.inspect(conn)
    tables = inspector.get_table_names()

    def column_exists(table_name, column_name):
        columns = [c['name'] for c in inspector.get_columns(table_name)]
        return column_name in columns

    # 1. Extend PostgreSQL muscle_group enum with new values
    if conn.dialect.name == 'postgresql':
        op.execute(sa.text("ALTER TYPE muscle_group ADD VALUE IF NOT EXISTS 'back_shoulders'"))
        op.execute(sa.text("ALTER TYPE muscle_group ADD VALUE IF NOT EXISTS 'full_body'"))

    # 2. Create exercise_templates table (uses VARCHAR for muscle_group — avoids enum lock-in)
    if 'exercise_templates' not in tables:
        op.create_table(
            'exercise_templates',
            sa.Column('exercise_template_id', sa.Integer, primary_key=True, autoincrement=True),
            sa.Column('exercise_name', sa.String(100), nullable=False),
            sa.Column('muscle_group', sa.String(50), nullable=False),
            sa.Column('default_sets', sa.Integer, nullable=False, server_default='3'),
            sa.Column('default_reps', sa.Integer, nullable=False, server_default='10'),
            sa.Column('default_weight_kg', sa.Numeric(5, 2), nullable=False, server_default='0'),
            sa.Column('equipment', sa.String(50), nullable=True),
            sa.Column('difficulty', sa.String(20), nullable=True),
            sa.UniqueConstraint('exercise_name', 'muscle_group', name='uq_exercise_template'),
        )

    # 3. Seed exercise templates (only if table was newly created or is empty)
    # Check if empty
    is_empty = False
    if 'exercise_templates' in tables:
        r = conn.execute(sa.text("SELECT COUNT(*) FROM exercise_templates"))
        is_empty = r.scalar() == 0
    else:
        is_empty = True

    if is_empty:
        op.bulk_insert(
            sa.table(
                'exercise_templates',
                sa.column('exercise_name', sa.String),
                sa.column('muscle_group', sa.String),
                sa.column('default_sets', sa.Integer),
                sa.column('default_reps', sa.Integer),
                sa.column('default_weight_kg', sa.Numeric),
                sa.column('equipment', sa.String),
                sa.column('difficulty', sa.String),
            ),
            [
                # --- chest ---
                {'exercise_name': 'Bench Press', 'muscle_group': 'chest', 'default_sets': 3, 'default_reps': 10, 'default_weight_kg': 60, 'equipment': 'barbell', 'difficulty': 'intermediate'},
                {'exercise_name': 'Incline Dumbbell Press', 'muscle_group': 'chest', 'default_sets': 3, 'default_reps': 10, 'default_weight_kg': 20, 'equipment': 'dumbbell', 'difficulty': 'intermediate'},
                {'exercise_name': 'Cable Fly', 'muscle_group': 'chest', 'default_sets': 3, 'default_reps': 12, 'default_weight_kg': 15, 'equipment': 'machine', 'difficulty': 'beginner'},
                {'exercise_name': 'Chest Dip', 'muscle_group': 'chest', 'default_sets': 3, 'default_reps': 10, 'default_weight_kg': 0, 'equipment': 'bodyweight', 'difficulty': 'intermediate'},
                {'exercise_name': 'Push-Up', 'muscle_group': 'chest', 'default_sets': 3, 'default_reps': 15, 'default_weight_kg': 0, 'equipment': 'bodyweight', 'difficulty': 'beginner'},
                # --- back ---
                {'exercise_name': 'Pull-Up', 'muscle_group': 'back', 'default_sets': 3, 'default_reps': 8, 'default_weight_kg': 0, 'equipment': 'bodyweight', 'difficulty': 'intermediate'},
                {'exercise_name': 'Lat Pulldown', 'muscle_group': 'back', 'default_sets': 3, 'default_reps': 10, 'default_weight_kg': 50, 'equipment': 'machine', 'difficulty': 'beginner'},
                {'exercise_name': 'Bent-Over Row', 'muscle_group': 'back', 'default_sets': 3, 'default_reps': 10, 'default_weight_kg': 50, 'equipment': 'barbell', 'difficulty': 'intermediate'},
                {'exercise_name': 'Seated Cable Row', 'muscle_group': 'back', 'default_sets': 3, 'default_reps': 10, 'default_weight_kg': 45, 'equipment': 'machine', 'difficulty': 'beginner'},
                {'exercise_name': 'Deadlift', 'muscle_group': 'back', 'default_sets': 3, 'default_reps': 5, 'default_weight_kg': 80, 'equipment': 'barbell', 'difficulty': 'advanced'},
                # --- back_shoulders ---
                {'exercise_name': 'Lat Pulldown', 'muscle_group': 'back_shoulders', 'default_sets': 3, 'default_reps': 10, 'default_weight_kg': 50, 'equipment': 'machine', 'difficulty': 'beginner'},
                {'exercise_name': 'Bent-Over Row', 'muscle_group': 'back_shoulders', 'default_sets': 3, 'default_reps': 10, 'default_weight_kg': 50, 'equipment': 'barbell', 'difficulty': 'intermediate'},
                {'exercise_name': 'Overhead Press', 'muscle_group': 'back_shoulders', 'default_sets': 3, 'default_reps': 10, 'default_weight_kg': 40, 'equipment': 'barbell', 'difficulty': 'intermediate'},
                {'exercise_name': 'Lateral Raise', 'muscle_group': 'back_shoulders', 'default_sets': 3, 'default_reps': 12, 'default_weight_kg': 10, 'equipment': 'dumbbell', 'difficulty': 'beginner'},
                {'exercise_name': 'Rear Delt Fly', 'muscle_group': 'back_shoulders', 'default_sets': 3, 'default_reps': 12, 'default_weight_kg': 10, 'equipment': 'dumbbell', 'difficulty': 'beginner'},
                {'exercise_name': 'Arnold Press', 'muscle_group': 'back_shoulders', 'default_sets': 3, 'default_reps': 10, 'default_weight_kg': 15, 'equipment': 'dumbbell', 'difficulty': 'intermediate'},
                # --- legs ---
                {'exercise_name': 'Squat', 'muscle_group': 'legs', 'default_sets': 3, 'default_reps': 10, 'default_weight_kg': 80, 'equipment': 'barbell', 'difficulty': 'intermediate'},
                {'exercise_name': 'Leg Press', 'muscle_group': 'legs', 'default_sets': 3, 'default_reps': 10, 'default_weight_kg': 100, 'equipment': 'machine', 'difficulty': 'beginner'},
                {'exercise_name': 'Romanian Deadlift', 'muscle_group': 'legs', 'default_sets': 3, 'default_reps': 10, 'default_weight_kg': 60, 'equipment': 'barbell', 'difficulty': 'intermediate'},
                {'exercise_name': 'Leg Curl', 'muscle_group': 'legs', 'default_sets': 3, 'default_reps': 12, 'default_weight_kg': 40, 'equipment': 'machine', 'difficulty': 'beginner'},
                {'exercise_name': 'Calf Raise', 'muscle_group': 'legs', 'default_sets': 3, 'default_reps': 15, 'default_weight_kg': 60, 'equipment': 'machine', 'difficulty': 'beginner'},
                {'exercise_name': 'Lunges', 'muscle_group': 'legs', 'default_sets': 3, 'default_reps': 10, 'default_weight_kg': 20, 'equipment': 'dumbbell', 'difficulty': 'beginner'},
                # --- shoulders ---
                {'exercise_name': 'Overhead Press', 'muscle_group': 'shoulders', 'default_sets': 3, 'default_reps': 10, 'default_weight_kg': 40, 'equipment': 'barbell', 'difficulty': 'intermediate'},
                {'exercise_name': 'Lateral Raise', 'muscle_group': 'shoulders', 'default_sets': 3, 'default_reps': 12, 'default_weight_kg': 10, 'equipment': 'dumbbell', 'difficulty': 'beginner'},
                {'exercise_name': 'Front Raise', 'muscle_group': 'shoulders', 'default_sets': 3, 'default_reps': 12, 'default_weight_kg': 10, 'equipment': 'dumbbell', 'difficulty': 'beginner'},
                {'exercise_name': 'Rear Delt Fly', 'muscle_group': 'shoulders', 'default_sets': 3, 'default_reps': 12, 'default_weight_kg': 10, 'equipment': 'dumbbell', 'difficulty': 'beginner'},
                {'exercise_name': 'Arnold Press', 'muscle_group': 'shoulders', 'default_sets': 3, 'default_reps': 10, 'default_weight_kg': 15, 'equipment': 'dumbbell', 'difficulty': 'intermediate'},
                # --- arms ---
                {'exercise_name': 'Barbell Curl', 'muscle_group': 'arms', 'default_sets': 3, 'default_reps': 10, 'default_weight_kg': 30, 'equipment': 'barbell', 'difficulty': 'beginner'},
                {'exercise_name': 'Tricep Pushdown', 'muscle_group': 'arms', 'default_sets': 3, 'default_reps': 12, 'default_weight_kg': 30, 'equipment': 'machine', 'difficulty': 'beginner'},
                {'exercise_name': 'Hammer Curl', 'muscle_group': 'arms', 'default_sets': 3, 'default_reps': 10, 'default_weight_kg': 15, 'equipment': 'dumbbell', 'difficulty': 'beginner'},
                {'exercise_name': 'Skull Crusher', 'muscle_group': 'arms', 'default_sets': 3, 'default_reps': 10, 'default_weight_kg': 25, 'equipment': 'barbell', 'difficulty': 'intermediate'},
                {'exercise_name': 'Preacher Curl', 'muscle_group': 'arms', 'default_sets': 3, 'default_reps': 10, 'default_weight_kg': 25, 'equipment': 'barbell', 'difficulty': 'beginner'},
                # --- core ---
                {'exercise_name': 'Plank', 'muscle_group': 'core', 'default_sets': 3, 'default_reps': 1, 'default_weight_kg': 0, 'equipment': 'bodyweight', 'difficulty': 'beginner'},
                {'exercise_name': 'Crunches', 'muscle_group': 'core', 'default_sets': 3, 'default_reps': 20, 'default_weight_kg': 0, 'equipment': 'bodyweight', 'difficulty': 'beginner'},
                {'exercise_name': 'Russian Twist', 'muscle_group': 'core', 'default_sets': 3, 'default_reps': 20, 'default_weight_kg': 10, 'equipment': 'dumbbell', 'difficulty': 'beginner'},
                {'exercise_name': 'Leg Raise', 'muscle_group': 'core', 'default_sets': 3, 'default_reps': 15, 'default_weight_kg': 0, 'equipment': 'bodyweight', 'difficulty': 'beginner'},
                {'exercise_name': 'Ab Wheel', 'muscle_group': 'core', 'default_sets': 3, 'default_reps': 10, 'default_weight_kg': 0, 'equipment': 'bodyweight', 'difficulty': 'intermediate'},
                # --- full_body ---
                {'exercise_name': 'Burpee', 'muscle_group': 'full_body', 'default_sets': 3, 'default_reps': 10, 'default_weight_kg': 0, 'equipment': 'bodyweight', 'difficulty': 'intermediate'},
                {'exercise_name': 'Clean and Press', 'muscle_group': 'full_body', 'default_sets': 3, 'default_reps': 8, 'default_weight_kg': 40, 'equipment': 'barbell', 'difficulty': 'advanced'},
                {'exercise_name': 'Kettlebell Swing', 'muscle_group': 'full_body', 'default_sets': 3, 'default_reps': 15, 'default_weight_kg': 20, 'equipment': 'kettlebell', 'difficulty': 'intermediate'},
                {'exercise_name': 'Thruster', 'muscle_group': 'full_body', 'default_sets': 3, 'default_reps': 10, 'default_weight_kg': 30, 'equipment': 'barbell', 'difficulty': 'intermediate'},
                {'exercise_name': 'Box Jump', 'muscle_group': 'full_body', 'default_sets': 3, 'default_reps': 10, 'default_weight_kg': 0, 'equipment': 'bodyweight', 'difficulty': 'intermediate'},
            ]
        )

    # 4. Add new columns to workout_sessions (Phase 1 — no FK constraints yet)
    if not column_exists('workout_sessions', 'member_program_id'):
        op.add_column('workout_sessions', sa.Column('member_program_id', sa.Integer, nullable=True))
    if not column_exists('workout_sessions', 'program_day_id'):
        op.add_column('workout_sessions', sa.Column('program_day_id', sa.Integer, nullable=True))
    if not column_exists('workout_sessions', 'customized_from_prog'):
        op.add_column('workout_sessions', sa.Column('customized_from_prog', sa.Boolean, nullable=False, server_default='false'))
    if not column_exists('workout_sessions', 'customization_log'):
        op.add_column('workout_sessions', sa.Column('customization_log', sa.JSON, nullable=True))

    # 5. Add new columns to exercise_logs
    if not column_exists('exercise_logs', 'program_exercise_id'):
        op.add_column('exercise_logs', sa.Column('program_exercise_id', sa.Integer, nullable=True))
    if not column_exists('exercise_logs', 'overload_suggestion'):
        op.add_column('exercise_logs', sa.Column('overload_suggestion', sa.JSON, nullable=True))


def downgrade():
    conn = op.get_bind()
    inspector = sa.inspect(conn)
    tables = inspector.get_table_names()

    def column_exists(table_name, column_name):
        columns = [c['name'] for c in inspector.get_columns(table_name)]
        return column_name in columns

    if 'exercise_logs' in tables:
        if column_exists('exercise_logs', 'overload_suggestion'):
            op.drop_column('exercise_logs', 'overload_suggestion')
        if column_exists('exercise_logs', 'program_exercise_id'):
            op.drop_column('exercise_logs', 'program_exercise_id')

    if 'workout_sessions' in tables:
        if column_exists('workout_sessions', 'customization_log'):
            op.drop_column('workout_sessions', 'customization_log')
        if column_exists('workout_sessions', 'customized_from_prog'):
            op.drop_column('workout_sessions', 'customized_from_prog')
        if column_exists('workout_sessions', 'program_day_id'):
            op.drop_column('workout_sessions', 'program_day_id')
        if column_exists('workout_sessions', 'member_program_id'):
            op.drop_column('workout_sessions', 'member_program_id')

    if 'exercise_templates' in tables:
        # Check if uq constraint exists
        # In alembic, drop_table will drop constraints automatically. But if we want to run downgrade selectively:
        try:
            op.drop_constraint('uq_exercise_template', 'exercise_templates', type_='unique')
        except Exception:
            pass
        op.drop_table('exercise_templates')
    # Note: PostgreSQL does not support removing enum values — back_shoulders and full_body remain
