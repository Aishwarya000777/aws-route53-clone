
"use client";

import { useState } from "react";
import { Plus, Search, RefreshCw, FileText, MoreVertical } from "lucide-react";

interface TrafficPolicy {
  id: number;
  name: string;
  version: string;
  type: string;
  description: string;
  status: string;
}

export default function TrafficPoliciesPage() {
  const [policies] = useState<TrafficPolicy[]>([]);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const filteredPolicies = policies.filter((policy) =>
    policy.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      <div className="text-xs text-gray-500">
        Amazon Route 53 <span className="mx-2">›</span>
        <span className="font-semibold text-gray-900">Traffic policies</span>
      </div>

      <div className="flex flex-wrap justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-[#16191f]">
            Traffic policies
          </h1>
          <p className="text-sm text-gray-600 mt-2">
            Create and manage policies that control how DNS queries are routed.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="bg-[#ff9900] hover:bg-[#ec8b00] text-[#16191f] px-5 py-2.5 rounded-full font-bold text-sm flex items-center gap-2"
        >
          <Plus size={17} />
          Create traffic policy
        </button>
      </div>

      <div className="border border-[#d5dbdb] rounded-lg p-4 bg-[#f9f9f9]">
        <div className="flex gap-3">
          <FileText className="text-[#0972d3] shrink-0" size={20} />
          <div>
            <h3 className="font-semibold text-sm">About traffic policies</h3>
            <p className="text-sm text-gray-600 mt-1">
              Traffic policies let you define routing configurations for your
              domain, including how requests are directed to different endpoints.
            </p>
          </div>
        </div>
      </div>

      <div className="border border-[#d5dbdb] rounded-lg overflow-hidden">
        <div className="p-5 border-b border-[#d5dbdb]">
          <div className="flex justify-between items-center gap-3">
            <div>
              <h2 className="text-xl font-semibold">
                Traffic policies ({filteredPolicies.length})
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                View and manage your traffic policies.
              </p>
            </div>

            <button
              className="border border-gray-400 rounded-full p-2 hover:bg-gray-100"
              title="Refresh"
              onClick={() => setSearch("")}
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
              placeholder="Search traffic policies"
              className="w-full border border-gray-400 rounded-md pl-10 pr-3 py-2.5 text-sm outline-none focus:border-[#0972d3]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-[#f2f3f3] border-b border-[#d5dbdb]">
              <tr>
                <th className="p-4 font-semibold">Policy name</th>
                <th className="p-4 font-semibold">Version</th>
                <th className="p-4 font-semibold">Routing type</th>
                <th className="p-4 font-semibold">Description</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredPolicies.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-12 text-center">
                    <FileText size={30} className="mx-auto mb-3 text-gray-400" />
                    <p className="font-semibold">No traffic policies found</p>
                    <p className="text-gray-500 text-xs mt-1">
                      Create a traffic policy to get started.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredPolicies.map((policy) => (
                  <tr key={policy.id} className="border-b border-[#eaeded]">
                    <td className="p-4">{policy.name}</td>
                    <td className="p-4">{policy.version}</td>
                    <td className="p-4">{policy.type}</td>
                    <td className="p-4">{policy.description}</td>
                    <td className="p-4">{policy.status}</td>
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
              <h2 className="text-xl font-semibold">Create traffic policy</h2>
              <button onClick={() => setModalOpen(false)}>✕</button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-sm text-gray-600">
                Traffic policy creation is currently a UI placeholder.
                Policy storage and routing logic are not implemented yet.
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
