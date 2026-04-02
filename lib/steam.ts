export interface SteamGame {
  appid: number;
  name: string;
  playtime_forever: number; // minutes
  img_icon_url: string;
}

export interface SteamProfile {
  totalMinutes: number;
  totalHours: number;
  gameCount: number;
  topGames: {
    name: string;
    hours: number;
    appid: number;
    iconUrl: string;
  }[];
}

/**
 * Extracts a Steam ID or vanity name from various input formats:
 * - Raw 64-bit Steam ID: "76561198012345678"
 * - Vanity URL: "myusername"
 * - Full profile URL: "https://steamcommunity.com/id/myusername"
 * - Full profile URL: "https://steamcommunity.com/profiles/76561198012345678"
 */
export function parseSteamInput(input: string): {
  type: "steamid" | "vanity";
  value: string;
} {
  const trimmed = input.trim();

  // Full URL with /profiles/ (numeric ID)
  const profilesMatch = trimmed.match(
    /steamcommunity\.com\/profiles\/(\d+)/
  );
  if (profilesMatch) {
    return { type: "steamid", value: profilesMatch[1] };
  }

  // Full URL with /id/ (vanity)
  const idMatch = trimmed.match(
    /steamcommunity\.com\/id\/([^/\s?]+)/
  );
  if (idMatch) {
    return { type: "vanity", value: idMatch[1] };
  }

  // Raw 17-digit Steam ID
  if (/^\d{17}$/.test(trimmed)) {
    return { type: "steamid", value: trimmed };
  }

  // Assume vanity name
  return { type: "vanity", value: trimmed };
}

export async function resolveVanityURL(
  apiKey: string,
  vanityurl: string
): Promise<string> {
  const url = `https://api.steampowered.com/ISteamUser/ResolveVanityURL/v1/?key=${apiKey}&vanityurl=${encodeURIComponent(vanityurl)}`;
  const res = await fetch(url);
  const data = await res.json();

  if (data.response?.success !== 1) {
    throw new Error("Could not find a Steam profile with that name. Check the URL or try your 64-bit Steam ID.");
  }

  return data.response.steamid;
}

export async function fetchOwnedGames(
  apiKey: string,
  steamid: string
): Promise<SteamProfile> {
  const url = `https://api.steampowered.com/IPlayerService/GetOwnedGames/v1/?key=${apiKey}&steamid=${steamid}&include_played_free_games=true&include_appinfo=true&format=json`;
  const res = await fetch(url);
  const data = await res.json();

  if (!data.response?.games) {
    throw new Error(
      "This profile's game details are private. Make your game details public in Steam Settings > Privacy, or enter your hours manually."
    );
  }

  const games: SteamGame[] = data.response.games;
  const totalMinutes = games.reduce((sum, g) => sum + g.playtime_forever, 0);

  const topGames = games
    .filter((g) => g.playtime_forever > 0)
    .sort((a, b) => b.playtime_forever - a.playtime_forever)
    .slice(0, 10)
    .map((g) => ({
      name: g.name,
      hours: Math.round((g.playtime_forever / 60) * 10) / 10,
      appid: g.appid,
      iconUrl: g.img_icon_url
        ? `https://media.steampowered.com/steamcommunity/public/images/apps/${g.appid}/${g.img_icon_url}.jpg`
        : "",
    }));

  return {
    totalMinutes,
    totalHours: Math.round(totalMinutes / 60),
    gameCount: data.response.game_count ?? games.length,
    topGames,
  };
}
