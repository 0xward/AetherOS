import { NextRequest, NextResponse } from 'next/server';
import { AetherOS } from '@0xward/aetheros-core';

// GET /api/network-pulse
// Live Stacks network health, powered by @0xward/aetheros-core.
export async function GET(req: NextRequest) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'GROQ_API_KEY is not configured on the server.' },
      { status: 500 }
    );
  }

  const network = req.nextUrl.searchParams.get('network') === 'testnet' ? 'testnet' : 'mainnet';

  try {
    const client = new AetherOS({ apiKey, network });
    const health = await client.getNetworkHealth();

    return NextResponse.json({
      health,
      sdkVersion: client.getVersion(),
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message || 'Unknown error from aetheros-core.' },
      { status: 500 }
    );
  }
}
