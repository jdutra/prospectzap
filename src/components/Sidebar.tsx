"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MessageSquare, Search, BarChart2, Zap } from "lucide-react";
import clsx from "clsx";

const nav = [
  { href: "/chat",    icon: MessageSquare, label: "Chat IA"  },
  { href: "/busca",   icon: Search,        label: "Busca"    },
  { href: "/reports", icon: BarChart2,     label: "Reports"  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 flex flex-col bg-[#141414] border-r border-white/5 shrink-0">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-brand-500 flex items-center justify-center">
            <Zap size={15} className="text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-white leading-none">ProspectZAP</p>
            <p className="text-[10px] text-gray-500 leading-none mt-0.5">Intelligence</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {nav.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            className={clsx(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors",
              pathname.startsWith(href)
                ? "bg-brand-500/15 text-brand-500 font-medium"
                : "text-gray-400 hover:text-white hover:bg-white/5"
            )}
          >
            <Icon size={16} />
            {label}
          </Link>
        ))}
      </nav>

      {/* Rodapé */}
      <div className="px-5 py-4 border-t border-white/5">
        <p className="text-[11px] text-gray-600">Londrina · 4.325 empresas</p>
      </div>
    </aside>
  );
}
