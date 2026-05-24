"use client";

import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";

type ToolLogoProps = {
  name: string;
  accent: string;
  logoBg?: string;
  logoSlug?: string;
  className?: string;
};

export function ToolLogo({ name, accent, logoBg, logoSlug, className }: ToolLogoProps) {
  const [failed, setFailed] = useState(false);
  const initial = name.slice(0, 1).toUpperCase();

  return (
    <span
      className={cn(
        `flex h-10 w-10 flex-none items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br ${accent} text-sm font-semibold text-white shadow-sm`,
        className,
      )}
      style={logoBg ? { background: logoBg } : undefined}
      aria-hidden="true"
    >
      {logoSlug && !failed ? (
        <Image
          alt=""
          width={20}
          height={20}
          className="h-5 w-5"
          src={`https://cdn.simpleicons.org/${logoSlug}/ffffff`}
          unoptimized
          onError={() => setFailed(true)}
        />
      ) : (
        initial
      )}
    </span>
  );
}
