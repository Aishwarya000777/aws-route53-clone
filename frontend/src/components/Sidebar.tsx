"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard, Globe, Network, Activity, ShieldCheck, UserRound,
  ChevronDown, ChevronRight, PanelLeftClose
} from "lucide-react";

const navigation = [
  { label: "Dashboard", href: "/", icon: LayoutDashboard },
  { label: "Hosted zones", href: "/hosted-zones", icon: Globe },
  { label: "Traffic policies", href: "/traffic-policies", icon: Network },
  { label: "Health checks", href: "/health-checks", icon: Activity },
  { label: "Resolver", href: "/resolver", icon: ShieldCheck },
  { label: "Profiles", href: "/profiles", icon: UserRound },
];

export default function Sidebar({ collapsed = false }: { collapsed?: boolean }) {
  const pathname = usePathname();
  const [expanded, setExpanded] = useState(true);

  return (
    <aside className={`aws-sidebar ${collapsed ? "is-collapsed" : ""}`}>
      <div className="sidebar-brand">
        <span className="aws-logo">aws</span>
        <span className="sidebar-brand-label">Services</span>
        <span className="sidebar-collapse" aria-hidden="true"><PanelLeftClose size={18} /></span>
      </div>

      <div className="sidebar-section">
        <button className="sidebar-section-title" onClick={() => setExpanded((value) => !value)}>
          <span>Route 53</span>
          {expanded ? <ChevronDown size={17} /> : <ChevronRight size={17} />}
        </button>

        {expanded && (
          <nav className="sidebar-nav" aria-label="Route 53 navigation">
            {navigation.map((item) => {
              const Icon = item.icon;
              const active = item.href === "/"
                ? pathname === "/"
                : pathname === item.href || pathname.startsWith(item.href + "/");

              return (
                <Link href={item.href} key={item.href} className={`sidebar-link ${active ? "active" : ""}`}>
                  <Icon size={18} strokeWidth={1.9} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        )}
      </div>

      <div className="sidebar-bottom">
        <div className="sidebar-footer">© 2026 AWS Route 53 Clone</div>
      </div>
    </aside>
  );
}

