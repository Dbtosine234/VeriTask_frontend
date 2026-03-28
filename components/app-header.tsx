"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

type AppHeaderProps = {
  title: string;
  subtitle?: string;
  backHref?: string;
  showHome?: boolean;
};

export default function AppHeader({
  title,
  subtitle,
  backHref,
  showHome = true,
}: AppHeaderProps) {
  const router = useRouter();

  return (
    <div className="mb-5 rounded-2xl border border-white/10 bg-white/5 p-4">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => {
              if (backHref) {
                router.push(backHref);
                return;
              }
              router.back();
            }}
            className="rounded-xl border border-white/15 px-4 py-2 text-sm text-white/80 transition hover:bg-white/10"
          >
            ← Back
          </button>

          {showHome && (
            <Link
              href="/"
              className="rounded-xl border border-white/15 px-4 py-2 text-sm text-white/80 transition hover:bg-white/10"
            >
              Home
            </Link>
          )}
        </div>

        <Link
          href="/marketplace"
          className="rounded-xl border border-white/15 px-4 py-2 text-sm text-white/80 transition hover:bg-white/10"
        >
          Marketplace
        </Link>
      </div>

      <div>
        <p className="text-xs text-white/50">VeriTask</p>
        <h1 className="text-3xl font-bold">{title}</h1>
        {subtitle && <p className="mt-2 text-sm text-white/70">{subtitle}</p>}
      </div>
    </div>
  );
}
