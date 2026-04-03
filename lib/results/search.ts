import type { SteamProfile } from "@/lib/steam";

type SearchParamValue = string | string[] | undefined;
type SearchParamRecord = Record<string, SearchParamValue>;

export type ResultSource = "manual" | "steam";
export type TopGame = SteamProfile["topGames"][number];

export interface ParsedResultsParams {
  hours: number;
  gameCount: number;
  source: ResultSource;
  topGames: TopGame[];
}

export async function readSearchParams(
  searchParams: Promise<SearchParamRecord> | undefined,
  context: string
): Promise<SearchParamRecord> {
  if (!searchParams) {
    console.warn(`[${context}] searchParams unavailable.`);
    return {};
  }

  try {
    const resolved = await searchParams;
    return resolved && typeof resolved === "object" ? resolved : {};
  } catch (error) {
    console.error(`[${context}] Failed to resolve search params.`, error);
    return {};
  }
}

function firstValue(value: SearchParamValue): string | undefined {
  return typeof value === "string" ? value : value?.[0];
}

function parseCount(value: string | undefined): number {
  const parsed = Number.parseInt(value ?? "0", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
}

function isTopGame(value: unknown): value is TopGame {
  return !!value
    && typeof value === "object"
    && typeof (value as TopGame).appid === "number"
    && typeof (value as TopGame).hours === "number"
    && typeof (value as TopGame).name === "string";
}

export function parseTopGamesParam(
  raw: string | undefined,
  context: string
): TopGame[] {
  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      console.warn(`[${context}] topGames must be an array.`, parsed);
      return [];
    }

    return parsed.filter(isTopGame);
  } catch (error) {
    console.warn(`[${context}] Invalid topGames search param.`, error);
    return [];
  }
}

export function parseResultsSearchParams(
  params: SearchParamRecord,
  context: string
): ParsedResultsParams {
  return {
    hours: parseCount(firstValue(params.hours)),
    gameCount: parseCount(firstValue(params.games)),
    source: firstValue(params.source) === "steam" ? "steam" : "manual",
    topGames: parseTopGamesParam(firstValue(params.topGames), context),
  };
}
