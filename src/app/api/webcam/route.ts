// src/app/api/webcam/route.ts (Route Handler for GET /api/webcam)
import { NextResponse } from 'next/server';
import { getRandomWebcam } from '@/lib/npsApi';

export const dynamic = 'force-dynamic'; // Ensures this runs dynamically on every request

// In-memory cache to track recently seen webcam IDs
const recentlySeenCache: string[] = [];
const MAX_CACHE_SIZE = 50; // Keep track of last 50 seen webcams

export async function GET() {
  try {
    // Get webcam excluding recently seen ones
    const webcamData = await getRandomWebcam(recentlySeenCache);

    if (!webcamData) {
      // If we couldn't find any new webcams, clear cache and try again
      recentlySeenCache.length = 0;
      return NextResponse.json(
        { message: 'Failed to find a webcam view.' },
        { status: 404 }
      );
    }

    // Add this webcam to the cache
    recentlySeenCache.push(webcamData.id);
    
    // Keep cache size manageable - remove oldest entries if too many
    if (recentlySeenCache.length > MAX_CACHE_SIZE) {
      recentlySeenCache.shift(); // Remove oldest entry
    }

    // Success: Return the dynamic webcam data
    return NextResponse.json(webcamData);
  } catch (error) {
    console.error("API Error: Fetching webcam failed:", error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}