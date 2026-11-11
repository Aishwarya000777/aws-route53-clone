
"use client";

import { useMemo, useState } from "react";
import {
  Plus,
  Search,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  Settings,
  UserCircle,
  X,
  ArrowDownUp,
} from "lucide-react";

interface DNSProfile {
  id: number;
  name: string;
  description: string;
  status: string;
  arn?: string;
  ownerAccountId?: string;
  shareStatus?: string;
}

export default function ProfilesPage() {
  const [profiles] = useState<DNSProfile[]>([]);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState<"profiles" | "vpcs">("profiles");
  const [modalOpen, setModalOpen] = useState(false);
  const [page, setPage] = useState(1);

  const pageSize = 10;

  const filteredProfiles = useMemo(() => {
    return profiles.filter((profile) =>
      `${profile.name} ${profile.description} ${profile.arn || ""}`
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [profiles, search]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredProfiles.length / pageSize)
  );

  const visibleProfiles = filteredProfiles.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  function refreshProfiles() {
    setSearch("");
    setPage(1);
  }

  return (
    <div className="aws-page-content w-full min-w-0 text-[var(--text-primary)]">

      {/* Page heading */}
      <div className="mb-7">
        <h1 className="text-[28px] font-bold tracking-tight">
          Profiles
        </h1>
        <p className="mt-1 text-[17px] leading-7 text-[var(--text-secondary)]">
          View and manage Route 53 Profiles and the VPCs associated with them.
        </p>
      </div>

      {/* AWS-style tabs */}
      <div className="mb-5 flex items-center border-b border-[#c5cbd5]">
        <button
          onClick={() => setActiveTab("profiles")}
          className={`relative min-w-[120px] px-6 py-4 text-[18px] font-bold transition-colors ${
            activeTab === "profiles"
              ? "text-[#0972d3]"
              : "text-[var(--text-primary)] hover:text-[#0972d3]"
          }`}
        >
          Profiles
          {activeTab === "profiles" && (
            <span className="absolute bottom-0 left-0 h-[4px] w-full rounded-t-full bg-[#0972d3]" />
          )}
        </button>

        <div className="h-9 border-l border-[#c5cbd5]" />

        <button
          onClick={() => setActiveTab("vpcs")}
          className={`relative min-w-[175px] px-6 py-4 text-[18px] font-bold transition-colors ${
            activeTab === "vpcs"
              ? "text-[#0972d3]"
              : "text-[var(--text-primary)] hover:text-[#0972d3]"
          }`}
        >
          Associated VPCs
          {activeTab === "vpcs" && (
            <span className="absolute bottom-0 left-0 h-[4px] w-full rounded-t-full bg-[#0972d3]" />
          )}
        </button>
      </div>

      {/* Profiles tab */}
      {activeTab === "profiles" && (
        <section className="w-full rounded-2xl border border-[#c5cbd5] bg-[var(--card-bg)] px-6 py-5">

          {/* Panel heading and actions */}
          <div className="flex flex-wrap items-center justify-between gap-4">

            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-[23px] font-bold tracking-tight">
                  Profiles ({filteredProfiles.length})
                </h2>

                <button
                  type="button"
                  title="About profiles"
                  className="text-[15px] font-semibold text-[#0972d3] hover:underline"
                >
                  Info
                </button>
              </div>

              <p className="mt-2 text-[17px] leading-7 text-[var(--text-secondary)]">
                Route 53 Profiles contain DNS resolution information that can
                be associated to multiple VPCs.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                disabled={filteredProfiles.length === 0}
                className="rounded-full border-2 border-[#b7bbc3] px-7 py-2 text-[16px] font-bold text-[#687078] transition hover:bg-[#f2f3f3] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Delete
              </button>

              <button
                onClick={() => setModalOpen(true)}
                className="inline-flex items-center gap-2 rounded-full bg-[#ff9900] px-7 py-2.5 text-[16px] font-bold text-black transition hover:bg-[#ec8b00]"
              >
                <Plus size={19} />
                Create profile
              </button>
            </div>
          </div>

          {/* Search and table controls */}
          <div className="mt-5 flex flex-wrap items-center justify-between gap-4">

            <div className="relative w-full max-w-[810px]">
              <Search
                size={21}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#545b64]"
              />

              <input
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                placeholder="Find profiles"
                className="h-[42px] w-full rounded-lg border border-[#879196] bg-[var(--input-bg)] py-2 pl-12 pr-4 text-[16px] text-[var(--text-primary)] outline-none placeholder:text-[#687078] focus:border-[#0972d3] focus:ring-1 focus:ring-[#0972d3]"
              />
            </div>

            <div className="flex items-center gap-3">

              <button
                onClick={refreshProfiles}
                title="Refresh"
                aria-label="Refresh profiles"
                className="rounded-full p-2 text-[var(--text-primary)] transition hover:bg-[var(--hover-bg)]"
              >
                <RefreshCw size={21} />
              </button>

              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="rounded-full p-1 text-[#545b64] transition hover:bg-[var(--hover-bg)] disabled:opacity-30"
                aria-label="Previous page"
              >
                <ChevronLeft size={23} />
              </button>

              <span className="min-w-5 text-center text-[16px] font-bold">
                {page}
              </span>

              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="rounded-full p-1 text-[#545b64] transition hover:bg-[var(--hover-bg)] disabled:opacity-30"
                aria-label="Next page"
              >
                <ChevronRight size={23} />
              </button>

              <div className="mx-1 h-9 border-l border-[#c5cbd5]" />

              <button
                title="Table settings"
                aria-label="Table settings"
                className="rounded-md p-2 text-[var(--text-primary)] transition hover:bg-[var(--hover-bg)]"
              >
                <Settings size={21} />
              </button>
            </div>
          </div>

          {/* Profiles table */}
          <div className="mt-5 w-full overflow-x-auto">
            <table className="w-full min-w-[850px] border-collapse text-left">

              <thead>
                <tr className="border-b border-[#c5cbd5] bg-[var(--card-bg)]">

                  {["Name", "ARN", "Owner account ID", "Share status"].map(
                    (heading) => (
                      <th
                        key={heading}
                        className="border-r border-[#c5cbd5] px-6 py-4 text-[17px] font-bold last:border-r-0"
                      >
                        <div className="flex items-center justify-between gap-2">
                          {heading}
                          <ArrowDownUp
                            size={15}
                            className="shrink-0 text-[#545b64]"
                          />
                        </div>
                      </th>
                    )
                  )}

                </tr>
              </thead>

              <tbody className="bg-[var(--card-bg)]">
                {visibleProfiles.length === 0 ? (
                  <tr>
                    <td
                      colSpan={4}
                      className="h-[145px] bg-[var(--card-bg)] px-5 py-8 text-center"
                    >
                      <p className="text-[17px] font-medium text-[var(--text-secondary)]">
                        {search
                          ? "No profiles match your search."
                          : "No profiles to display."}
                      </p>

                      {!search && (
                        <div className="mt-5">
                          <button
                            onClick={() => setModalOpen(true)}
                            className="rounded-full border-2 border-[#0972d3] px-7 py-2 text-[17px] font-bold text-[#0972d3] transition hover:bg-[#eaf4ff]"
                          >
                            Create profile
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ) : (
                  visibleProfiles.map((profile) => (
                    <tr
                      key={profile.id}
                      className="border-b border-[#c5cbd5] transition hover:bg-[var(--hover-bg)]"
                    >
                      <td className="px-6 py-4 text-[16px] font-semibold">
                        {profile.name}
                      </td>

                      <td className="px-6 py-4 font-mono text-[14px]">
                        {profile.arn || "—"}
                      </td>

                      <td className="px-6 py-4 text-[16px]">
                        {profile.ownerAccountId || "—"}
                      </td>

                      <td className="px-6 py-4 text-[16px]">
                        {profile.shareStatus || "Not shared"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Associated VPCs tab */}
      {activeTab === "vpcs" && (
        <section className="w-full rounded-2xl border border-[#c5cbd5] bg-[var(--card-bg)] px-6 py-5">

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-[23px] font-bold tracking-tight">
                Associated VPCs (0)
              </h2>

              <p className="mt-2 text-[17px] leading-7 text-[var(--text-secondary)]">
                View and manage the VPCs associated with your Route 53 Profiles.
              </p>
            </div>
          </div>

          <div className="mt-5 border-t border-[#c5cbd5] py-16 text-center">
            <UserCircle
              size={34}
              className="mx-auto mb-4 text-[#879196]"
            />

            <p className="text-[17px] font-semibold">
              No associated VPCs to display.
            </p>
          </div>
        </section>
      )}

      {/* Create profile modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4"
          onClick={() => setModalOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="create-profile-title"
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[520px] overflow-hidden rounded-xl border border-[#c5cbd5] bg-white text-[#16191f] shadow-2xl"
          >

            {/* Modal header */}
            <div className="flex items-center justify-between border-b border-[#d5dbdb] px-6 py-5">
              <h2
                id="create-profile-title"
                className="text-[22px] font-bold"
              >
                Create profile
              </h2>

              <button
                type="button"
                onClick={() => setModalOpen(false)}
                aria-label="Close modal"
                className="rounded-md p-2 text-[#545b64] transition hover:bg-[#f2f3f3]"
              >
                <X size={21} />
              </button>
            </div>

            {/* Modal body */}
            <div className="space-y-6 px-6 py-7">
              <p className="text-[16px] leading-7 text-[#414d5c]">
                Profile creation and VPC association are currently UI
                placeholders. Backend functionality is not implemented.
              </p>

              <div className="flex justify-end border-t border-[#d5dbdb] pt-5">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="rounded-full border border-[#879196] px-7 py-2.5 text-[16px] font-bold text-[#16191f] transition hover:bg-[#f2f3f3]"
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

