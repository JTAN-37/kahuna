from dotenv import load_dotenv
load_dotenv()

import pathlib
from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

from backend.routers import stocks, analysis

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(stocks.router)
app.include_router(analysis.router)

dist = pathlib.Path(__file__).parent.parent / "frontend" / "dist"
if dist.exists():
    app.mount("/", StaticFiles(directory=str(dist), html=True), name="static")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
