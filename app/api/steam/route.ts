import { NextRequest, NextResponse } from "next/server";
import {
  parseSteamInput,
  resolveVanityURL,
  fetchOwnedGames,
} from "@/lib/steam";

// In-memory rate limiter: max 30 requests per minute per IP
const rateLimit = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW = 60_000;
const RATE_LIMIT_MAX = 30;

// Simple response cache: avoid redundant Steam API calls
const cache = new Map<string, { data: unknown; expiresAt: number }>();
const CACHE_TTL = 5 * 60_000; // 5 minutes

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimit.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimit.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return false;
  }
  entry.count++;
  return entry.count > RATE_LIMIT_MAX;
}

export async function GET(request: NextRequest) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    "unknown";

  if (isRateLimited(ip)) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  const input = request.nextUrl.searchParams.get("input");

  if (!input || input.length > 200 || !/^[\w:/.?=&%-]+$/.test(input)) {
    return NextResponse.json(
      { error: "Invalid input" },
      { status: 400 }
    );
  }

  const apiKey = process.env.STEAM_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Server configuration error" },
      { status: 500 }
    );
  }

  // Check cache
  const cached = cache.get(input);
  if (cached && Date.now() < cached.expiresAt) {
    return NextResponse.json(cached.data);
  }

  try {
    const parsed = parseSteamInput(input);

    let steamid: string;
    if (parsed.type === "vanity") {
      steamid = await resolveVanityURL(apiKey, parsed.value);
    } else {
      steamid = parsed.value;
    }

    const profile = await fetchOwnedGames(apiKey, steamid);

    // Cache successful responses
    cache.set(input, { data: profile, expiresAt: Date.now() + CACHE_TTL });

    return NextResponse.json(profile);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to fetch Steam data";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
