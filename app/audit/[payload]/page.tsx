import type { Metadata } from "next";
import { SharedAudit } from "@/components/audit/shared-audit";
import { getPublicAuditRecord } from "@/lib/audit/storage";

type AuditPageProps = {
  params: Promise<{ payload: string }>;
};

export async function generateMetadata({ params }: AuditPageProps): Promise<Metadata> {
  const { payload } = await params;
  const record = await getPublicAuditRecord(payload);

  if (!record) {
    return {
      title: "Credex AI Spend Audit",
      description: "Review a shareable Credex AI spend audit.",
    };
  }

  const title = `Credex AI Audit: ${record.result.savingsRate}% savings opportunity`;
  const description = `Credex found ${new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(record.result.estimatedAnnualSavings)} in estimated annual AI savings.`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "website",
      images: [`/audit/${payload}/opengraph-image`],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`/audit/${payload}/opengraph-image`],
    },
  };
}

export default async function AuditPage({ params }: AuditPageProps) {
  const { payload } = await params;
  const record = await getPublicAuditRecord(payload);
  return <SharedAudit record={record} />;
}
