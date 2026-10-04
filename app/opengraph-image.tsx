import { ImageResponse } from "next/og";

export const alt = "TRIAL — Superinteligencia para potenciar al humano";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "72px 80px",
          background: "#0b0b0a",
          color: "#f2f1ec",
          backgroundImage:
            "linear-gradient(to right, #1d1d1b 1px, transparent 1px), linear-gradient(to bottom, #1d1d1b 1px, transparent 1px)",
          backgroundSize: "60px 60px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 999,
              border: "2px solid #f2f1ec",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              paddingRight: 5,
            }}
          >
            <div style={{ width: 13, height: 13, borderRadius: 999, background: "#8e98ff" }} />
          </div>
          <div style={{ fontSize: 30, letterSpacing: 10, fontWeight: 600 }}>TRIAL</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 22, letterSpacing: 4, color: "#8f8e86", textTransform: "uppercase" }}>
            Centro de Experiencia de Superinteligencia
          </div>
          <div style={{ fontSize: 84, lineHeight: 1.02, fontWeight: 600, letterSpacing: -3, marginTop: 24, maxWidth: 980 }}>
            Superinteligencia para potenciar al humano.
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, color: "#8f8e86" }}>
          <div>Superintelligence for human potential.</div>
          <div style={{ color: "#8e98ff" }}>AI agents · Automation · Knowledge</div>
        </div>
      </div>
    ),
    size,
  );
}
