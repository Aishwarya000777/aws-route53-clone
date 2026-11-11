
"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  RefreshCw,
  UserCircle,
  Globe,
  ShieldCheck,
  MoreVertical,
} from "lucide-react";

interface DNSProfile {
  id: number;
  name: string;
  description: string;
  status: string;
}

export default function ProfilesPage() {
  const [profiles] = useState<DNSProfile[]>([]);
  const [search, setSearch] = useState("");
  const [modalOpen, setModalOpen] = useState(false);

  const filteredProfiles = profiles.filter((profile) =>
    `${profile.name} ${profile.description}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="max-w-[1400px] mx-auto space-y-6">
      <div className="text-xs text-gray-500">
        Amazon Route 53 <span className="mx-2">›</span>
        <span className="font-semibold text-gray-900">Profiles</span>
      </div>

      <div className="flex flex-wrap justify-between items-start gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-[#16191f]">
            Profiles
          </h1>
          <p className="text-sm text-gray-600 mt-2">
            Manage DNS configurations and associate them with your networks.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="bg-[#ff9900] hover:bg-[#ec8b00] text-[#16191f] px-5 py-2.5 rounded-full font-bold text-sm flex items-center gap-2"
        >
          <Plus size={17} />
          Create profile
        </button>
      </div>

      <div className="border border-[#d5dbdb] rounded-lg p-4 bg-[#f9f9f9]">
        <div className="flex gap-3">
          <UserCircle className="text-[#0972d3] shrink-0" size={20} />
          <div>
            <h3 className="font-semibold text-sm">About DNS profiles</h3>
            <p className="text-sm text-gray-600 mt-1">
              Route 53 Profiles help manage DNS configurations centrally
              and associate DNS settings with supported VPCs and networks.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="border border-[#d5dbdb] rounded-lg p-5 bg-white">
          <Globe className="text-blue-600" size={22} />
          <p className="text-sm text-gray-600 mt-3">Total profiles</p>
          <p className="text-3xl font-semibold mt-2">{profiles.length}</p>
        </div>

        <div className="border border-[#d5dbdb] rounded-lg p-5 bg-white">
          <ShieldCheck className="text-green-600" size={22} />
          <p className="text-sm text-gray-600 mt-3">Active profiles</p>
          <p className="text-3xl font-semibold mt-2">
            {profiles.filter((p) => p.status === "Active").length}
          </p>
        </div>

        <div className="border border-[#d5dbdb] rounded-lg p-5 bg-white">
          <UserCircle className="text-purple-600" size={22} />
          <p className="text-sm text-gray-600 mt-3">Inactive profiles</p>
          <p className="text-3xl font-semibold mt-2">
            {profiles.filter((p) => p.status !== "Active").length}
          </p>
        </div>
      </div>

      <div className="border border-[#d5dbdb] rounded-lg overflow-hidden">
        <div className="p-5 border-b border-[#d5dbdb]">
          <div className="flex justify-between items-center gap-3">
            <div>
              <h2 className="text-xl font-semibold">
                DNS profiles ({filteredProfiles.length})
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                View and manage your DNS profiles.
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
              placeholder="Search profiles"
              className="w-full border border-gray-400 rounded-md pl-10 pr-3 py-2.5 text-sm outline-none focus:border-[#0972d3]"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-[#f2f3f3] border-b border-[#d5dbdb]">
              <tr>
                <th className="p-4 font-semibold">Profile name</th>
                <th className="p-4 font-semibold">Description</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 font-semibold">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredProfiles.length === 0 ? (
                <tr>
                  <td colSpan={4} className="p-12 text-center">
                    <UserCircle
                      size={30}
                      className="mx-auto mb-3 text-gray-400"
                    />
                    <p className="font-semibold">No profiles found</p>
                    <p className="text-gray-500 text-xs mt-1">
                      Create a DNS profile to get started.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredProfiles.map((profile) => (
                  <tr key={profile.id} className="border-b border-[#eaeded]">
                    <td className="p-4">{profile.name}</td>
                    <td className="p-4">{profile.description}</td>
                    <td className="p-4">{profile.status}</td>
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
              <h2 className="text-xl font-semibold">Create profile</h2>
              <button onClick={() => setModalOpen(false)}>✕</button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-sm text-gray-600">
                Profile creation and DNS configuration management are
                currently UI placeholders. Backend functionality is
                not implemented.
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
