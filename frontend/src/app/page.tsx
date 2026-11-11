
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Globe,
  Activity,
  ShieldCheck,
  Network,
  UserCircle,
  ArrowRight,
  Plus,
  RefreshCw,
} from "lucide-react";
import { apiRequest } from "@/lib/api";

interface HostedZone {
  id: number;
  name: string;
  type: string;
}

interface ZoneResponse {
  items: HostedZone[];
  total: number;
  skip: number;
  limit: number;
}

export default function Dashboard() {
  const [zones, setZones] = useState<HostedZone[]>([]);
  const [loading, setLoading] = useState(true);

  async function fetchZones() {
    try {
      const data = await apiRequest<ZoneResponse>(
        "/api/hosted-zones/?skip=0&limit=10"
      );
      setZones(data.items);
    } catch (error) {
      console.error("Failed to load hosted zones:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchZones();
  }, []);

  const modules = [
    {
      title: "Traffic policies",
      description: "Manage traffic routing policies.",
      icon: Activity,
      href: "/traffic-policies",
    },
    {
      title: "Health checks",
      description: "Monitor endpoint health.",
      icon: ShieldCheck,
      href: "/health-checks",
    },
    {
      title: "Resolver",
      description: "Manage DNS resolution settings.",
      icon: Network,
      href: "/resolver",
    },
    {
      title: "Profiles",
      description: "Manage DNS profiles.",
      icon: UserCircle,
      href: "/profiles",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm text-gray-500">Amazon Route 53</p>
        <h1 className="text-2xl font-semibold text-gray-900">
          Dashboard
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Manage your DNS infrastructure and routing resources.
        </p>
      </div>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Resources
        </h2>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-lg border border-gray-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Hosted zones</span>
              <Globe className="text-blue-600" size={22} />
            </div>
            <p className="mt-4 text-3xl font-semibold text-gray-900">
              {loading ? "..." : zones.length}
            </p>
            <Link
              href="/hosted-zones"
              className="mt-4 inline-flex items-center gap-2 text-sm text-blue-700 hover:underline"
            >
              View hosted zones <ArrowRight size={15} />
            </Link>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Traffic policies</span>
              <Activity className="text-blue-600" size={22} />
            </div>
            <p className="mt-4 text-3xl font-semibold text-gray-900">—</p>
            <Link href="/traffic-policies" className="mt-4 inline-block text-sm text-blue-700 hover:underline">
              View policies →
            </Link>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Health checks</span>
              <ShieldCheck className="text-blue-600" size={22} />
            </div>
            <p className="mt-4 text-3xl font-semibold text-gray-900">—</p>
            <Link href="/health-checks" className="mt-4 inline-block text-sm text-blue-700 hover:underline">
              View health checks →
            </Link>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">DNS profiles</span>
              <UserCircle className="text-blue-600" size={22} />
            </div>
            <p className="mt-4 text-3xl font-semibold text-gray-900">—</p>
            <Link href="/profiles" className="mt-4 inline-block text-sm text-blue-700 hover:underline">
              View profiles →
            </Link>
          </div>
        </div>
      </section>

      <section className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Quick actions
            </h2>
            <p className="mt-1 text-sm text-gray-600">
              Quickly access your DNS resources.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href="/hosted-zones"
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              View hosted zones
            </Link>
            <Link
              href="/hosted-zones?action=create"
              className="inline-flex items-center gap-2 rounded-md bg-[#0972d3] px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              <Plus size={16} /> Create hosted zone
            </Link>
          </div>
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Route 53 services
        </h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {modules.map((module) => {
            const Icon = module.icon;

            return (
              <Link
                key={module.title}
                href={module.href}
                className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-5 transition hover:border-blue-400 hover:shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-blue-50 p-3">
                    <Icon size={22} className="text-blue-700" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {module.title}
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {module.description}
                    </p>
                  </div>
                </div>
                <ArrowRight size={18} className="text-gray-400" />
              </Link>
            );
          })}
        </div>
      </section>

      <section className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Recent activity
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Activity history is not configured yet.
            </p>
          </div>
          <RefreshCw size={20} className="text-gray-400" />
        </div>
        <div className="mt-5 rounded-md bg-gray-50 p-5 text-center text-sm text-gray-500">
          No recent activity available.
        </div>
      </section>
    </div>
  );
}

