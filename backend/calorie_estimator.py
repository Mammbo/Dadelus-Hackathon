import re
import random
from typing import List, Dict

# ------------------------------
# Local Calorie Estimator
# ------------------------------
def local_calorie_estimate(meal_name: str, dietary_restrictions: List[str] = None) -> Dict:
    """
    Returns estimated calories, confidence, and reasoning using heuristics.
    """
    if dietary_restrictions is None:
        dietary_restrictions = []

    meal = meal_name.lower()
    # Basic calorie table
    calorie_table = {
        "salad": (150, 350),
        "burger": (600, 900),
        "chicken": (300, 600),
        "tofu": (200, 400),
        "pasta": (400, 700),
        "pizza": (600, 900),
        "soup": (150, 350),
    }

    base_low, base_high = (350, 600)
    matched_terms = []

    for term, (low, high) in calorie_table.items():
        if term in meal:
            base_low, base_high = low, high
            matched_terms.append(term)
            break

    adjustment = 1.0
    reasons = []

    if any(d in ["vegan", "vegetarian"] for d in dietary_restrictions):
        adjustment *= 0.85
        reasons.append("Lower calories for plant-based meal.")
    if "gluten-free" in dietary_restrictions:
        adjustment *= 0.95
        reasons.append("Gluten-free meals often slightly lighter.")

    est_calories = int(random.uniform(base_low, base_high) * adjustment)
    confidence = 0.6 if not matched_terms else 0.8
    '''
    return {
        "meal": meal_name,
        "estimated_calories": est_calories,
        "confidence": confidence,
        "reasoning": (
            f"Matched keywords: {', '.join(matched_terms) if matched_terms else 'none'}. "
            + " ".join(reasons) if reasons else ""
        ),
    }
    '''
    return est_calories

