
"use client";

import { useState } from "react";
import {
  Network,
  Search,
  RefreshCw,
  Plus,
  ArrowRight,
  ShieldCheck,
  Globe,
  Server,
} from "lucide-react";

export default function ResolverPage() {
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const resolverFeatures = [
    {
      title: "Inbound endpoints",
      description:
        "Allow DNS queries from your network to be forwarded to Route 53 Resolver.",
      icon: ArrowRight,
      status: "Not configured",
    },
    {
      title: "Outbound endpoints",
      description:
        "Forward DNS queries from your network to DNS resolvers outside AWS.",
      icon: Globe,
      status: "Not configured",
    },
    {
      title: "Resolver rules",
      description:
        "Define rules to control how DNS queries are forwarded.",
      icon: ShieldCheck,
      status: "Not configured",
    },
    {
      title: "Query logging",
      description:
        "Monitor and analyze DNS queries made through Resolver.",
      icon: Server,
      status: "Not configured",
    },
  ];

  const filteredFeatures = resolverFeatures.filter((feature) =>
    `${feature.title} ${feature.description}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      <div className="text-xs text-gray-500">
        Amazon Route 53 <span className="mx-2">›</span>
        <span className="font-semibold text-gray-900">Resolver</span>
      </div>

      <div className="flex flex-wrap justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-[#16191f]">
            Resolver
          </h1>
          <p className="text-sm text-gray-600 mt-2">
            Manage DNS resolution between your networks and AWS.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="bg-[#ff9900] hover:bg-[#ec8b00] text-[#16191f] px-5 py-2.5 rounded-full font-bold text-sm flex items-center gap-2"
        >
          <Plus size={17} />
          Create resource
        </button>
      </div>

      <div className="border border-[#d5dbdb] rounded-lg p-4 bg-[#f9f9f9]">
        <div className="flex gap-3">
          <Network className="text-[#0972d3] shrink-0" size={20} />
          <div>
            <h3 className="font-semibold text-sm">
              About Route 53 Resolver
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Route 53 Resolver provides DNS resolution for resources in
              your VPC and can forward queries between AWS and external
              networks using endpoints and forwarding rules.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border border-[#d5dbdb] rounded-lg p-5 bg-white">
          <p className="text-sm text-gray-600">Inbound endpoints</p>
          <p className="text-3xl font-semibold mt-3">0</p>
        </div>

        <div className="border border-[#d5dbdb] rounded-lg p-5 bg-white">
          <p className="text-sm text-gray-600">Outbound endpoints</p>
          <p className="text-3xl font-semibold mt-3">0</p>
        </div>

        <div className="border border-[#d5dbdb] rounded-lg p-5 bg-white">
          <p className="text-sm text-gray-600">Resolver rules</p>
          <p className="text-3xl font-semibold mt-3">0</p>
        </div>
      </div>

      <div className="border border-[#d5dbdb] rounded-lg overflow-hidden">
        <div className="p-5 border-b border-[#d5dbdb]">
          <div className="flex justify-between items-center gap-3">
            <div>
              <h2 className="text-xl font-semibold">
                Resolver resources
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Explore DNS resolution features.
              </p>
            </div>

            <button
              onClick={() => setSearch("")}
              className="border border-gray-400 rounded-full p-2 hover:bg-gray-100"
              title="Refresh"
            >
              <RefreshCw size={17} />
            </button>
          </div>

          <div className="relative mt-5 max-w-md">
            <Search
              size={17}
              className="absolute left-3 top-3 text-gray-500"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search Resolver resources"
              className="w-full border border-gray-400 rounded-md pl-10 pr-3 py-2.5 text-sm outline-none focus:border-[#0972d3]"
            />
          </div>
        </div>

        <div className="divide-y divide-[#eaeded]">
          {filteredFeatures.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="flex flex-wrap items-center justify-between gap-4 p-5 hover:bg-[#f9f9f9]"
              >
                <div className="flex items-start gap-4">
                  <div className="rounded-lg bg-blue-50 p-3">
                    <Icon size={22} className="text-blue-700" />
                  </div>

                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1 max-w-2xl">
                      {feature.description}
                    </p>
                    <span className="text-xs text-gray-500 mt-2 inline-block">
                      {feature.status}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setModalOpen(true)}
                  className="text-sm text-[#0972d3] hover:underline"
                >
                  Configure
                </button>
              </div>
            );
          })}

          {filteredFeatures.length === 0 && (
            <p className="p-10 text-center text-sm text-gray-500">
              No Resolver resources found.
            </p>
          )}
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
            <div className="p-5 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold">
                Resolver configuration
              </h2>
              <button onClick={() => setModalOpen(false)}>✕</button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-sm text-gray-600">
                Resolver configuration is currently a UI placeholder.
                Endpoint creation, forwarding rules and query logging
                are not connected to a backend.
              </p>

              <div className="flex justify-end">
                <button
                  onClick={() => setModalOpen(false)}
                  className="border border-gray-400 px-5 py-2 rounded-full"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
