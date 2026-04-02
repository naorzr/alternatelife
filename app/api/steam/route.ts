import { NextRequest, NextResponse } from "next/server";
import {
  parseSteamInput,
  resolveVanityURL,
  fetchOwnedGames,
} from "@/lib/steam";

export async function GET(request: NextRequest) {
  const input = request.nextUrl.searchParams.get("input");

  if (!input) {
    return NextResponse.json(
      { error: "Missing 'input' parameter" },
      { status: 400 }
    );
  }

  const apiKey = process.env.STEAM_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Steam API key not configured" },
      { status: 500 }
    );
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
    return NextResponse.json(profile);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Failed to fetch Steam data";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
