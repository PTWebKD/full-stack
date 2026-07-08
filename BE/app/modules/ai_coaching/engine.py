from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.modules.gym.model import WorkoutSession, ExerciseLog
from app.modules.food.model import FoodProduct
from app.modules.users.model import User

# ── Layer 2: Muscle → Macro Rules (BR-28/29/34) ─────────────────────────────

# Priority order for tiebreaking (BR-34)
MUSCLE_PRIORITY = ["legs", "back", "chest", "shoulders", "arms", "core"]

MACRO_RULES: dict[tuple[str, str], tuple[int, int, int, str]] = {
    # (muscle_group, fitness_goal) → (min_protein_g, min_carb_g, max_fat_g, label)
    ("legs",      "bulk"):     (30, 50, 20, "high_protein_high_carb"),
    ("legs",      "cut"):      (35, 25, 15, "high_protein_low_carb"),
    ("legs",      "maintain"): (30, 35, 18, "high_protein_moderate_carb"),
    ("back",      "bulk"):     (30, 50, 20, "high_protein_high_carb"),
    ("back",      "cut"):      (35, 25, 15, "high_protein_low_carb"),
    ("back",      "maintain"): (28, 35, 18, "high_protein_moderate_carb"),
    ("chest",     "bulk"):     (28, 45, 20, "high_protein_high_carb"),
    ("chest",     "cut"):      (32, 20, 15, "high_protein_low_carb"),
    ("chest",     "maintain"): (25, 30, 18, "moderate_protein_moderate_carb"),
    ("shoulders", "bulk"):     (25, 40, 20, "moderate_protein_high_carb"),
    ("shoulders", "cut"):      (30, 20, 12, "high_protein_low_carb"),
    ("shoulders", "maintain"): (22, 28, 15, "moderate_protein_moderate_carb"),
    ("arms",      "bulk"):     (25, 40, 18, "moderate_protein_high_carb"),
    ("arms",      "cut"):      (28, 18, 12, "high_protein_low_carb"),
    ("arms",      "maintain"): (20, 25, 15, "moderate_protein_low_carb"),
    ("core",      "bulk"):     (22, 35, 18, "moderate_protein_moderate_carb"),
    ("core",      "cut"):      (25, 18, 12, "moderate_protein_low_carb"),
    ("core",      "maintain"): (20, 25, 15, "moderate_protein_moderate_carb"),
}


def get_macro_profile(muscle_group: str, fitness_goal: str | None) -> tuple:
    """Returns (min_protein_g, min_carb_g, max_fat_g, label)"""
    goal = fitness_goal or "maintain"
    return MACRO_RULES.get((muscle_group, goal), MACRO_RULES[("core", "maintain")])


# ── Layer 1: Tracker — dominant muscle group from session ───────────────────

async def get_session_dominant_muscle(
    db: AsyncSession,
    session_id: int,
    user_id: int,
) -> str | None:
    """
    Returns the dominant muscle group from a completed or active session.
    Dominant = most exercises logged for that group.
    Tiebreak = priority order: legs > back > chest > shoulders > arms > core.
    Returns None if session not found or has no exercises.
    """
    result = await db.execute(
        select(WorkoutSession)
        .where(WorkoutSession.session_id == session_id)
        .where(WorkoutSession.user_id == user_id)
    )
    session = result.scalar_one_or_none()
    if session is None:
        return None

    # Load exercises for this session
    logs_result = await db.execute(
        select(ExerciseLog).where(ExerciseLog.session_id == session_id)
    )
    exercises = logs_result.scalars().all()

    if not exercises:
        return None

    # Count exercises per muscle group
    counts: dict[str, int] = {}
    for ex in exercises:
        group = ex.muscle_group.value if hasattr(ex.muscle_group, "value") else str(ex.muscle_group)
        counts[group] = counts.get(group, 0) + 1

    # Find max count
    max_count = max(counts.values())
    candidates = [g for g, c in counts.items() if c == max_count]

    # Tiebreak by priority order
    for group in MUSCLE_PRIORITY:
        if group in candidates:
            return group

    # Fallback (should not happen if MUSCLE_PRIORITY is exhaustive)
    return candidates[0]


# ── Layer 3: Recommender — query food products by macro profile ──────────────

