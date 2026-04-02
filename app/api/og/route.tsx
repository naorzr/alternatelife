import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import { calculateBudget } from "@/lib/achievements";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const hours = parseInt(searchParams.get("hours") ?? "0", 10);
  const games = parseInt(searchParams.get("games") ?? "0", 10);
  const topGame = searchParams.get("topGame") ?? "";

  const budget = calculateBudget(hours * 60);
  const topItems = budget.items.slice(0, 4);

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "60px 70px",
          background: "linear-gradient(145deg, #0d0c14 0%, #07060b 50%, #0a0915 100%)",
          fontFamily: "Georgia, serif",
        }}
      >
        {/* Header */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
            <div style={{ width: "40px", height: "1px", background: "rgba(232, 185, 49, 0.4)" }} />
            <span style={{ color: "#e8b931", fontSize: "14px", fontWeight: 600, letterSpacing: "0.25em", textTransform: "uppercase" as const }}>
              Alternate Life
            </span>
          </div>

          <div style={{ display: "flex", alignItems: "baseline", gap: "16px" }}>
            <span style={{ color: "#e8b931", fontSize: "100px", fontWeight: 900, fontStyle: "italic", lineHeight: 1 }}>
              {hours.toLocaleString("en-US")}
            </span>
            <span style={{ color: "rgba(240, 237, 230, 0.4)", fontSize: "36px", fontStyle: "italic" }}>
              hours
            </span>
          </div>

          <span style={{ color: "#9895ad", fontSize: "16px", marginTop: "8px" }}>
            {games > 0 ? `${games} games · ` : ""}{(hours / 24).toFixed(0)} days{topGame ? ` · mostly ${topGame}` : ""}
          </span>
        </div>

        {/* Items */}
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {topItems.map((item) => (
            <div key={item.milestone.id} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <span style={{ fontSize: "20px" }}>{item.milestone.icon}</span>
              <span style={{ color: "rgba(240, 237, 230, 0.9)", fontSize: "18px", flex: 1 }}>
                {item.milestone.title}
              </span>
              <span style={{ color: "#e8b931", fontSize: "18px", fontWeight: 700 }}>
                −{item.hoursSpent}h
              </span>
            </div>
          ))}
          {budget.totalItemsBought > 4 && (
            <span style={{ color: "rgba(152, 149, 173, 0.5)", fontSize: "14px" }}>
              +{budget.totalItemsBought - 4} more things
            </span>
          )}
        </div>

        {/* Bottom */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderTop: "1px solid rgba(152, 149, 173, 0.15)", paddingTop: "16px" }}>
          <span style={{ color: "#9895ad", fontSize: "16px" }}>
            {budget.totalItemsBought} things · {budget.hoursRemaining.toLocaleString()}h left over
          </span>
          <span style={{ color: "rgba(152, 149, 173, 0.4)", fontSize: "14px" }}>
            Check yours →
          </span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}
