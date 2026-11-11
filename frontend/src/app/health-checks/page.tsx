
"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  RefreshCw,
  ShieldCheck,
  Activity,
  MoreVertical,
} from "lucide-react";

interface HealthCheck {
  id: number;
  name: string;
  endpoint: string;
  protocol: string;
  status: string;
}

export default function HealthChecksPage() {
  const [healthChecks] = useState<HealthCheck[]>([]);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const filteredChecks = healthChecks.filter((check) =>
    `${check.name} ${check.endpoint}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      <div className="text-xs text-gray-500">
        Amazon Route 53 <span className="mx-2">›</span>
        <span className="font-semibold text-gray-900">Health checks</span>
      </div>

      <div className="flex flex-wrap justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-[#16191f]">
            Health checks
          </h1>
          <p className="text-sm text-gray-600 mt-2">
            Monitor the health and availability of your application endpoints.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="bg-[#ff9900] hover:bg-[#ec8b00] text-[#16191f] px-5 py-2.5 rounded-full font-bold text-sm flex items-center gap-2"
        >
          <Plus size={17} />
          Create health check
        </button>
      </div>


      <div className="aws-info-panel border rounded-lg p-4">
        <div className="flex gap-3">
          <ShieldCheck className="text-[#0972d3] shrink-0" size={22} />
          <div>
            <h3 className="font-bold text-base">About health checks</h3>
            <p className="text-sm mt-1">
              Health checks monitor the availability of endpoints, such as
              web servers. They can be used with DNS routing policies to
              direct traffic away from unhealthy endpoints.
            </p>
          </div>
        </div>
      </div>


      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border border-[#d5dbdb] rounded-lg p-5 bg-white">
          <p className="text-sm text-gray-600">Total health checks</p>
          <p className="text-3xl font-semibold mt-3">
            {healthChecks.length}
          </p>
        </div>

        <div className="border border-[#d5dbdb] rounded-lg p-5 bg-white">
          <p className="text-sm text-gray-600">Healthy</p>
          <p className="text-3xl font-semibold text-green-600 mt-3">
            {healthChecks.filter((c) => c.status === "Healthy").length}
          </p>
        </div>

        <div className="border border-[#d5dbdb] rounded-lg p-5 bg-white">
          <p className="text-sm text-gray-600">Unhealthy</p>
          <p className="text-3xl font-semibold text-red-600 mt-3">
            {healthChecks.filter((c) => c.status === "Unhealthy").length}
          </p>
        </div>
      </div>

      <div className="border border-[#d5dbdb] rounded-lg overflow-hidden">
        <div className="p-5 border-b border-[#d5dbdb]">
          <div className="flex justify-between items-center gap-3">
            <div>
              <h2 className="text-xl font-semibold">
                Health checks ({filteredChecks.length})
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                View and manage endpoint health checks.
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
              placeholder="Search health checks"
              className="w-full border border-gray-400 rounded-md pl-10 pr-3 py-2.5 text-sm outline-none focus:border-[#0972d3]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-[#f2f3f3] border-b border-[#d5dbdb]">
              <tr>
                <th className="p-4 font-semibold">Health check name</th>
                <th className="p-4 font-semibold">Endpoint</th>
                <th className="p-4 font-semibold">Protocol</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredChecks.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-12 text-center">
                    <Activity
                      size={30}
                      className="mx-auto mb-3 text-gray-400"
                    />
                    <p className="font-semibold">No health checks found</p>
                    <p className="text-gray-500 text-xs mt-1">
                      Create a health check to monitor an endpoint.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredChecks.map((check) => (
                  <tr key={check.id} className="border-b border-[#eaeded]">
                    <td className="p-4">{check.name}</td>
                    <td className="p-4 font-mono text-xs">
                      {check.endpoint}
                    </td>
                    <td className="p-4">{check.protocol}</td>
                    <td className="p-4">
                      <span
                        className={
                          check.status === "Healthy"
                            ? "text-green-700"
                            : "text-red-700"
                        }
                      >
                        {check.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <button title="More actions">
                        <MoreVertical size={17} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">
            <div className="p-5 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold">
                Create health check
              </h2>
              <button onClick={() => setModalOpen(false)}>✕</button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-sm text-gray-600">
                Health check creation and endpoint monitoring are currently
                UI placeholders. Backend functionality is not implemented.
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
