import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const sector = searchParams.get('sector') || 'all';
  const limit = parseInt(searchParams.get('limit') || '20');
  const tickers = searchParams.get('tickers')?.split(',') || [];

  try {
    // Call Python backend or news service
    const apiUrl = process.env.QUANT_ENGINE_URL || 'http://localhost:8000';
    const params = new URLSearchParams({
      sector,
      limit: limit.toString(),
      ...(tickers.length > 0 && { tickers: tickers.join(',') }),
    });

    const response = await fetch(`${apiUrl}/api/news?${params}`);

    if (!response.ok) {
      throw new Error('Failed to fetch news');
    }

    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching news:', error);

    // Return mock data for now
    const mockNews = [
      {
        id: '1',
        type: 'news',
        title: 'Real Estate Market Shows Signs of Recovery',
        source: 'Financial Times',
        timestamp: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 min ago
        sector: 'real-estate',
        sentiment: 'positive',
        url: 'https://example.com/news/1',
      },
      {
        id: '2',
        type: 'market_update',
        title: 'Interest Rates Hold Steady at 3.5%',
        source: 'Bloomberg',
        timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 min ago
        sector: 'all',
        sentiment: 'neutral',
        url: 'https://example.com/news/2',
      },
    ];

    return NextResponse.json(mockNews);
  }
}
