import asyncio
import os
from pathlib import Path
from typing import Any, Dict, Iterable, List, Tuple

try:
    from dotenv import load_dotenv  # type: ignore
except ImportError:
    load_dotenv = None

try:
    from backend.calorie_estimator import local_calorie_estimate
    from backend.dedalus_runner import (
        DedalusConfig,
        run_dedalus_calorie_estimator,
        run_dedalus_research,
    )
except ImportError:
    from calorie_estimator import local_calorie_estimate  # type: ignore
    from dedalus_runner import (  # type: ignore
        DedalusConfig,
        run_dedalus_calorie_estimator,
        run_dedalus_research,
    )

BACKEND_DIR = Path(__file__).resolve().parent
ENV_PATH = BACKEND_DIR / ".env"

if load_dotenv:
    load_dotenv(ENV_PATH)
elif ENV_PATH.exists():
    for line in ENV_PATH.read_text().splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, value = line.split("=", 1)
        os.environ.setdefault(key.strip(), value.strip().strip('"').strip("'"))


async def score_meal(
    meal_name: str,
    meal_diet: Iterable[str],
    user_prefs: Iterable[str],
    goal: str,
) -> Tuple[float, Dict[str, Any]]:
    """Score a meal for the given user goal and dietary needs."""
    prefs = list(user_prefs)
    if not all(pref in meal_diet for pref in prefs):
        return 0.0, {}

    remote = await run_dedalus_calorie_estimator(meal_name, list(prefs))
    if isinstance(remote, dict):
        calories = remote.get("estimated_calories")
    else:
        calories = remote

    if calories is None:
        calories = local_calorie_estimate(meal_name, list(prefs))

    if goal.lower() == "build muscle":
        score = float(calories)
    elif goal.lower() == "lose weight":
        score = max(0.0, 500 - float(calories))
    else:
        score = 100.0

    return score, {"meal": meal_name, "calories": calories}


async def score_dining_halls(
    dining_halls: Dict[str, List[Dict[str, Any]]],
    user_profile: Dict[str, Any],
) -> List[Dict[str, Any]]:
    """Return a sorted list of dining halls with scores and qualifying meals."""
    ranked: List[Dict[str, Any]] = []
    prefs = user_profile.get("dietary_preferences", [])
    goal = user_profile.get("goal", "maintain weight")

    for hall_name, meals in dining_halls.items():
        hall_score = 0.0
        suggestions: List[Dict[str, Any]] = []

        for meal in meals:
            score, detail = await score_meal(
                meal_name=meal["meal"],
                meal_diet=meal.get("dietary", []),
                user_prefs=prefs,
                goal=goal,
            )
            hall_score += score
            if detail:
                suggestions.append(detail)

        ranked.append(
            {
                "dining_hall": hall_name,
                "score": hall_score,
                "suggested_meals": suggestions,
            }
        )

    ranked.sort(key=lambda x: x["score"], reverse=True)
    return ranked


async def generate_onboarding_summary(
    user_profile: Dict[str, Any],
    dining_halls: Dict[str, List[Dict[str, Any]]],
) -> Dict[str, Any]:
    """Produce a textual summary and supporting data for the onboarding flow."""
    ranked_halls = await score_dining_halls(dining_halls, user_profile)

    prompt = f"""
You are a campus dining assistant. Craft a concise, positive message for a student who just completed onboarding.

User profile:
{user_profile}

Pre-scored dining halls (higher score = better fit):
{ranked_halls}

Dining hall data supplied:
{dining_halls}

Respond with a short block of text (2-3 paragraphs) that:
1. Highlights the top dining hall choices and why they match the student's goals/preferences.
2. Suggests at least one meal item that fits their diet from each top pick.
3. Encourages them to explore the app further.
"""

    recommendation = await run_dedalus_research(
        prompt,
        DedalusConfig(model="openai/gpt-4.1"),
    )

    if recommendation:
        return {
            "summary": recommendation.strip(),
            "ranked_halls": ranked_halls,
        }

    lines = ["Thanks for completing onboarding! Here are great spots to try next:"]
    for hall in ranked_halls[:3]:
        meal_names = ", ".join(m["meal"] for m in hall["suggested_meals"]) or "options that suit your preferences"
        lines.append(f"- {hall['dining_hall']}: {meal_names}")
    lines.append("Open the dining view to see live menus and more recommendations.")
    return {
        "summary": "\n".join(lines),
        "ranked_halls": ranked_halls,
    }


def generate_onboarding_summary_sync(
    user_profile: Dict[str, Any],
    dining_halls: Dict[str, List[Dict[str, Any]]],
) -> Dict[str, Any]:
    """Synchronous helper for environments that cannot await."""
    return asyncio.run(generate_onboarding_summary(user_profile, dining_halls))


if __name__ == "__main__":
    demo_profile = {
        "age": 20,
        "weight": 150,
        "dietary_preferences": ["vegan", "gluten-free"],
        "goal": "Build Muscle",
    }
    demo_halls = {
        "John Jay": [
            {"meal": "Vegan Tofu Bowl", "dietary": ["vegan", "gluten-free"]},
            {"meal": "Chicken Caesar Salad", "dietary": ["gluten-free"]},
        ],
        "Ferris Booth": [
            {"meal": "Grilled Salmon", "dietary": ["pescatarian", "gluten-free"]},
            {"meal": "Cheese Pizza", "dietary": ["vegetarian"]},
        ],
        "JJ's": [
            {"meal": "Quinoa Salad", "dietary": ["vegan", "gluten-free"]},
            {"meal": "Beef Burger", "dietary": []},
        ],
    }

    result = generate_onboarding_summary_sync(demo_profile, demo_halls)
    print(result["summary"])
    print("\nRanked halls:", result["ranked_halls"])
