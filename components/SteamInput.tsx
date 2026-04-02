"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const LOADING_MESSAGES = [
  "SCANNING STEAM LIBRARY...",
  "COUNTING THE HOURS...",
  "BUILDING ALTERNATE TIMELINE...",
  "CALCULATING WASTED POTENTIAL...",
  "ALMOST THERE...",
];

export default function SteamInput() {
  const router = useRouter();
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingMsg, setLoadingMsg] = useState(LOADING_MESSAGES[0]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    setError(null);

    let msgIndex = 0;
    const msgInterval = setInterval(() => {
      msgIndex = (msgIndex + 1) % LOADING_MESSAGES.length;
      setLoadingMsg(LOADING_MESSAGES[msgIndex]);
    }, 2200);

    try {
      const res = await fetch(
        `/api/steam?input=${encodeURIComponent(input.trim())}`
      );
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      const params = new URLSearchParams({
        hours: String(data.totalHours),
        games: String(data.gameCount),
        topGames: JSON.stringify(data.topGames.slice(0, 5)),
        source: "steam",
      });

      router.push(`/results?${params.toString()}`);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch Steam data"
      );
      setLoading(false);
    } finally {
      clearInterval(msgInterval);
    }
  }

  return (
    <div className="animate-fade-up delay-700">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="font-display text-[9px] md:text-[10px] text-accent tracking-wider">
          STEAM PROFILE
        </label>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setError(null);
            }}
            placeholder="Steam ID, vanity URL, or profile link"
            disabled={loading}
            className="flex-1 h-14 px-4 bg-surface border border-border text-foreground placeholder:text-muted/50 font-body text-2xl focus:outline-none input-glow transition-all disabled:opacity-40"
          />

          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="h-14 px-6 bg-accent text-background font-display text-[9px] md:text-[10px] tracking-wider transition-all hover:bg-[#e6c200] active:scale-[0.97] disabled:opacity-25 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <span className="animate-spin inline-block w-3 h-3 border-2 border-background border-t-transparent" />
                LOADING
              </span>
            ) : (
              ">> SHOW ME"
            )}
          </button>
        </div>

        {loading && (
          <p className="font-body text-lg text-accent/50 animate-fade-in">
            {loadingMsg}
          </p>
        )}

        {error && (
          <div className="p-3 border border-pink/30 bg-pink/5">
            <p className="font-body text-lg text-pink">{error}</p>
          </div>
        )}

        <p className="font-body text-lg text-muted/60">
          Paste your Steam ID, vanity URL, or full profile link. Game details
          must be public.
        </p>
      </form>
    </div>
  );
}
