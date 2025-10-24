from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

try:
    from backend.dedalus_runner import (
        DedalusConfig,
        run_dedalus_calorie_estimator,
        run_dedalus_research,
    )
except ImportError:  # fallback when running inside backend folder
    from dedalus_runner import (
        DedalusConfig,
        run_dedalus_calorie_estimator,
        run_dedalus_research,
    )

app = FastAPI(title="Dedalus Research API")


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
    return CalorieResponse(estimated_calories=result)


@app.get("/healthz")
async def healthz():
    return {"status": "ok"}
