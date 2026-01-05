import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Priority order for IP detection
  const cfConnectingIp = request.headers.get('cf-connecting-ip');
  const xForwardedFor = request.headers.get('x-forwarded-for');
  const xRealIp = request.headers.get('x-real-ip');

  let ip: string = 'unknown';

  if (cfConnectingIp) {
    ip = cfConnectingIp;
  } else if (xForwardedFor) {
    // Take the first IP from the comma-separated list
    ip = xForwardedFor.split(',')[0].trim();
  } else if (xRealIp) {
    ip = xRealIp;
  }

  return NextResponse.json({ ip });
}

