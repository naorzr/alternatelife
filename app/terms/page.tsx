import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service — Alternate Life",
  description: "Terms governing your use of Alternate Life.",
};

export default function TermsOfService() {
  return (
    <div className="viewport-shell">
      <main className="viewport-main safe-pad-y">
        <article className="viewport-frame-narrow py-8 md:py-12">
          <Link
            href="/"
            className="font-display text-[8px] md:text-[9px] text-accent tracking-wider hover:underline"
          >
            &larr; BACK
          </Link>

          <h1 className="font-display text-sm md:text-base text-foreground mt-6 mb-8">
            TERMS OF SERVICE
          </h1>

          <div className="space-y-6 font-body text-sm md:text-base text-foreground/80 leading-relaxed">
            <p className="readable-muted text-xs">
              Last updated: April 4, 2026
            </p>

            <section>
              <h2 className="font-display text-[9px] md:text-[10px] text-foreground tracking-wider mb-3">
                WHAT THIS IS
              </h2>
              <p>
                Alternate Life is an entertainment tool that converts your
                gaming hours into hypothetical real-world skill estimates. The
                results are meant to be fun and shareable &mdash; they are not
                real assessments of your abilities.
              </p>
            </section>

            <section>
              <h2 className="font-display text-[9px] md:text-[10px] text-foreground tracking-wider mb-3">
                NOT AFFILIATED WITH VALVE OR STEAM
              </h2>
              <p>
                Alternate Life is an independent project. It is not endorsed by,
                affiliated with, or sponsored by Valve Corporation. Steam and
                the Steam logo are trademarks of Valve Corporation. We use the
                Steam Web API under Valve&apos;s API terms to access publicly
                available data.
              </p>
            </section>

            <section>
              <h2 className="font-display text-[9px] md:text-[10px] text-foreground tracking-wider mb-3">
                ACCEPTABLE USE
              </h2>
              <p>You agree not to:</p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>
                  Abuse, overload, or interfere with the service or its API
                  endpoints
                </li>
                <li>
                  Use automated tools to scrape or bulk-query the service
                </li>
                <li>
                  Misrepresent results as genuine skill certifications or
                  credentials
                </li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-[9px] md:text-[10px] text-foreground tracking-wider mb-3">
                DISCLAIMER
              </h2>
              <p>
                The service is provided &ldquo;as is&rdquo; without warranties
                of any kind. Skill estimates, comparisons, and all generated
                content are entirely fictional and for entertainment purposes
                only. We make no claims about their accuracy.
              </p>
            </section>

            <section>
              <h2 className="font-display text-[9px] md:text-[10px] text-foreground tracking-wider mb-3">
                LIMITATION OF LIABILITY
              </h2>
              <p>
                To the fullest extent permitted by law, Alternate Life and its
                creators shall not be liable for any indirect, incidental, or
                consequential damages arising from your use of the service.
              </p>
            </section>

            <section>
              <h2 className="font-display text-[9px] md:text-[10px] text-foreground tracking-wider mb-3">
                CHANGES
              </h2>
              <p>
                We may update these terms at any time. Continued use of the
                service after changes constitutes acceptance of the updated
                terms.
              </p>
            </section>

            <section>
              <h2 className="font-display text-[9px] md:text-[10px] text-foreground tracking-wider mb-3">
                CONTACT
              </h2>
              <p>
                Questions? Reach out at{" "}
                <a
                  href="mailto:contact@alternatelife.app"
                  className="text-accent hover:underline"
                >
                  contact@alternatelife.app
                </a>
                .
              </p>
            </section>
          </div>
        </article>
      </main>
    </div>
  );
}
