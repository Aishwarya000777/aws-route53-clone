
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Globe,
  Network,
  Activity,
  ShieldCheck,
  UserRound,
  ChevronDown,
  ChevronRight,
  Search,
  Settings,
  Menu
} from "lucide-react";
import { useState } from "react";

const navigation = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Hosted zones", href: "/hosted-zones", icon: Globe },
  { label: "Traffic policies", href: "/traffic-policies", icon: Network },
  { label: "Health checks", href: "/health-checks", icon: Activity },
  { label: "Resolver", href: "/resolver", icon: ShieldCheck },
  { label: "Profiles", href: "/profiles", icon: UserRound },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(true);

  return (
    <aside className="aws-sidebar">
      <div className="sidebar-brand">
        <div className="aws-logo">aws</div>
        <span>Services</span>
        <Menu size={18} className="ml-auto text-gray-400" />
      </div>

      <div className="sidebar-search">
        <Search size={15} />
        <input placeholder="Search services" />
        <span>/</span>
      </div>

      <div className="sidebar-section">
        <button
          className="sidebar-section-title"
          onClick={() => setExpanded(!expanded)}
        >
          <span>Route 53</span>
          {expanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </button>

        {expanded && (
          <nav className="sidebar-nav">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active =
                item.href === "/"
                  ? pathname === "/"
                  : pathname === item.href ||
                    pathname.startsWith(item.href + "/");

              return (
                <Link
                  href={item.href}
                  key={item.href}
                  className={`sidebar-link ${active ? "active" : ""}`}
                >
                  <Icon size={17} strokeWidth={1.8} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        )}
      </div>

      <div className="sidebar-bottom">
        <Link href="/hosted-zones" className="sidebar-link">
          <Settings size={17} />
          <span>Settings</span>
        </Link>
        <div className="sidebar-footer">
          © 2026 AWS Route 53 Clone
        </div>
      </div>
    </aside>
  );
}
