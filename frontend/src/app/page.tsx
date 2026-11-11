"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Globe, Activity, ShieldCheck, Network, UserCircle,
  ArrowRight, Plus, RefreshCw
} from "lucide-react";
import { apiRequest } from "@/lib/api";

interface HostedZone { id: number; name: string; type: string; }
interface ZoneResponse { items: HostedZone[]; total: number; skip: number; limit: number; }

export default function Dashboard() {
  const [zones, setZones] = useState<HostedZone[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchZones() {
    setLoading(true);
    try {
      const data = await apiRequest<ZoneResponse>("/api/hosted-zones/?skip=0&limit=100");
      setZones(data.items);
    } catch (error) {
      console.error("Failed to load hosted zones:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchZones(); }, []);

  const resources = [
    { title: "Hosted zones", value: loading ? "…" : String(zones.length), icon: Globe, href: "/hosted-zones", link: "View hosted zones" },
    { title: "Traffic policies", value: "—", icon: Activity, href: "/traffic-policies", link: "View policies" },
    { title: "Health checks", value: "—", icon: ShieldCheck, href: "/health-checks", link: "View health checks" },
    { title: "DNS profiles", value: "—", icon: UserCircle, href: "/profiles", link: "View profiles" },
  ];

  const services = [
    { title: "Traffic policies", description: "Manage traffic routing policies.", icon: Activity, href: "/traffic-policies" },
    { title: "Health checks", description: "Monitor endpoint health.", icon: ShieldCheck, href: "/health-checks" },
    { title: "Resolver", description: "Manage DNS resolution settings.", icon: Network, href: "/resolver" },
    { title: "Profiles", description: "Manage DNS profiles.", icon: UserCircle, href: "/profiles" },
  ];

  return (
    <div className="dashboard-page">
      <section className="dashboard-heading">
        <div className="eyebrow">Amazon Route 53</div>
        <h1>Route 53 Dashboard</h1>
        <p>Manage your DNS infrastructure and routing resources.</p>
      </section>

      <section>
        <h2 className="dashboard-section-title">Resources</h2>
        <div className="dashboard-resource-grid">
          {resources.map((resource) => {
            const Icon = resource.icon;
            return (
              <article className="dashboard-resource-card" key={resource.title}>
                <div className="dashboard-resource-top">
                  <span>{resource.title}</span>
                  <Icon size={20} />
                </div>
                <div className="dashboard-resource-value">{resource.value}</div>
                <Link className="dashboard-resource-link" href={resource.href}>
                  {resource.link} <ArrowRight size={14} />
                </Link>
              </article>
            );
          })}
        </div>
      </section>

      <section className="dashboard-panel dashboard-quick-actions">
        <div>
          <h2 className="dashboard-section-title" style={{ marginBottom: 0 }}>Quick actions</h2>
          <p>Quickly access your DNS resources.</p>
        </div>
        <div className="dashboard-action-group">
          <Link href="/hosted-zones" className="dashboard-button">View hosted zones</Link>
          <Link href="/hosted-zones?action=create" className="dashboard-button primary">
            <Plus size={16} /> Create hosted zone
          </Link>
        </div>
      </section>

      <section>
        <h2 className="dashboard-section-title">Route 53 services</h2>
        <div className="dashboard-service-grid">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <Link href={service.href} className="dashboard-service-card" key={service.title}>
                <span className="dashboard-service-icon"><Icon size={21} /></span>
                <span>
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                </span>
                <ArrowRight className="dashboard-service-arrow" size={18} />
              </Link>
            );
          })}
        </div>
      </section>

      <section className="dashboard-panel">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <div>
            <h2 className="dashboard-section-title" style={{ marginBottom: 0 }}>Recent activity</h2>
            <p style={{ color: "#aebbc9", fontSize: 12, margin: "4px 0 0" }}>Activity history is not configured yet.</p>
          </div>
          <button onClick={fetchZones} title="Refresh dashboard" className="dashboard-button" style={{ padding: 8 }}>
            <RefreshCw size={17} />
          </button>
        </div>
        <div className="dashboard-activity-empty">No recent activity available.</div>
      </section>
    </div>
  );
}
