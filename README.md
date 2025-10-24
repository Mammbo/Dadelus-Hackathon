# Dadelus-Hackathon

## Backend

The backend exposes two FastAPI endpoints:

- `POST /search` – runs the Dedalus research workflow using optional MCP search servers.
- `POST /calories` – reuses the Dedalus calorie estimator to approximate nutrition info.

### Setup

1. Create a virtual environment (optional but recommended).
2. Install dependencies:
   ```bash
   pip install -r backend/requirements.txt
   ```
3. Configure secrets by creating a `.env` file with:
   ```
   DEDALUS_API_KEY=your_key_here
   ```
   The key is required for all Dedalus calls.
4. Launch the API:
   ```bash
   uvicorn backend.main:app --reload
   ```

### Example Research Request

```bash
curl -X POST http://localhost:8000/search \
  -H "Content-Type: application/json" \
  -d '{
        "query": "Latest developments in AI agents for 2024 with focus on the last 6 months",
        "mcp_servers": [
          "joerup/exa-mcp",
          "windsor/brave-search-mcp"
        ]
      }'
```

## Frontend

The React client lives in `frontend/` and uses Create React App.

```bash
cd frontend
npm install
npm start
```

Ensure the backend is running if you wire the UI to its endpoints.