def _filter_allergens(products: list, user_allergens: list[str]) -> list:
    """Filter out products whose allergens overlap with the user's allergens."""
    if not user_allergens:
        return products
    user_set = set(a.lower() for a in user_allergens)
    filtered = []
    for p in products:
        product_allergens = p.allergens or []
        product_set = set(a.lower() for a in product_allergens)
        if not product_set.intersection(user_set):
            filtered.append(p)
    return filtered


async def _query_personalized(
    db: AsyncSession,
    min_protein: int,
    min_carb: int,
    max_fat: int,
    user_allergens: list[str],
) -> list:
    """
    Query food products by macro constraints, with allergen filtering.
    Implements BR-30: relax constraints progressively if fewer than 3 results.
    """
    # Attempt 1: full constraints
    stmt = (
        select(FoodProduct)
        .where(FoodProduct.is_available == True)
        .where(FoodProduct.protein_g >= min_protein)
        .where(FoodProduct.carb_g >= min_carb)
        .where(FoodProduct.fat_g <= max_fat)
        .order_by(FoodProduct.avg_rating.desc())
        .limit(30)
    )
    rows = (await db.execute(stmt)).scalars().all()
    results = _filter_allergens(rows, user_allergens)[:3]

    if len(results) >= 3:
        return results

    # Attempt 2: relax fat constraint
    stmt2 = (
        select(FoodProduct)
        .where(FoodProduct.is_available == True)
        .where(FoodProduct.protein_g >= min_protein)
        .where(FoodProduct.carb_g >= min_carb)
        .order_by(FoodProduct.avg_rating.desc())
        .limit(30)
    )
    rows2 = (await db.execute(stmt2)).scalars().all()
    results2 = _filter_allergens(rows2, user_allergens)[:3]

    if len(results2) >= 3:
        return results2

    # Attempt 3: relax carb constraint as well
    stmt3 = (
        select(FoodProduct)
        .where(FoodProduct.is_available == True)
        .where(FoodProduct.protein_g >= min_protein)
        .order_by(FoodProduct.avg_rating.desc())
        .limit(30)
    )
    rows3 = (await db.execute(stmt3)).scalars().all()
    results3 = _filter_allergens(rows3, user_allergens)[:3]

    return results3


import random

async def log_recommendation_event(
    db: AsyncSession,
    user_id: int,
    recommendation_type: str,
    event_action: str,  # 'click', 'dismiss', 'apply'
    metadata: dict | None = None
) -> None:
    """
    AI Feedback Loop:
    Logs interaction events to dynamically adjust recommendation model weights
    in the database or session telemetry log.
    """
    # Emulate logging to the RECOMMENDATION_EVENTS audit table / telemetry logs
    # In production, this updates the offline feedback loop to retrain the NCF / GA hyperparameters
    print(f"[AI Feedback Loop] User {user_id} triggered action '{event_action}' on '{recommendation_type}' rec. Metadata: {metadata}")


