import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { ticker: string } }
) {
  const { ticker } = params;

  try {
    // Call Python backend
    const apiUrl = process.env.QUANT_ENGINE_URL || 'http://localhost:8000';
    const response = await fetch(`${apiUrl}/api/stocks/${ticker}`);

    if (!response.ok) {
      throw new Error(`Failed to fetch stock data for ${ticker}`);
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching stock data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch stock data' },
      { status: 500 }
    );
  }
}
