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
  const inputId = "steam-profile-input";

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
        topGames: JSON.stringify(data.topGames.slice(0, 10)),
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
      <form
        onSubmit={handleSubmit}
        className="retro-panel flex flex-col gap-3 p-4 md:gap-4 md:p-5"
      >
        <label
          htmlFor={inputId}
          className="font-display text-[9px] md:text-[10px] text-accent tracking-[0.28em]"
        >
          STEAM PROFILE
        </label>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            id={inputId}
            type="text"
            value={input}
            onChange={(e) => {
              setInput(e.target.value);
              setError(null);
            }}
            placeholder="Steam ID, vanity URL, or profile link"
            disabled={loading}
            aria-describedby="steam-profile-help steam-profile-error"
            data-testid="steam-profile-input"
            className="touch-action flex-1 h-12 md:h-14 min-w-0 px-4 bg-surface border border-border text-foreground placeholder:text-muted/70 font-body text-base md:text-xl focus:outline-none input-glow transition-all disabled:opacity-40"
          />

          <button
            type="submit"
            disabled={loading || !input.trim()}
            data-testid="steam-submit"
            className="touch-action h-12 md:h-14 px-5 md:px-6 bg-accent text-background font-display text-[9px] md:text-[10px] tracking-[0.22em] transition-all hover:bg-[#e6c200] active:scale-[0.97] disabled:opacity-25 disabled:cursor-not-allowed whitespace-nowrap"
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
          <p
            className="font-body text-sm md:text-base text-accent/80 animate-fade-in"
            aria-live="polite"
          >
            {loadingMsg}
          </p>
        )}

        {error && (
          <div
            id="steam-profile-error"
            className="p-3 border border-pink/40 bg-pink/10"
            aria-live="polite"
            data-testid="steam-error"
          >
            <p className="font-body text-sm md:text-base text-pink break-safe">
              {error}
            </p>
          </div>
        )}

        <p
          id="steam-profile-help"
          className="font-body text-sm md:text-base readable-muted"
        >
          Paste your Steam ID, vanity URL, or full profile link. Game details
          must be public.
        </p>
      </form>
    </div>
  );
}