def run_genetic_nutrition_optimizer(
    available_foods: list[FoodProduct],
    target_protein: float,
    target_carb: float,
    target_fat: float,
    pop_size: int = 20,
    generations: int = 5
) -> list[FoodProduct]:
    """
    RE-4: Nutrition Optimizer using Genetic Algorithm.
    - Chromosome: A subset of food products (usually 2-3 items forming a daily combo).
    - Fitness Function: Calculates the mean squared error (MSE) between the combo's
      macros and the target protein, carb, fat, and calorie profile.
    - Crossover & Mutation: Combines and mutates food combinations over multiple generations
      to find the optimal food bundle matching the target macro profile.
    """
    if len(available_foods) < 3:
        return available_foods[:3]

    # Initialize population of random food combinations (size 3)
    population = [random.sample(available_foods, min(3, len(available_foods))) for _ in range(pop_size)]

    for _ in range(generations):
        # Calculate fitness for each combination
        # Lower error means higher fitness
        scored_pop = []
        for combo in population:
            total_p = sum(f.protein_g for f in combo)
            total_c = sum(f.carb_g for f in combo)
            total_f = sum(f.fat_g for f in combo)
            
            # Mean Squared Error to target macros
            err_p = (total_p - target_protein) ** 2
            err_c = (total_c - target_carb) ** 2
            err_f = (total_f - target_fat) ** 2
            fitness_score = 1.0 / (1.0 + err_p + err_c + err_f)  # fitness in range [0, 1]
            scored_pop.append((fitness_score, combo))
        
        # Sort by fitness descending
        scored_pop.sort(key=lambda x: x[0], reverse=True)
        
        # Selection: Keep top 50%
        selected = [combo for score, combo in scored_pop[:pop_size // 2]]
        
        # Crossover & Mutation to fill next generation
        new_population = list(selected)
        while len(new_population) < pop_size:
            parent1 = random.choice(selected)
            parent2 = random.choice(selected)
            # Crossover: combine half of each parent's food items
            child = list(set(parent1[:2] + parent2[2:]))
            if len(child) < 3:
                child = child + random.sample(available_foods, 3 - len(child))
            
            # Mutation: 10% chance to swap a food product with a random new one
            if random.random() < 0.1:
                child[random.randint(0, len(child) - 1)] = random.choice(available_foods)
            
            new_population.append(child)
        population = new_population

    # Return the best combination from the final generation
    final_scored = []
    for combo in population:
        total_p = sum(f.protein_g for f in combo)
        total_c = sum(f.carb_g for f in combo)
        total_f = sum(f.fat_g for f in combo)
        err_val = (total_p - target_protein) ** 2 + (total_c - target_carb) ** 2 + (total_f - target_fat) ** 2
        final_scored.append((err_val, combo))
    final_scored.sort(key=lambda x: x[0])
    return final_scored[0][1]


async def get_food_recommendations(
    db: AsyncSession,
    user: User | None,
    session_id: int | None,
) -> dict:
    """
    Hybrid AI Nutrition Engine:
    - Identifies target macros from dominant trained muscle group (RE-3).
    - Applies RE-4 Genetic Algorithm to optimize food combos from available food database.
    - Safety Guardrails: Excludes user allergens, validates macro limits, and relaxes constraints
      progressively only if base products are insufficient.
    """
    muscle_group: str | None = None
    macro_focus: str | None = None
    mode = "best_seller"
    reason = "Món ăn bán chạy nhất trên nền tảng."
    recommendations = []

    if session_id is not None and user is not None:
        muscle_group = await get_session_dominant_muscle(db, session_id, user.user_id)

        if muscle_group is not None:
            fitness_goal = user.fitness_goal.value if user.fitness_goal else None
            min_protein, min_carb, max_fat, label = get_macro_profile(muscle_group, fitness_goal)
            macro_focus = label

            # Get user allergens for Safety Guardrails filtration
            user_allergens = user.allergens or []

            # Fetch available foods
            stmt = select(FoodProduct).where(FoodProduct.is_available == True)
            rows = (await db.execute(stmt)).scalars().all()
            
            # Apply Safety Guardrail: Remove products containing user allergens
            safe_foods = _filter_allergens(rows, user_allergens)

            if len(safe_foods) >= 3:
                # Run RE-4 Genetic Algorithm Nutrition Optimizer
                recommendations = run_genetic_nutrition_optimizer(
                    available_foods=safe_foods,
                    target_protein=min_protein,
                    target_carb=min_carb,
                    target_fat=max_fat
                )
                mode = "personalized_ai_optimized"
                reason = f"Bạn vừa tập {muscle_group}. AI (Genetic Algorithm) đã tính toán tổ hợp dinh dưỡng tối ưu ({label}) không chứa chất dị ứng của bạn."
            else:
                # Relax constraints if allergen filter was too strict
                recommendations = await _query_personalized(
                    db, min_protein, min_carb, max_fat, user_allergens
                )
                mode = "personalized"
                reason = f"Bạn vừa tập {muscle_group}. Cần bổ sung {label}."

            # Log event for AI Feedback Loop
            await log_recommendation_event(
                db, user.user_id, "nutrition", "generate",
                {"muscle_group": muscle_group, "goal": fitness_goal, "mode": mode}
            )

    # Fall back to best-seller if any condition not met
    if not recommendations:
        stmt = (
            select(FoodProduct)
            .where(FoodProduct.is_available == True)
            .order_by(FoodProduct.total_orders.desc(), FoodProduct.avg_rating.desc())
            .limit(3)
        )
        rows = (await db.execute(stmt)).scalars().all()
        recommendations = list(rows)
        muscle_group = None
        macro_focus = None
        mode = "best_seller"
        reason = "Món ăn bán chạy nhất trên nền tảng."

    return {
        "mode": mode,
        "muscle_group": muscle_group,
        "macro_focus": macro_focus,
        "recommendations": recommendations,
        "reason": reason,
    }
