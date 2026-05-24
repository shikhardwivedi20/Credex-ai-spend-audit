import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

type CredexLogoProps = {
  href?: string;
  className?: string;
};

export function CredexLogo({ href = "/", className }: CredexLogoProps) {
  const logo = (
    <Image
      src="/credex-logo.png"
      alt="Credex"
      width={180}
      height={38}
      priority
      className={cn("h-8 w-auto object-contain", className)}
    />
  );

  if (!href) return logo;

  return (
    <Link href={href} className="inline-flex items-center">
      {logo}
    </Link>
  );
}
