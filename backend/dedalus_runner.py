import asyncio
import json
import os
import re
from dataclasses import dataclass
from typing import Iterable, Optional

from dedalus_labs import AsyncDedalus, DedalusRunner
from dotenv import load_dotenv
from dedalus_labs.utils.streaming import stream_async

load_dotenv()

# ------------------------------
# Dedalus AI Runner
# ------------------------------
@dataclass
class DedalusConfig:
    """Runtime configuration for Dedalus requests."""

    model: str = "openai/gpt-4.1"
    mcp_servers: Optional[Iterable[str]] = None


def _ensure_api_key() -> str | None:
    """Return the configured API key or None if missing."""
    dedalus_key = os.getenv("DEDALUS_API_KEY")
    if not dedalus_key:
        print("No Dedalus API key found. Set DEDALUS_API_KEY in your environment to enable remote calls.")
        return None
    return dedalus_key


async def run_dedalus_calorie_estimator(meal_name: str, dietary_restrictions: list[str]):
    """
    Uses Dedalus AI to estimate calories for a meal.
    Falls back to None if no DEDALUS_API_KEY.
    """
    if not _ensure_api_key():
        print("Using local estimator only.")
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
        return output_dict['estimated_calories']
    except json.JSONDecodeError:
        print("Error parsing AI output as JSON:")
        print(output)
        return None
    except KeyError:
        print("JSON output does not contain 'estimated_calories'")
        return None


async def run_dedalus_research(query: str, config: DedalusConfig | None = None) -> str | None:
    """
    Execute a research-oriented query using Dedalus with optional MCP search providers.

    Returns the final string output or None if the API key is not configured.
    """
    if not _ensure_api_key():
        return None

    cfg = config or DedalusConfig()
    client = AsyncDedalus()
    runner = DedalusRunner(client)

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
    prompt = """ You are a web scraping agent. Visit https://liondine.com/
 and extract today’s dining information for all Columbia dining halls shown on the site.

What to collect (for each dining hall)

hallName: display name on the page (e.g., “John Jay Dining Hall”, “Ferris Booth Commons”, “JJ’s Place”, “Grace Dodge Dining Hall”, etc.).

date: ISO date in campus timezone (America/New_York) for the data you’re returning.

hours: list of open time windows (text and, if possible, start/end in 24h HH:MM):

Example entries: { "label": "Breakfast", "start": "08:00", "end": "10:30" } or { "label": "Open", "text": "8:00 AM – 10:30 AM" }

meals: array of meal blocks you find (Breakfast/Lunch/Dinner/Late Night/etc.). For each meal:

slot: "breakfast" | "lunch" | "dinner" | "late-night" | "brunch" | "other" (lowercase; choose the closest match).

time: optional { "start": "HH:MM", "end": "HH:MM", "text": "…" } if the page shows meal-specific times.

items: array of menu items. For each item:

name: cleaned dish name (title case; strip emojis/extra punctuation).

station: if the site groups items by station (e.g., Grill, Deli, Vegan), capture it; otherwise omit.

tags: detect common dietary hints present on the page text (lowercase): ["vegan","vegetarian","gluten-free","halal","kosher","contains-nuts","contains-dairy","contains-eggs","contains-soy","contains-shellfish"]. If unknown, omit.

source: { "url": "<the exact URL you scraped>", "fetchedAt": <unix epoch ms> }

Normalization rules

Date/timezone: use America/New_York for any parsing; format dates YYYY-MM-DD.

Meal slot mapping: map headings like “Brunch”→brunch, “Late Night”→late-night. If ambiguous, use other.

Clean names: trim, collapse whitespace, remove bullets/emojis, keep ASCII where possible.

Deduplicate identical items within a meal (case-insensitive).

If a hall appears but has no menu items, return it with an empty meals: [] and include any hours you can find.

If a page is JS-rendered, execute the page and wait for content; otherwise parse static HTML. Retry each hall up to 2 times on transient errors.

Be conservative with tags: only set a tag if the page explicitly indicates it (badges/labels/keywords)."""



    research_config = DedalusConfig(
        model="openai/gpt-4.1",
        mcp_servers=[
            "windsor/brave-search-mcp",
        ],
    )

    output = run_research_sync(prompt, research_config)
    if output:
        print("Web Search Results:\n")
        print(output)
    else:
        print("Unable to contact Dedalus – ensure DEDALUS_API_KEY is set.")
