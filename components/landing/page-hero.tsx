import { SiteHeader } from "./site-header";

export function PageHero({
  eyebrow,
  title,
  body,
}: {
  eyebrow: string;
  title: string;
  body: string;
}) {
  return (
    <>
      <SiteHeader />
      <section className="relative overflow-hidden border-b bg-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(20,184,166,.18),transparent_30%),radial-gradient(circle_at_80%_10%,rgba(59,130,246,.16),transparent_28%),radial-gradient(circle_at_50%_90%,rgba(244,114,182,.13),transparent_28%)]" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
          <p className="text-sm font-semibold text-teal-700">{eyebrow}</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-6xl">
            {title}
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">{body}</p>
        </div>
      </section>
    </>
  );
}
