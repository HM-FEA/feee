# Market Data API

Python FastAPI service for fetching stock market data using Yahoo Finance.

## Features

- Real-time stock data fetching
- Batch stock data retrieval
- Historical price data
- News integration (placeholder)
- Fast and lightweight

## Setup

### Local Development

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the server
uvicorn app.main:app --reload --port 8000
```

### Docker

```bash
# Build image
docker build -t nexus-alpha/market-data-api .

# Run container
docker run -p 8000:8000 nexus-alpha/market-data-api
```

## API Endpoints

### Get Single Stock

```http
GET /api/stocks/{ticker}
```

Example:
```bash
curl http://localhost:8000/api/stocks/VNQ
```

### Get Multiple Stocks

```http
POST /api/stocks/batch
Content-Type: application/json

{
  "tickers": ["VNQ", "SCHH", "IYR"]
}
```

### Get Historical Data

```http
GET /api/stocks/{ticker}/history?period=1mo
```

Periods: `1d`, `5d`, `1mo`, `3mo`, `6mo`, `1y`, `5y`

### Get News

```http
GET /api/news?sector=real-estate&limit=20
```

## Environment Variables

```bash
PORT=8000
HOST=0.0.0.0
REDIS_URL=redis://localhost:6379  # Optional for caching
CORS_ORIGINS=http://localhost:3000
```

## Real Estate Tickers

### Korean REITs
- `293940` - 신한알파리츠
- `377190` - 이리츠코크렙
- `338100` - NH프라임리츠
- `365550` - ESR켄달스퀘어리츠
- `448730` - 삼성FN리츠

### US Real Estate ETFs
- `VNQ` - Vanguard Real Estate ETF
- `SCHH` - Schwab US REIT ETF
- `IYR` - iShares US Real Estate ETF
- `XLRE` - Real Estate Select Sector SPDR Fund
- `RWR` - SPDR Dow Jones REIT ETF

## Testing

```bash
# Test single stock
curl http://localhost:8000/api/stocks/VNQ

# Test batch
curl -X POST http://localhost:8000/api/stocks/batch \
  -H "Content-Type: application/json" \
  -d '{"tickers": ["VNQ", "SCHH"]}'

# Test historical
curl http://localhost:8000/api/stocks/VNQ/history?period=1mo
```

## Deployment

### Vercel

This service can be deployed as a Vercel serverless function or as a separate service on platforms like:

- Railway
- Render
- Fly.io
- AWS Lambda

### Production Notes

- Add Redis caching for frequently accessed data
- Implement rate limiting
- Add API authentication
- Configure proper CORS origins
- Set up monitoring and logging

## Dependencies

- `fastapi` - Web framework
- `yfinance` - Yahoo Finance data
- `uvicorn` - ASGI server
- `pydantic` - Data validation
- `pandas` - Data manipulation
- `numpy` - Numerical operations

## License

MIT
