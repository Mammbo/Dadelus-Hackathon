import asyncio
from dedalus_labs import AsyncDedalus, DedalusRunner
from dotenv import load_dotenv
from calorie_estimatorV2 import local_calorie_estimate
from dedalus_runnerV2 import estimate_calories

load_dotenv()

# ------------------------------
# Example dining halls data
# ------------------------------
dining_halls = {
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

# ------------------------------
# Example user profile
# ------------------------------
user_profile = {
    "age": 20,
    "weight": 150,
    "dietary_preferences": ["vegan", "gluten-free"],
    "goal": "Build Muscle",  # options: Build Muscle, Lose Weight, Maintain Weight
}

# ------------------------------
# Helper: score a meal based on goal and dietary match
# ------------------------------
async def score_meal(meal_name: str, meal_diet: list[str], user_prefs: list[str], goal: str) -> float:
    """
    Returns a numeric score for a meal:
    - 0 if dietary preferences are not met
    - Higher calories for 'Build Muscle'
    - Lower calories for 'Lose Weight'
    """
    # Check dietary match: all user preferences must be satisfied
    if not all(pref in meal_diet for pref in user_prefs):
        return 0.0

    # Estimate calories
    #est = local_calorie_estimate(meal_name, user_prefs)["estimated_calories"]
    est = await estimate_calories(meal_name, user_prefs)

    # Adjust score based on goal
    if goal.lower() == "build muscle":
        score = est  # higher calories = higher score
    elif goal.lower() == "lose weight":
        score = max(0, 500 - est)  # lower calories = higher score
    else:
        score = 100  # neutral for maintain weight

    return score

# ------------------------------
# Score dining halls
# ------------------------------
async def score_dining_halls(dining_halls: dict, user_profile: dict) -> list[dict]:
    """
    Returns a ranked list of dining halls with scores and matching meals.
    """
    ranked = []

    for hall_name, meals in dining_halls.items():
        hall_score = 0
        matching_meals = []

        for meal in meals:
            score = await score_meal(
                meal_name=meal["meal"],
                meal_diet=meal["dietary"],
                user_prefs=user_profile["dietary_preferences"],
                goal=user_profile["goal"]
            )
            if score > 0:
                matching_meals.append(meal["meal"])
            hall_score += score

        ranked.append({
            "dining_hall": hall_name,
            "score": hall_score,
            "matching_meals": matching_meals
        })

    # Sort descending by score
    ranked.sort(key=lambda x: x["score"], reverse=True)
    return ranked

# ------------------------------
# Main agent function
# ------------------------------
async def main():
    client = AsyncDedalus()
    runner = DedalusRunner(client)

    # Pre-score dining halls using local calorie estimator
    ranked_halls = await score_dining_halls(dining_halls, user_profile)

    # Dedalus reasoning prompt
    prompt = f"""
    You are a nutritionist AI assistant.

    User Profile:
    {user_profile}

    Pre-scored Dining Halls(Based on Calorie and Dietary Restrictions:
    {ranked_halls}

    Dining Hall Info:
    {dining_halls}

    Task:
    Recommend the best dining hall for this user based on the precomputed scores,
    dietary fit, and user goal. Explain your reasoning in plain text.
    """

    result = await runner.run(
        input=prompt,
        model="openai/gpt-5",
        tools=[]  # No tools needed; scoring done locally
    )

    print("\n=== Ranked Dining Halls (Numeric Scores) ===")
    for hall in ranked_halls:
        print(hall)

    print("\n=== Dedalus Recommendation & Reasoning ===")
    print(result.final_output)


if __name__ == "__main__":
    asyncio.run(main())
