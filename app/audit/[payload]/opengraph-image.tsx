import { ImageResponse } from "next/og";
import { getPublicAuditRecord } from "@/lib/audit/storage";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image({
  params,
}: {
  params: Promise<{ payload: string }>;
}) {
  const { payload } = await params;
  const record = await getPublicAuditRecord(payload);

  if (!record) {
    return new ImageResponse(
      (
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#f8fafc",
            color: "#020617",
            fontFamily: "Inter, Arial, sans-serif",
            fontSize: 48,
            fontWeight: 700,
          }}
        >
          Credex AI Spend Audit
        </div>
      ),
      size,
    );
  }

  const money = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 64,
          background: "linear-gradient(135deg, #ffffff 0%, #ecfeff 42%, #eef2ff 100%)",
          color: "#020617",
          fontFamily: "Inter, Arial, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: 48,
            fontWeight: 800,
            color: "#047857",
          }}
        >
          Credex
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 28, color: "#0f766e", fontWeight: 700 }}>AI Spend Audit</div>
          <div
            style={{
              display: "flex",
              marginTop: 18,
              maxWidth: 920,
              fontSize: 62,
              lineHeight: 1.05,
              fontWeight: 800,
            }}
          >
            Likely recover {money.format(record.result.estimatedAnnualSavings)} per year
          </div>
          <div style={{ display: "flex", marginTop: 18, fontSize: 28, color: "#475569" }}>
            {record.input.teamSize}-person team • {record.input.primaryUseCase} workflow focus
          </div>
        </div>

        <div style={{ display: "flex", gap: 18 }}>
          {[
            ["Monthly spend", money.format(record.result.monthlySpend)],
            ["Monthly savings", money.format(record.result.estimatedMonthlySavings)],
            ["Savings rate", `${record.result.savingsRate}%`],
          ].map(([label, value]) => (
            <div
              key={label}
              style={{
                display: "flex",
                flexDirection: "column",
                width: 260,
                border: "1px solid rgba(15,23,42,.12)",
                borderRadius: 18,
                background: "rgba(255,255,255,.72)",
                padding: 22,
              }}
            >
              <div style={{ display: "flex", fontSize: 22, color: "#475569" }}>{label}</div>
              <div style={{ display: "flex", marginTop: 8, fontSize: 38, fontWeight: 800 }}>{value}</div>
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
