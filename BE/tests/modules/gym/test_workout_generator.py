import pytest
import pytest_asyncio
from unittest.mock import AsyncMock, MagicMock, patch
from app.modules.gym.workout_generator import generate_workout, EXERCISES_PER_SESSION


@pytest.mark.asyncio
async def test_generate_workout_no_history_returns_defaults():
    """With no exercise history, all suggestions use template defaults."""
    mock_template = MagicMock()
    mock_template.exercise_name = "Bench Press"
    mock_template.muscle_group = "chest"
    mock_template.default_sets = 3
    mock_template.default_reps = 10
    mock_template.default_weight_kg = 60

    mock_db = AsyncMock()
    # First execute → templates
    mock_result_templates = MagicMock()
    mock_result_templates.scalars.return_value.all.return_value = [mock_template]
    # Second execute → empty history
    mock_result_history = MagicMock()
    mock_result_history.scalars.return_value.all.return_value = []
    mock_db.execute.side_effect = [mock_result_templates, mock_result_history]

    result = await generate_workout(mock_db, user_id=1, muscle_group="chest")

    assert result["source"] == "rule_based"
    assert result["program_day_id"] is None
    assert len(result["suggested_exercises"]) == 1
    ex = result["suggested_exercises"][0]
    assert ex["exercise_name"] == "Bench Press"
    assert ex["overload_suggestion"] is None
    assert ex["sets"] == [{"reps": 10, "weight": 60.0}] * 3


@pytest.mark.asyncio
async def test_generate_workout_with_completed_history_bumps_weight():
    """When last session completed all sets with full reps, suggest +2.5kg."""
    mock_template = MagicMock()
    mock_template.exercise_name = "Bench Press"
    mock_template.muscle_group = "chest"
    mock_template.default_sets = 3
    mock_template.default_reps = 10
    mock_template.default_weight_kg = 60

    mock_log = MagicMock()
    mock_log.exercise_name = "Bench Press"
    mock_log.sets = [
        {"reps": 10, "weight": 57.5},
        {"reps": 10, "weight": 57.5},
        {"reps": 10, "weight": 57.5},
    ]

    mock_db = AsyncMock()
    mock_result_templates = MagicMock()
    mock_result_templates.scalars.return_value.all.return_value = [mock_template]
    mock_result_history = MagicMock()
    mock_result_history.scalars.return_value.all.return_value = [mock_log]
    mock_db.execute.side_effect = [mock_result_templates, mock_result_history]

    result = await generate_workout(mock_db, user_id=1, muscle_group="chest")

    ex = result["suggested_exercises"][0]
    assert ex["overload_suggestion"]["suggested_weight"] == 60.0
    assert ex["overload_suggestion"]["prev_weight"] == 57.5
    for s in ex["sets"]:
        assert s["weight"] == 60.0


@pytest.mark.asyncio
async def test_generate_workout_with_incomplete_history_bumps_reps():
    """When last session had low reps, suggest +1 rep, same weight."""
    mock_template = MagicMock()
    mock_template.exercise_name = "Bench Press"
    mock_template.muscle_group = "chest"
    mock_template.default_sets = 3
    mock_template.default_reps = 10
    mock_template.default_weight_kg = 60

    mock_log = MagicMock()
    mock_log.exercise_name = "Bench Press"
    mock_log.sets = [
        {"reps": 7, "weight": 60},
        {"reps": 7, "weight": 60},
        {"reps": 7, "weight": 60},
    ]

    mock_db = AsyncMock()
    mock_result_templates = MagicMock()
    mock_result_templates.scalars.return_value.all.return_value = [mock_template]
    mock_result_history = MagicMock()
    mock_result_history.scalars.return_value.all.return_value = [mock_log]
    mock_db.execute.side_effect = [mock_result_templates, mock_result_history]

    result = await generate_workout(mock_db, user_id=1, muscle_group="chest")

    ex = result["suggested_exercises"][0]
    assert ex["overload_suggestion"]["suggested_weight"] == 60
    for s in ex["sets"]:
        assert s["reps"] == 8  # 7 + 1


@pytest.mark.asyncio
async def test_generate_workout_maps_custom_to_full_body():
    """'custom' muscle group fetches full_body templates."""
    mock_db = AsyncMock()
    mock_result_templates = MagicMock()
    mock_result_templates.scalars.return_value.all.return_value = []
    mock_result_history = MagicMock()
    mock_result_history.scalars.return_value.all.return_value = []
    mock_db.execute.side_effect = [mock_result_templates, mock_result_history]

    result = await generate_workout(mock_db, user_id=1, muscle_group="custom")

    # Verify the template query used 'full_body'
    first_call_stmt = mock_db.execute.call_args_list[0].args[0]
    compiled_sql = str(first_call_stmt.compile(compile_kwargs={"literal_binds": True}))
    assert "full_body" in compiled_sql
    assert result["source"] == "rule_based"
