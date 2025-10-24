import os
import sys
from pathlib import Path
from typing import List

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

BACKEND_DIR = Path(__file__).resolve().parent
PROJECT_ROOT = BACKEND_DIR.parent

for path in {str(BACKEND_DIR), str(PROJECT_ROOT)}:
    if path not in sys.path:
        sys.path.append(path)


def _load_env():
    env_path = BACKEND_DIR / ".env"
    if not env_path.exists():
        return
    try:
        from dotenv import load_dotenv  # type: ignore
    except ImportError:
        for line in env_path.read_text().splitlines():
            line = line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, value = line.split("=", 1)
            os.environ.setdefault(key.strip(), value.strip().strip('"').strip("'"))
    else:
        load_dotenv(env_path)


_load_env()

try:
    from backend.assistant import generate_onboarding_summary
    from backend.dedalus_runner import (
        DedalusConfig,
        run_dedalus_calorie_estimator,
        run_dedalus_research,
    )
except ImportError as original_error:
    try:
        from assistant import generate_onboarding_summary  # type: ignore
        from dedalus_runner import (  # type: ignore
            DedalusConfig,
            run_dedalus_calorie_estimator,
            run_dedalus_research,
        )
    except ImportError:
        raise original_error

app = FastAPI(title="Dedalus Research API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class SearchRequest(BaseModel):
    query: str
    model: str | None = None
    mcp_servers: list[str] | None = Field(default=None, description="Optional MCP server identifiers")


class SearchResponse(BaseModel):
    result: str


class CalorieRequest(BaseModel):
    meal_name: str
    dietary_restrictions: list[str] = Field(default_factory=list)


class CalorieResponse(BaseModel):
    estimated_calories: int | None


class MealInput(BaseModel):
    meal: str
    dietary: list[str] = Field(default_factory=list)


class DiningHallInput(BaseModel):
    name: str
    meals: List[MealInput] = Field(default_factory=list)


class OnboardingRequest(BaseModel):
    user_profile: dict
    dining_halls: List[DiningHallInput]


class OnboardingResponse(BaseModel):
    summary: str
    ranked_halls: list[dict]


@app.post("/search", response_model=SearchResponse)
async def search(req: SearchRequest):
    config = DedalusConfig(
        model=req.model or DedalusConfig.model,
        mcp_servers=req.mcp_servers,
    )

    result = await run_dedalus_research(req.query, config)
    if result is None:
        raise HTTPException(status_code=503, detail="Dedalus API key not configured or request failed.")
    return SearchResponse(result=result)


@app.post("/calories", response_model=CalorieResponse)
async def estimate_calories(req: CalorieRequest):
    result = await run_dedalus_calorie_estimator(req.meal_name, req.dietary_restrictions)
    if result is None:
        raise HTTPException(status_code=503, detail="Unable to estimate calories; check Dedalus configuration.")
    if isinstance(result, dict):
        calories = result.get("estimated_calories")
    else:
        calories = result
    return CalorieResponse(estimated_calories=calories)


@app.post("/onboarding-summary", response_model=OnboardingResponse)
async def onboarding_summary(req: OnboardingRequest):
    halls = {
        hall.name: [{"meal": meal.meal, "dietary": meal.dietary} for meal in hall.meals]
        for hall in req.dining_halls
    }
    result = await generate_onboarding_summary(req.user_profile, halls)
    return OnboardingResponse(summary=result["summary"], ranked_halls=result["ranked_halls"])


@app.get("/healthz")
async def healthz():
    return {"status": "ok"}
