import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { tickers } = await request.json();

    if (!Array.isArray(tickers) || tickers.length === 0) {
      return NextResponse.json(
        { error: 'Invalid tickers array' },
        { status: 400 }
      );
    }

    // Call Python backend
    const apiUrl = process.env.QUANT_ENGINE_URL || 'http://localhost:8000';
    const response = await fetch(`${apiUrl}/api/stocks/batch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tickers }),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch batch stock data');
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching batch stock data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch batch stock data' },
      { status: 500 }
    );
  }
}
