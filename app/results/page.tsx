import type { Metadata } from "next";
import { headers } from "next/headers";
import ResultsContent from "@/components/results/ResultsContent";
import { parseResultsSearchParams } from "@/lib/results/search";

const DEFAULT_METADATA_BASE = new URL("http://127.0.0.1:3000");
const INVALID_METADATA_BASE_WARNINGS = new Set<string>();

function warnInvalidMetadataBase(value: string) {
  if (INVALID_METADATA_BASE_WARNINGS.has(value)) {
    return;
  }

  INVALID_METADATA_BASE_WARNINGS.add(value);
  console.error(
    `Invalid SITE_URL/NEXT_PUBLIC_SITE_URL value "${value}". Expected an absolute URL, bare host, or path rooted at "/". Falling back to request headers for metadataBase.`
  );
}

function hasScheme(value: string): boolean {
  return /^[a-zA-Z][a-zA-Z\d+\-.]*:/.test(value);
}

function parseOriginCandidate(
  value: string | undefined,
  requestOrigin: URL | null,
  defaultProtocol: string
): URL | null {
  const trimmedValue = value?.trim();

  if (!trimmedValue) {
    return null;
  }

  const candidates: string[] = [];

  if (hasScheme(trimmedValue)) {
    candidates.push(trimmedValue);
  } else if (trimmedValue.startsWith("//")) {
    candidates.push(`${defaultProtocol}:${trimmedValue}`);
  } else if (trimmedValue.startsWith("/")) {
    candidates.push(
      new URL(trimmedValue, requestOrigin ?? DEFAULT_METADATA_BASE).toString()
    );
  } else {
    candidates.push(`${defaultProtocol}://${trimmedValue}`);
  }

  for (const candidate of candidates) {
    try {
      return new URL(candidate);
    } catch {
      continue;
    }
  }

  warnInvalidMetadataBase(trimmedValue);
  return null;
}

async function resolveMetadataBase(): Promise<URL> {
  const requestHeaders = await headers();
  const host =
    requestHeaders
      .get("x-forwarded-host")
      ?.split(",")[0]
      ?.trim() ?? requestHeaders.get("host")?.trim();
  const defaultProtocol =
    requestHeaders
      .get("x-forwarded-proto")
      ?.split(",")[0]
      ?.trim() ??
    (host?.startsWith("localhost") || host?.startsWith("127.0.0.1")
      ? "http"
      : "https");
  const requestOrigin = host ? new URL(`${defaultProtocol}://${host}`) : null;
  const configuredOrigin = parseOriginCandidate(
    process.env.NEXT_PUBLIC_SITE_URL ?? process.env.SITE_URL,
    requestOrigin,
    defaultProtocol
  );

  if (configuredOrigin) {
    return configuredOrigin;
  }

  if (requestOrigin) {
    return requestOrigin;
  }

  return DEFAULT_METADATA_BASE;
}

export async function generateMetadata(props: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Metadata> {
  const searchParams = props.searchParams ? await props.searchParams : {};
  const { hours, gameCount, topGames } = parseResultsSearchParams(
    searchParams,
    "results metadata"
  );

  if (hours < 1) {
    return {
      title: "Your Build | Alternate Life",
      description: "Build an alternate life with your gaming hours.",
    };
  }

  const topGameName = topGames[0]?.name ?? "";
  const metadataBase = await resolveMetadataBase();
  const ogImagePath = `/api/og?hours=${hours}&games=${gameCount}${topGameName ? `&topGame=${encodeURIComponent(topGameName)}` : ""}`;

  return {
    metadataBase,
    title: `${hours.toLocaleString()} Hours | Alternate Life`,
    description: `${hours.toLocaleString()} hours of gaming turned into a life build. ${(hours / 24).toFixed(0)} days of skills, stats, and unlocked potential.`,
    openGraph: {
      title: `${hours.toLocaleString()} hours → an alternate life`,
      description: `What would your build look like with ${(hours / 24).toFixed(0)} days of skill points?`,
      images: [{ url: ogImagePath, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${hours.toLocaleString()} hours → an alternate life`,
      description: "Build yours at Alternate Life.",
      images: [ogImagePath],
    },
  };
}

export default async function ResultsPage(props: {
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}) {
  const searchParams = props.searchParams ? await props.searchParams : {};

  return (
    <ResultsContent
      initialResults={parseResultsSearchParams(searchParams, "results page")}
    />
  );
}
