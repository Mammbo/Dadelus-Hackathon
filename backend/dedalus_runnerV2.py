import asyncio
from dedalus_labs import AsyncDedalus, DedalusRunner
from dotenv import load_dotenv
from dedalus_labs.utils.streaming import stream_async
import json
from calorie_estimatorV2 import local_calorie_estimate
import os
import re

load_dotenv()

# ------------------------------
# Dedalus AI Runner
# ------------------------------
async def run_dedalus_calorie_estimator(meal_name: str, dietary_restrictions: list[str]):
    """
    Uses Dedalus AI to estimate calories for a meal.
    Falls back to None if no DEDALUS_API_KEY.
    """
    dedalus_key = os.getenv("DEDALUS_API_KEY")
    if not dedalus_key:
        print("No Dedalus API key found. Using local estimator only.")
        return None

    client = AsyncDedalus()
    runner = DedalusRunner(client)

    query = f"""
    You are a professional nutritionist and culinary expert. Your task is to estimate the caloric content of a meal given its name and dietary restrictions. To do this, you must first synthesize a plausible, standard recipe for a SINGLE serving that strictly odheres to the dietary restrictions.
    Then calculate the total calories based on the ingredients and their standard nutritional values.

    Estimate the calories and dietary fit for this meal:
    - Meal name: {meal_name}
    - Dietary restrictions: {', '.join(dietary_restrictions) or 'None'}

    Provide your final answer in a JSON object with the keys 'estimated_calories' (integer), 'ingredient_list' (array of strings, containes each ingredient in the recipe), 'ingredient_calories' (array of integers, contains the calories for each ingredient in 'ingredient_list'), 'justification' (string, explaining the synthesized recipe and calculation)
    """

    result = await runner.run(
        input=query,
        model="openai/gpt-4.1",
        mcp_servers=[
            # Optional: Add MCP servers here
        ],
    )
    output = result.final_output
    cleaned = re.sub(r'//.*', '', output)
    try:
        output_dict = json.loads(cleaned)
        return output_dict
    except json.JSONDecodeError:
        print("Error parsing AI output as JSON:")
        print(output)
        return None
    except KeyError:
        print("JSON output does not contain 'estimated_calories'")
        return None
# Dedalus Estimator with Backup
async def estimate_calories(meal_name: str, dietary_preferences: list[str]) -> int:
    """
    Estimate calories for a meal using Dedalus AI first.
    Falls back to local heuristic if Dedalus fails.
    """
    dedalus_key = os.getenv("DEDALUS_API_KEY")
    if not dedalus_key:
        # No key, use local heuristic
        return local_calorie_estimate(meal_name, dietary_preferences)["estimated_calories"]

    client = AsyncDedalus()
    runner = DedalusRunner(client)

    prompt = f"""
    You are a professional nutritionist and culinary expert.
    Estimate the caloric content of a SINGLE serving meal with the given dietary restrictions.
    
    Meal name: {meal_name}
    Dietary restrictions: {', '.join(dietary_preferences) or 'None'}
    
    Provide your output in strict JSON with:
    {{
        "estimated_calories": <integer>
    }}
    """

    try:
        result = await runner.run(
            input=prompt,
            model="openai/gpt-4.1",
            mcp_servers=[],
        )
        output_str = result.final_output

        # Remove any comments or trailing text
        output_clean = "".join(line.split("//")[0] for line in output_str.splitlines())
        data = json.loads(output_clean)

        return data.get("estimated_calories", local_calorie_estimate(meal_name, dietary_preferences)["estimated_calories"])

    except Exception as e:
        print(f"Dedalus calorie estimation failed: {e}")
        # Fallback to local heuristic
        return local_calorie_estimate(meal_name, dietary_preferences)["estimated_calories"]