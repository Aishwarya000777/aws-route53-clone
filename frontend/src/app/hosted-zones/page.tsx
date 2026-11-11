
"use client";

import { useEffect, useCallback, useState } from "react";
import {
    Plus, Search, RefreshCw, Trash2, Globe,
    ChevronLeft, ChevronRight, X, Loader2, Pencil
} from "lucide-react";
import { apiRequest } from "@/lib/api";
import { toast } from "sonner";

interface HostedZone {
    id: number;
    name: string;
    zone_id: string;
    type: string;
    comment: string;
}

interface ZoneResponse {
    items: HostedZone[];
    total: number;
    skip: number;
    limit: number;
}

export default function HostedZonesPage() {
    const [zones, setZones] = useState<HostedZone[]>([]);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(0);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [modalOpen, setModalOpen] = useState(false);
    const [creating, setCreating] = useState(false);
    const [editingZone, setEditingZone] = useState<HostedZone | null>(null);
    const [name, setName] = useState("");
    const [zoneType, setZoneType] = useState("Public");
    const [comment, setComment] = useState("");

    const pageSize = 10;

    const fetchZones = useCallback(async () => {
        setLoading(true);

        try {
            const params = new URLSearchParams({
                search,
                skip: String(page * pageSize),
                limit: String(pageSize)
            });

            const data = await apiRequest<ZoneResponse>(
                `/api/hosted-zones/?${params.toString()}`
            );

            setZones(data.items);
            setTotal(data.total);
        } catch (error) {
            toast.error(
                error instanceof Error ? error.message : "Unable to load hosted zones"
            );
        } finally {
            setLoading(false);
        }
    }, [search, page]);

    useEffect(() => {
        fetchZones();
    }, [fetchZones]);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);

        if (params.get("action") === "create") {
            setEditingZone(null);
            setName("");
            setZoneType("Public");
            setComment("");
            setModalOpen(true);
        }
    }, []);

    function openEditModal(zone: HostedZone) {
        setEditingZone(zone);
        setName(zone.name);
        setZoneType(zone.type);
        setComment(zone.comment || "");
        setModalOpen(true);
    }


    async function createZone(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setCreating(true);

        try {
            const endpoint = editingZone
                ? `/api/hosted-zones/${editingZone.id}`
                : "/api/hosted-zones/";

            await apiRequest<HostedZone>(endpoint, {
                method: editingZone ? "PUT" : "POST",
                body: JSON.stringify({
                    name: name.trim(),
                    type: zoneType,
                    comment
                })
            });

            toast.success(
                editingZone
                    ? "Hosted zone updated successfully!"
                    : "Hosted zone created successfully!"
            );

            // Reset form
            setName("");
            setComment("");
            setZoneType("Public");
            setEditingZone(null);
            setModalOpen(false);
            setPage(0);

            // Refresh hosted zones from backend
            await fetchZones();

        } catch (error) {
            toast.error(
                error instanceof Error
                    ? error.message
                    : editingZone
                        ? "Failed to update hosted zone"
                        : "Failed to create hosted zone"
            );
        } finally {
            setCreating(false);
        }
    }


    async function deleteZone(zone: HostedZone) {
        const confirmed = window.confirm(
            `Delete hosted zone ${zone.name}? All its DNS records will also be deleted.`
        );

        if (!confirmed) return;

        try {
            await apiRequest(
                `/api/hosted-zones/${zone.id}`,
                { method: "DELETE" }
            );

            toast.success("Hosted zone deleted successfully!");
            await fetchZones();
        } catch (error) {
            toast.error(
                error instanceof Error ? error.message : "Failed to delete hosted zone"
            );
        }
    }

    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    return (
        <div className="max-w-[1400px] mx-auto">

            {/* Breadcrumb */}
            <div className="text-xs text-gray-500 mb-5">
                Amazon Route 53 <span className="mx-2">›</span>
                <span className="text-gray-900 font-semibold">Hosted zones</span>
            </div>

            {/* Page heading */}
            <div className="flex flex-wrap justify-between items-start gap-4 mb-7">
                <div>
                    <h1 className="text-3xl font-semibold text-[#16191f]">
                        Hosted zones
                    </h1>
                    <p className="text-sm text-gray-600 mt-2">
                        Manage the hosted zones for your domains.
                    </p>
                </div>

                <button
                    onClick={() => setModalOpen(true)}
                    className="bg-[#ff9900] hover:bg-[#ec8b00] text-[#16191f] px-5 py-2.5 rounded-full font-bold text-sm flex items-center gap-2"
                >
                    <Plus size={17} />
                    Create hosted zone
                </button>
            </div>

            {/* Information */}
            <div className="border border-[#d5dbdb] rounded-lg p-4 mb-6 bg-[#f9f9f9]">
                <div className="flex gap-3">
                    <Globe className="text-[#0972d3] shrink-0" size={20} />
                    <div>
                        <h3 className="font-semibold text-sm">
                            About hosted zones
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                            A hosted zone contains records that control how traffic is
                            routed for a domain and its subdomains.
                        </p>
                    </div>
                </div>
            </div>

            {/* Table container */}
            <div className="border border-[#d5dbdb] rounded-lg overflow-hidden">

                <div className="p-5 border-b border-[#d5dbdb]">
                    <div className="flex flex-wrap justify-between gap-3">
                        <div>
                            <h2 className="text-xl font-semibold">
                                Hosted zones ({total})
                            </h2>
                            <p className="text-xs text-gray-500 mt-1">
                                View and manage your hosted zones.
                            </p>
                        </div>

                        <button
                            onClick={fetchZones}
                            disabled={loading}
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
                            onChange={(e) => {
                                setSearch(e.target.value);
                                setPage(0);
                            }}
                            placeholder="Search hosted zones by domain name"
                            className="w-full border border-gray-400 rounded-md pl-10 pr-3 py-2.5 text-sm outline-none focus:border-[#0972d3]"
                        />
                    </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-[#f2f3f3] border-b border-[#d5dbdb]">
                            <tr>
                                <th className="p-4 font-semibold">Domain name</th>
                                <th className="p-4 font-semibold">Hosted zone ID</th>
                                <th className="p-4 font-semibold">Type</th>
                                <th className="p-4 font-semibold">Comment</th>
                                <th className="p-4 font-semibold">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="p-12 text-center">
                                        <Loader2 className="animate-spin mx-auto mb-2" />
                                        Loading hosted zones...
                                    </td>
                                </tr>
                            ) : zones.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-12 text-center">
                                        <Globe size={30} className="mx-auto mb-3 text-gray-400" />
                                        <p className="font-semibold">No hosted zones found</p>
                                        <p className="text-gray-500 text-xs mt-1">
                                            Create a hosted zone to get started.
                                        </p>
                                    </td>
                                </tr>
                            ) : (
                                zones.map((zone) => (
                                    <tr
                                        key={zone.id}
                                        className="border-b border-[#eaeded] hover:bg-[#f9f9f9]"
                                    >
                                        <td className="p-4">
                                            <a
                                                href={`/hosted-zones/${zone.id}`}
                                                className="text-[#0972d3] hover:underline font-semibold"
                                            >
                                                {zone.name}
                                            </a>
                                        </td>

                                        <td className="p-4 font-mono text-xs">
                                            {zone.zone_id}
                                        </td>

                                        <td className="p-4">{zone.type}</td>

                                        <td className="p-4 text-gray-600">
                                            {zone.comment || "—"}
                                        </td>

                                        <td className="p-4">
                                            <div className="flex items-center gap-3">

                                                <button
                                                    onClick={() => openEditModal(zone)}
                                                    className="text-[#0972d3]"
                                                    title="Edit hosted zone"
                                                >
                                                    <Pencil size={17} />
                                                </button>

                                                <button
                                                    onClick={() => deleteZone(zone)}
                                                    className="text-red-600 hover:text-red-800"
                                                    title="Delete hosted zone"
                                                >
                                                    <Trash2 size={17} />
                                                </button>

                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex flex-wrap justify-between items-center gap-3 p-4">
                    <span className="text-xs text-gray-600">
                        Showing {total === 0 ? 0 : page * pageSize + 1}–
                        {Math.min((page + 1) * pageSize, total)} of {total} hosted zones
                    </span>

                    <div className="flex items-center gap-3">
                        <button
                            disabled={page === 0}
                            onClick={() => setPage((p) => p - 1)}
                            className="border rounded-full p-2 disabled:opacity-30"
                        >
                            <ChevronLeft size={17} />
                        </button>

                        <span className="text-sm">
                            {page + 1} / {totalPages}
                        </span>

                        <button
                            disabled={(page + 1) * pageSize >= total}
                            onClick={() => setPage((p) => p + 1)}
                            className="border rounded-full p-2 disabled:opacity-30"
                        >
                            <ChevronRight size={17} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Create modal */}
            {modalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg">

                        <div className="p-5 border-b flex justify-between items-center">
                            <h2 className="text-xl font-semibold">
                                {editingZone ? "Edit hosted zone" : "Create hosted zone"}
                            </h2>

                            <button onClick={() => {
                                setModalOpen(false);
                                setEditingZone(null);
                            }}>
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={createZone} className="p-6 space-y-5">

                            <div>
                                <label className="block text-sm font-semibold mb-2">
                                    Domain name
                                </label>
                                <input
                                    required
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    placeholder="example.com"
                                    className="w-full border rounded-md p-3 outline-none focus:border-[#0972d3]"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-2">
                                    Type
                                </label>

                                <select
                                    value={zoneType}
                                    onChange={(e) => setZoneType(e.target.value)}
                                    className="w-full border rounded-md p-3 bg-white"
                                >
                                    <option value="Public">Public hosted zone</option>
                                    <option value="Private">Private hosted zone</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold mb-2">
                                    Comment (optional)
                                </label>

                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Description of this hosted zone"
                                    className="w-full border rounded-md p-3 min-h-24 outline-none focus:border-[#0972d3]"
                                />
                            </div>

                            <div className="flex justify-end gap-3 pt-3">
                                <button
                                    type="button"
                                    onClick={() => setModalOpen(false)}
                                    className="border border-gray-400 px-5 py-2 rounded-full"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={creating}
                                    className="bg-[#ff9900] px-5 py-2 rounded-full font-bold disabled:opacity-50"
                                >
                                    {creating
                                        ? "Saving..."
                                        : editingZone
                                            ? "Save changes"
                                            : "Create hosted zone"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
}
