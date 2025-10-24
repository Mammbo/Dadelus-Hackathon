import asyncio
import os

import pytest
from fastapi.testclient import TestClient

from backend.main import app


client = TestClient(app)


def test_search_requires_api_key(monkeypatch):
    """Without an API key the endpoint should signal service unavailable."""
    monkeypatch.delenv("DEDALUS_API_KEY", raising=False)

    resp = client.post("/search", json={"query": "test query"})
    assert resp.status_code == 503


def test_search_returns_result_with_stub(monkeypatch):
    """With an API key and stubbed runner we return a successful payload."""
    monkeypatch.setenv("DEDALUS_API_KEY", "test-key")

    async def fake_run(query, config):
        assert "test query" in query
        return "stub-response"

    monkeypatch.setattr("backend.main.run_dedalus_research", fake_run)

    resp = client.post("/search", json={"query": "test query"})
    assert resp.status_code == 200
    assert resp.json() == {"result": "stub-response"}
