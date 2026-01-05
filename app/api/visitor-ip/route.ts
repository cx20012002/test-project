import { NextRequest, NextResponse } from 'next/server';

// In-memory storage for visit records
const visitRecords: Array<{ ip: string; country: string; time: string }> = [];

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

  // Country detection from headers
  const cfIpCountry = request.headers.get('cf-ipcountry');
  const xVercelIpCountry = request.headers.get('x-vercel-ip-country');

  let country: string = 'Unknown';

  if (cfIpCountry) {
    country = cfIpCountry;
  } else if (xVercelIpCountry) {
    country = xVercelIpCountry;
  }

  // Treat localhost IPs as "Local"
  if (ip === '::1' || ip === '127.0.0.1') {
    country = 'Local';
  }

  // Generate visit time on server
  const visitTime = new Date().toISOString();

  // Create new visit record
  const newRecord = {
    ip,
    country,
    time: visitTime,
  };

  // Add to in-memory array
  visitRecords.push(newRecord);

  // Return all records (newest first)
  return NextResponse.json(visitRecords.slice().reverse());
}
