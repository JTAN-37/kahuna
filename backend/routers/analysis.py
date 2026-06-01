import asyncio

from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse

from backend.services.analysis import stream_analysis
from backend.services.sp500 import VALID_TICKERS
from backend.utils.tickers import normalize_ticker

router = APIRouter()


@router.get("/api/analyze/{ticker}")
async def analyze(ticker: str, name: str = "", sector: str = ""):
    ticker = normalize_ticker(ticker)
    if ticker not in VALID_TICKERS:
        raise HTTPException(status_code=400, detail="Invalid ticker")

    name = name or ticker
    loop = asyncio.get_running_loop()

    async def generate():
        queue: asyncio.Queue = asyncio.Queue()

        def _run():
            try:
                for chunk in stream_analysis(ticker, name, sector):
                    loop.call_soon_threadsafe(queue.put_nowait, chunk)
            except Exception as e:
                loop.call_soon_threadsafe(queue.put_nowait, f"\n\n[Analysis failed: {e}]")
            finally:
                loop.call_soon_threadsafe(queue.put_nowait, None)

        loop.run_in_executor(None, _run)

        while True:
            chunk = await queue.get()
            if chunk is None:
                break
            yield chunk

    return StreamingResponse(
        generate(),
        media_type="text/plain; charset=utf-8",
        headers={"X-Accel-Buffering": "no", "Cache-Control": "no-cache"},
    )
