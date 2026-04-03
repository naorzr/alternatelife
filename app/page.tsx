import HeroSection from "@/components/HeroSection";
import SteamInput from "@/components/SteamInput";
import ManualInput from "@/components/ManualInput";

export default function Home() {
  return (
    <div className="h-dvh md:h-auto md:min-h-dvh flex flex-col overflow-hidden md:overflow-visible relative">
      {/* Background grid */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
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

      <main className="relative z-10 flex-1 overflow-hidden md:overflow-visible max-w-3xl mx-auto w-full px-5 md:px-6 flex flex-col justify-evenly md:justify-start">
        <HeroSection />

        {/* Input section */}
        <section className="max-w-xl">
          <div className="flex flex-col gap-3 md:gap-8">
            <SteamInput />

            {/* Divider */}
            <div className="flex items-center gap-5 animate-fade-up delay-800">
              <div className="flex-1 retro-divider" />
              <span className="font-display text-[8px] text-muted/40 tracking-widest">
                OR
              </span>
              <div className="flex-1 retro-divider" />
            </div>

            <ManualInput />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 shrink-0 border-t border-border py-3 px-6">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <span className="font-display text-[7px] md:text-[8px] text-muted/40 tracking-wider">
            ALTERNATE LIFE
          </span>
          <span className="hidden sm:inline font-body text-sm text-muted/35">
            YOUR HOURS. YOUR BUILD. YOUR CALL.
          </span>
        </div>
      </footer>
    </div>
  );
}
