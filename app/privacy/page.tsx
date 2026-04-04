import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy — Alternate Life",
  description: "How Alternate Life handles your data.",
};

export default function PrivacyPolicy() {
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
            PRIVACY POLICY
          </h1>

          <div className="space-y-6 font-body text-sm md:text-base text-foreground/80 leading-relaxed">
            <p className="readable-muted text-xs">
              Last updated: April 4, 2026
            </p>

            <section>
              <h2 className="font-display text-[9px] md:text-[10px] text-foreground tracking-wider mb-3">
                WHAT WE COLLECT
              </h2>
              <p>
                Alternate Life is designed to collect as little data as
                possible. We do not create user accounts, set cookies, or use
                analytics or tracking scripts.
              </p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>
                  <strong>Steam profile data</strong> &mdash; If you enter a
                  Steam ID or profile URL, we fetch your publicly visible game
                  library (game names, playtime) from the Steam Web API. This
                  data is used only to generate your results and is not stored
                  on our servers.
                </li>
                <li>
                  <strong>Manual hours input</strong> &mdash; If you enter hours
                  manually, that number is used only in your browser to generate
                  results. It is not sent to any server.
                </li>
                <li>
                  <strong>IP addresses</strong> &mdash; Your IP address is used
                  temporarily for rate limiting (to prevent abuse of the Steam
                  API endpoint). It is held in server memory only and is not
                  logged or stored persistently.
                </li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-[9px] md:text-[10px] text-foreground tracking-wider mb-3">
                THIRD-PARTY SERVICES
              </h2>
              <ul className="list-disc pl-5 space-y-1">
                <li>
                  <strong>Steam Web API</strong> &mdash; We query Valve&apos;s
                  Steam Web API to retrieve your public game data. Valve&apos;s
                  own privacy policy governs how they handle data on their end.
                </li>
                <li>
                  <strong>Google Fonts</strong> &mdash; We load fonts from
                  Google&apos;s servers. Google may collect your IP address when
                  serving font files. See{" "}
                  <a
                    href="https://policies.google.com/privacy"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-accent hover:underline"
                  >
                    Google&apos;s Privacy Policy
                  </a>
                  .
                </li>
              </ul>
            </section>

            <section>
              <h2 className="font-display text-[9px] md:text-[10px] text-foreground tracking-wider mb-3">
                COOKIES &amp; LOCAL STORAGE
              </h2>
              <p>
                We do not set any cookies or use browser local storage.
              </p>
            </section>

            <section>
              <h2 className="font-display text-[9px] md:text-[10px] text-foreground tracking-wider mb-3">
                DATA RETENTION
              </h2>
              <p>
                Steam API responses are cached in server memory for up to 5
                minutes to reduce redundant requests, then discarded. We do not
                maintain any long-term data storage.
              </p>
            </section>

            <section>
              <h2 className="font-display text-[9px] md:text-[10px] text-foreground tracking-wider mb-3">
                CHILDREN&apos;S PRIVACY
              </h2>
              <p>
                Alternate Life is not directed at children under 13. We do not
                knowingly collect personal information from children.
              </p>
            </section>

            <section>
              <h2 className="font-display text-[9px] md:text-[10px] text-foreground tracking-wider mb-3">
                CHANGES
              </h2>
              <p>
                We may update this policy from time to time. Changes will be
                reflected on this page with an updated date.
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
