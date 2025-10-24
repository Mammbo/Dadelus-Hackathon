import asyncio
import json
import os
import re
from dataclasses import dataclass
from typing import Iterable, Optional

try:
    from dedalus_labs import AsyncDedalus, DedalusRunner  # type: ignore
except ImportError:  # SDK not available in this environment
    AsyncDedalus = None  # type: ignore
    DedalusRunner = None  # type: ignore

try:
    from dedalus_labs.utils.streaming import stream_async  # type: ignore
except ImportError:  # optional helper
    stream_async = None  # type: ignore

try:
    from dotenv import load_dotenv  # type: ignore
except ImportError:  # provide a no-op loader if library missing
    def load_dotenv(*_, **__):  # type: ignore
        return False

load_dotenv()


@dataclass
class DedalusConfig:
    """Runtime configuration for Dedalus requests."""

    model: str = "openai/gpt-4.1"
    mcp_servers: Optional[Iterable[str]] = None


def _ensure_api_key() -> str | None:
    """Return the configured API key or None if missing."""
    dedalus_key = os.getenv("DEDALUS_API_KEY")
    if not dedalus_key:
        # Hard-coded competition key for local testing; replace/remove for production.
        dedalus_key = "dsk_live_f7d2591b03d8_3a47644ca49383236fa595389b74d6e7"
        os.environ["DEDALUS_API_KEY"] = dedalus_key
    return dedalus_key


async def _build_runner():
    if AsyncDedalus is None or DedalusRunner is None:
        return None
    client = AsyncDedalus()
    return DedalusRunner(client)


async def run_dedalus_calorie_estimator(meal_name: str, dietary_restrictions: list[str]):
    """
    Uses Dedalus AI to estimate calories for a meal.
    Returns a JSON dict if available, otherwise None.
    """
    if not _ensure_api_key():
        return None

    runner = await _build_runner()
    if runner is None:
        return None

    query = f"""
    You are a professional nutritionist and culinary expert. Your task is to estimate the caloric content of a meal given its name and dietary restrictions. To do this, you must first synthesize a plausible, standard recipe for a SINGLE serving that strictly adheres to the dietary restrictions.
    Then calculate the total calories based on the ingredients and their standard nutritional values.

    Estimate the calories and dietary fit for this meal:
    - Meal name: {meal_name}
    - Dietary restrictions: {', '.join(dietary_restrictions) or 'None'}

    Provide your final answer in a JSON object with the keys 'estimated_calories' (integer), 'ingredient_list' (array of strings, contains each ingredient in the recipe), 'ingredient_calories' (array of integers, contains the calories for each ingredient in 'ingredient_list'), 'justification' (string, explaining the synthesized recipe and calculation)
    """

    result = await runner.run(
        input=query,
        model="openai/gpt-4.1",
        mcp_servers=[],
    )
    output = result.final_output
    cleaned = re.sub(r'//.*', '', output)
    try:
        return json.loads(cleaned)
    except json.JSONDecodeError:
        return None


async def run_dedalus_research(query: str, config: DedalusConfig | None = None) -> str | None:
    """
    Execute a research-oriented query using Dedalus with optional MCP search providers.
    Returns the final string output or None if the SDK/API is unavailable.
    """
    if not _ensure_api_key():
        return None

    cfg = config or DedalusConfig()
    runner = await _build_runner()
    if runner is None:
        return None

    result = await runner.run(
        input=query,
        model=cfg.model,
        mcp_servers=list(cfg.mcp_servers or []),
    )
    return result.final_output


def run_research_sync(query: str, config: DedalusConfig | None = None) -> str | None:
    """Blocking helper that wraps the async research runner."""
    return asyncio.run(run_dedalus_research(query, config))


if __name__ == "__main__":
    prompt = "Latest campus dining highlights"
    print(run_research_sync(prompt) or "No research output")
