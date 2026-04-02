import type { Metadata } from "next";

export async function generateMetadata(props: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}): Promise<Metadata> {
  let params: Record<string, string | string[] | undefined> = {};
  try {
    params = await props.searchParams;
  } catch {
    // During static generation, searchParams may not be available
  }

  const hours = (typeof params?.hours === "string" ? params.hours : "0");
  const games = (typeof params?.games === "string" ? params.games : "0");
  const hoursNum = Number(hours) || 0;

  if (hoursNum < 1) {
    return {
      title: "Your Build | Alternate Life",
      description: "Build an alternate life with your gaming hours.",
    };
  }

  let topGameName = "";
  try {
    const raw = typeof params?.topGames === "string" ? params.topGames : "";
    if (raw) {
      const parsed = JSON.parse(raw);
      topGameName = parsed[0]?.name ?? "";
    }
  } catch {
    // ignore
  }

  const ogUrl = `/api/og?hours=${hours}&games=${games}${topGameName ? `&topGame=${encodeURIComponent(topGameName)}` : ""}`;

  return {
    title: `${hoursNum.toLocaleString()} Hours | Alternate Life`,
    description: `${hours} hours of gaming turned into a life build. ${(hoursNum / 24).toFixed(0)} days of skills, stats, and unlocked potential.`,
    openGraph: {
      title: `${hoursNum.toLocaleString()} hours → an alternate life`,
      description: `What would your build look like with ${(hoursNum / 24).toFixed(0)} days of skill points?`,
      images: [{ url: ogUrl, width: 1200, height: 630 }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${hoursNum.toLocaleString()} hours → an alternate life`,
      description: `Build yours at Alternate Life.`,
      images: [ogUrl],
    },
  };
}

export default function ResultsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
