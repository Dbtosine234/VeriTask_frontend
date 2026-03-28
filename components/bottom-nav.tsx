"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type NavItem = {
  href: string;
  label: string;
  icon: string;
};

const NAV_ITEMS: NavItem[] = [
  { href: "/marketplace", label: "Market", icon: "▦" },
  { href: "/tasks/new", label: "Post", icon: "+" },
  { href: "/me", label: "Profile", icon: "◉" },
  { href: "/wallet", label: "Wallet", icon: "◌" },
  { href: "/activity", label: "Activity", icon: "◐" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-white/10 bg-black/95 backdrop-blur supports-[backdrop-filter]:bg-black/80">
      <div className="mx-auto max-w-md px-4 py-3">
        <div className="grid grid-cols-5 gap-2 rounded-2xl border border-white/10 bg-white/[0.04] p-2 shadow-[0_-10px_30px_rgba(0,0,0,0.35)]">
          {NAV_ITEMS.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/marketplace" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex flex-col items-center justify-center rounded-xl px-2 py-2 text-center transition ${
                  active
                    ? "bg-white text-black shadow-sm"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
              >
                <span
                  className={`text-sm leading-none ${
                    active ? "scale-110" : "opacity-90 group-hover:opacity-100"
                  } transition`}
                >
                  {item.icon}
                </span>
                <span
                  className={`mt-1 text-[11px] font-medium leading-none ${
                    active ? "text-black" : "text-white/70 group-hover:text-white"
                  }`}
                >
                  {item.label}
                </span>
                <span
                  className={`mt-1 h-1 w-6 rounded-full transition ${
                    active ? "bg-black/80" : "bg-transparent"
                  }`}
                />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
