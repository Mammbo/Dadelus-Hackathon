import asyncio
from calorie_estimator import local_calorie_estimate
#from calorie_estimator import local_calorie_estimate, parse_calorie_output
from dedalus_runner import run_dedalus_calorie_estimator

async def main():
    meal_name = "Vegan Tofu Bowl"
    restrictions = ["vegan"]

    # Dedalus AI estimation
    ai_result = await run_dedalus_calorie_estimator(meal_name, restrictions)
    if ai_result:
        print("\n=== Dedalus AI Estimation ===")
        print(ai_result)
        #parsed_ai = parse_calorie_output(ai_result)
        #print("Parsed AI Output:", parsed_ai)

    # Local heuristic estimation
    print("\n=== Local Heuristic Estimation ===")
    local_result = local_calorie_estimate(meal_name, restrictions)
    print(local_result)

if __name__ == "__main__":
    asyncio.run(main())
