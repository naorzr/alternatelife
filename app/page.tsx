import Link from "next/link";
import HeroSection from "@/components/HeroSection";
import SteamInput from "@/components/SteamInput";
import ManualInput from "@/components/ManualInput";

export default function Home() {
  return (
    <div className="viewport-shell overflow-hidden" data-testid="home-screen">
      {/* Background grid */}
      <div
        className="fixed inset-0 pointer-events-none overflow-hidden"
        data-testid="bg-grid"
      >
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(rgba(255, 204, 0, 0.2) 1px, transparent 1px),
              linear-gradient(90deg, rgba(255, 204, 0, 0.2) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
          }}
        />
        {/* Corner accents */}
        <div className="absolute top-0 right-0 w-px h-40 bg-gradient-to-b from-accent/20 to-transparent" />
        <div className="absolute top-0 right-0 h-px w-40 bg-gradient-to-l from-accent/20 to-transparent" />
      </div>

      <main
        id="main-content"
        className="viewport-main relative z-10 justify-center safe-pad-top safe-pad-bottom"
      >
        <div className="viewport-frame flex flex-1 items-center">
          <div className="grid w-full items-center gap-5 lg:grid-cols-[minmax(0,1.15fr)_minmax(20rem,0.85fr)] lg:gap-10">
            <HeroSection />

            <section className="w-full max-w-xl justify-self-end">
              <div className="flex flex-col gap-4 md:gap-6">
                <SteamInput />

                <div className="flex items-center gap-5 animate-fade-up delay-800">
                  <div className="flex-1 retro-divider" />
                  <span className="font-display text-[8px] text-muted/50 tracking-[0.35em]">
                    OR
                  </span>
                  <div className="flex-1 retro-divider" />
                </div>

                <ManualInput />
              </div>
            </section>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 shrink-0 border-t border-border safe-pad-bottom py-3">
        <div className="viewport-frame flex flex-wrap items-center justify-between gap-2">
          <span className="font-display text-[7px] md:text-[8px] text-muted/50 tracking-wider">
            ALTERNATE LIFE
          </span>
          <div className="flex items-center gap-3">
            <Link href="/privacy" className="font-body text-xs readable-muted hover:text-foreground transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="font-body text-xs readable-muted hover:text-foreground transition-colors">
              Terms
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
