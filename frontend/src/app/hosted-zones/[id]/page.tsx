
"use client";

import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import {
    ArrowLeft, Plus, Search, RefreshCw, Trash2,
    Pencil, X, ChevronLeft, ChevronRight, Loader2
} from "lucide-react";
import { apiRequest } from "@/lib/api";
import { toast } from "sonner";

interface DNSRecord {
    id: number;
    name: string;
    type: string;
    value: string;
    ttl: number;
    routing_policy: string;
    hosted_zone_id: number;
}

interface HostedZone {
    id: number;
    name: string;
    zone_id: string;
    type: string;
    comment: string;
}

interface RecordsResponse {
    items: DNSRecord[];
    total: number;
    skip: number;
    limit: number;
}

const recordTypes = [
    "A", "AAAA", "CNAME", "TXT", "MX",
    "NS", "PTR", "SRV", "CAA"
];

export default function HostedZoneDetailsPage() {
    const params = useParams();
    const router = useRouter();

    const zoneId = String(params.id);

    const [zone, setZone] = useState<HostedZone | null>(null);
    const [records, setRecords] = useState<DNSRecord[]>([]);
    const [total, setTotal] = useState(0);
    const [selectedRecordIds, setSelectedRecordIds] = useState<number[]>([]);
    const [bulkDeleting, setBulkDeleting] = useState(false);

    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [filterType, setFilterType] = useState("");
    const [page, setPage] = useState(0);

    const [modalOpen, setModalOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [editingRecord, setEditingRecord] =
        useState<DNSRecord | null>(null);

    const [form, setForm] = useState({
        name: "",
        type: "A",
        value: "",
        ttl: 300,
        routing_policy: "Simple",

        priority: 0,
        weight: 0,
        port: 0,
        target: "",
        flags: 0,
        tag: "issue"
    });

    const pageSize = 10;

    function getRecordValue() {
        switch (form.type) {
            case "MX":
                return JSON.stringify({
                    priority: form.priority,
                    mail_server: form.target
                });

            case "SRV":
                return JSON.stringify({
                    priority: form.priority,
                    weight: form.weight,
                    port: form.port,
                    target: form.target
                });

            case "CAA":
                return JSON.stringify({
                    flags: form.flags,
                    tag: form.tag,
                    value: form.value
                });

            default:
                return form.value;
        }
    }

    const fetchData = useCallback(async () => {
        setLoading(true);

        try {
            const zoneData = await apiRequest<HostedZone>(
                `/api/hosted-zones/${zoneId}`
            );

            setZone(zoneData);

            const query = new URLSearchParams({
                search,
                skip: String(page * pageSize),
                limit: String(pageSize)
            });

            if (filterType) {
                query.set("record_type", filterType);
            }

            const recordsData = await apiRequest<RecordsResponse>(
                `/api/hosted-zones/${zoneId}/records/?${query}`
            );

            setRecords(recordsData.items);
            setTotal(recordsData.total);

        } catch (error) {
            toast.error(
                error instanceof Error ? error.message : "Failed to load zone"
            );
        } finally {
            setLoading(false);
        }
    }, [zoneId, search, filterType, page]);



    function toggleRecordSelection(recordId: number) {
        setSelectedRecordIds((prev) =>
            prev.includes(recordId)
                ? prev.filter((id) => id !== recordId)
                : [...prev, recordId]
        );
    }

    function toggleSelectAll() {
        const currentPageIds = records.map((record) => record.id);

        const allSelected = currentPageIds.every((id) =>
            selectedRecordIds.includes(id)
        );

        if (allSelected) {
            setSelectedRecordIds((prev) =>
                prev.filter((id) => !currentPageIds.includes(id))
            );
        } else {
            setSelectedRecordIds((prev) =>
                Array.from(new Set([...prev, ...currentPageIds]))
            );
        }
    }

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    function openCreateModal() {
        setEditingRecord(null);

        setForm({
            name: "",
            type: "A",
            value: "",
            ttl: 300,
            routing_policy: "Simple",
            priority: 0,
            weight: 0,
            port: 0,
            target: "",
            flags: 0,
            tag: "issue"
        });

        setModalOpen(true);
    }


    function openEditModal(record: DNSRecord) {
        setEditingRecord(record);

        let parsedValue: any = {};

        if (["MX", "SRV", "CAA"].includes(record.type)) {
            try {
                parsedValue = JSON.parse(record.value);
            } catch {
                parsedValue = {};
            }
        }

        setForm({
            name: record.name,
            type: record.type,
            value:
                record.type === "CAA"
                    ? parsedValue.value || ""
                    : record.type === "MX" || record.type === "SRV"
                        ? ""
                        : record.value,
            ttl: record.ttl,
            routing_policy: record.routing_policy || "Simple",

            priority: parsedValue.priority ?? 0,
            weight: parsedValue.weight ?? 0,
            port: parsedValue.port ?? 0,
            target: parsedValue.mail_server || parsedValue.target || "",
            flags: parsedValue.flags ?? 0,
            tag: parsedValue.tag || "issue",
        });

        setModalOpen(true);
    }

    function validateRecord(): string | null {
        const value = form.value.trim();
        const domainPattern =
            /^(?=.{1,253}$)(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)(?:\.(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?))*\.?$/;

        switch (form.type) {
            case "A": {
                const ipv4Parts = value.split(".");
                const valid =
                    ipv4Parts.length === 4 &&
                    ipv4Parts.every(
                        (part) =>
                            /^\d{1,3}$/.test(part) &&
                            Number(part) >= 0 &&
                            Number(part) <= 255
                    );

                if (!valid) return "Enter a valid IPv4 address.";
                break;
            }

            case "AAAA": {
                const valid =
                    value.includes(":") &&
                    /^[0-9a-fA-F:]+$/.test(value) &&
                    value.length <= 39;

                if (!valid) return "Enter a valid IPv6 address.";
                break;
            }

            case "CNAME":
            case "NS":
            case "PTR":
                if (!domainPattern.test(value)) {
                    return "Enter a valid domain name.";
                }
                break;

            case "MX":
                if (
                    !Number.isInteger(form.priority) ||
                    form.priority < 0 ||
                    form.priority > 65535 ||
                    !domainPattern.test(form.target)
                ) {
                    return "Enter a valid MX priority and mail server.";
                }
                break;

            case "SRV":
                if (
                    [form.priority, form.weight, form.port].some(
                        (number) => !Number.isInteger(number) || number < 0 || number > 65535
                    ) ||
                    !domainPattern.test(form.target)
                ) {
                    return "Enter valid SRV values.";
                }
                break;

            case "CAA":
                if (
                    !Number.isInteger(form.flags) ||
                    form.flags < 0 ||
                    form.flags > 255 ||
                    !["issue", "issuewild", "iodef"].includes(form.tag) ||
                    !value
                ) {
                    return "Enter valid CAA flags, tag and value.";
                }
                break;

            case "TXT":
                if (!value) return "TXT value cannot be empty.";
                break;
        }

        return null;
    }


    async function saveRecord(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const validationError = validateRecord();

        if (validationError) {
            toast.error(validationError);
            return;
        }
        setSaving(true);

        try {
            const endpoint = editingRecord
                ? `/api/hosted-zones/${zoneId}/records/${editingRecord.id}`
                : `/api/hosted-zones/${zoneId}/records/`;

            await apiRequest(endpoint, {
                method: editingRecord ? "PUT" : "POST",
                body: JSON.stringify({
                    name: form.name,
                    type: form.type,
                    value: getRecordValue(),
                    ttl: form.ttl,
                    routing_policy: form.routing_policy
                })
            });

            toast.success(
                editingRecord
                    ? "DNS record updated successfully!"
                    : "DNS record created successfully!"
            );

            setModalOpen(false);
            setEditingRecord(null);

            await fetchData();

        } catch (error) {
            toast.error(
                error instanceof Error ? error.message : "Failed to save record"
            );
        } finally {
            setSaving(false);
        }
    }

    async function deleteRecord(record: DNSRecord) {
        if (!window.confirm(`Delete DNS record ${record.name}?`)) return;

        try {
            await apiRequest(
                `/api/hosted-zones/${zoneId}/records/${record.id}`,
                { method: "DELETE" }
            );

            toast.success("DNS record deleted successfully!");
            await fetchData();

        } catch (error) {
            toast.error(
                error instanceof Error ? error.message : "Failed to delete record"
            );
        }
    }


    async function deleteSelectedRecords() {
        if (selectedRecordIds.length === 0) {
            toast.error("Please select at least one record.");
            return;
        }

        const confirmed = window.confirm(
            `Are you sure you want to delete ${selectedRecordIds.length} selected DNS records?`
        );

        if (!confirmed) return;

        setBulkDeleting(true);

        try {
            const results = await Promise.allSettled(
                selectedRecordIds.map((recordId) =>
                    apiRequest(
                        `/api/hosted-zones/${zoneId}/records/${recordId}`,
                        { method: "DELETE" }
                    )
                )
            );

            const successful = results.filter(
                (result) => result.status === "fulfilled"
            ).length;

            const failed = results.length - successful;

            setSelectedRecordIds([]);

            if (successful > 0) {
                toast.success(`${successful} DNS record(s) deleted successfully.`);
            }

            if (failed > 0) {
                toast.error(`${failed} record(s) could not be deleted.`);
            }

            await fetchData();

        } catch {
            toast.error("Bulk deletion failed.");
        } finally {
            setBulkDeleting(false);
        }
    }


    const totalPages = Math.max(1, Math.ceil(total / pageSize));

    return (
        <div className="max-w-[1400px] mx-auto">

            <button
                onClick={() => router.push("/hosted-zones")}
                className="flex items-center gap-2 text-[#0972d3] mb-6 hover:underline text-sm"
            >
                <ArrowLeft size={16} />
                Hosted zones
            </button>

            <div className="flex flex-wrap justify-between items-start gap-4 mb-7">
                <div>
                    <h1 className="text-3xl font-semibold">
                        {zone?.name || "Hosted zone"}
                    </h1>
                    <p className="text-sm text-gray-500 mt-2">
                        Hosted zone details and DNS records
                    </p>
                </div>


                <div className="flex items-center gap-3 flex-wrap">
                    {selectedRecordIds.length > 0 && (
                        <button
                            onClick={deleteSelectedRecords}
                            disabled={bulkDeleting}
                            className="border border-red-500 text-red-600 hover:bg-red-50 px-5 py-2.5 rounded-full font-semibold flex items-center gap-2 disabled:opacity-50"
                        >
                            {bulkDeleting ? (
                                <Loader2 size={17} className="animate-spin" />
                            ) : (
                                <Trash2 size={17} />
                            )}
                            {bulkDeleting
                                ? "Deleting..."
                                : `Delete selected (${selectedRecordIds.length})`}
                        </button>
                    )}

                    <button
                        onClick={openCreateModal}
                        className="bg-[#ff9900] hover:bg-[#ec8b00] px-5 py-2.5 rounded-full font-bold flex items-center gap-2"
                    >
                        <Plus size={17} />
                        Create record
                    </button>
                </div>

            </div>

            {/* Zone information */}
            <div className="border rounded-lg p-5 mb-6">
                <h2 className="text-lg font-semibold mb-4">
                    Hosted zone details
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div>
                        <p className="text-xs text-gray-500">Domain name</p>
                        <p className="font-semibold mt-1">{zone?.name || "—"}</p>
                    </div>

                    <div>
                        <p className="text-xs text-gray-500">Hosted zone ID</p>
                        <p className="font-mono text-sm mt-1">
                            {zone?.zone_id || "—"}
                        </p>
                    </div>

                    <div>
                        <p className="text-xs text-gray-500">Type</p>
                        <p className="font-semibold mt-1">{zone?.type || "—"}</p>
                    </div>
                </div>
            </div>

            {/* Records table */}
            <div className="border rounded-lg overflow-hidden">

                <div className="p-5 border-b">
                    <div className="flex justify-between items-center gap-3 flex-wrap">
                        <div>
                            <h2 className="text-xl font-semibold">
                                Records ({total})
                            </h2>
                            <p className="text-xs text-gray-500 mt-1">
                                Manage DNS records in this hosted zone.
                            </p>
                        </div>

                        <button
                            onClick={fetchData}
                            className="border rounded-full p-2 hover:bg-gray-100"
                            title="Refresh"
                        >
                            <RefreshCw size={17} />
                        </button>
                    </div>

                    <div className="flex flex-wrap gap-3 mt-5">
                        <div className="relative flex-1 min-w-[220px] max-w-md">
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
                                placeholder="Search records"
                                className="w-full border rounded-md pl-10 pr-3 py-2.5 outline-none focus:border-[#0972d3]"
                            />
                        </div>

                        <select
                            value={filterType}
                            onChange={(e) => {
                                setFilterType(e.target.value);
                                setPage(0);
                            }}
                            className="border rounded-md px-4 py-2.5 bg-white"
                        >
                            <option value="">All record types</option>
                            {recordTypes.map((type) => (
                                <option key={type} value={type}>{type}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="bg-[#f2f3f3] border-b">
                            <tr>
                                <th className="p-4 w-12">
                                    <input
                                        type="checkbox"
                                        checked={
                                            records.length > 0 &&
                                            records.every((record) =>
                                                selectedRecordIds.includes(record.id)
                                            )
                                        }
                                        onChange={toggleSelectAll}
                                        aria-label="Select all records on this page"
                                    />
                                </th>
                                <th className="p-4">Record name</th>
                                <th className="p-4">Type</th>
                                <th className="p-4">Value</th>
                                <th className="p-4">TTL</th>
                                <th className="p-4">Routing policy</th>
                                <th className="p-4">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className="p-12 text-center">
                                        <Loader2 className="animate-spin mx-auto" />
                                        <p className="mt-2">Loading records...</p>
                                    </td>
                                </tr>
                            ) : records.length === 0 ? (
                                <tr>
                                    <td colSpan={7} className="p-12 text-center text-gray-500">
                                        No DNS records found.
                                    </td>
                                </tr>
                            ) : (
                                records.map((record) => (
                                    <tr
                                        key={record.id}
                                        className="border-b hover:bg-gray-50"
                                    >

                                        <td className="p-4">
                                            <input
                                                type="checkbox"
                                                checked={selectedRecordIds.includes(record.id)}
                                                onChange={() => toggleRecordSelection(record.id)}
                                                aria-label={`Select ${record.name}`}
                                            />
                                        </td>
                                        <td className="p-4 font-semibold text-[#0972d3]">
                                            {record.name}
                                        </td>

                                        <td className="p-4">{record.type}</td>

                                        <td className="p-4 font-mono text-xs max-w-[250px] break-all">
                                            {record.value}
                                        </td>

                                        <td className="p-4">{record.ttl}</td>

                                        <td className="p-4">
                                            {record.routing_policy || "Simple"}
                                        </td>

                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => openEditModal(record)}
                                                    className="text-[#0972d3]"
                                                    title="Edit record"
                                                >
                                                    <Pencil size={16} />
                                                </button>

                                                <button
                                                    onClick={() => deleteRecord(record)}
                                                    className="text-red-600"
                                                    title="Delete record"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="flex justify-between items-center flex-wrap gap-3 p-4">
                    <span className="text-xs text-gray-500">
                        Showing {total === 0 ? 0 : page * pageSize + 1}–
                        {Math.min((page + 1) * pageSize, total)} of {total} records
                    </span>

                    <div className="flex items-center gap-3">
                        <button
                            disabled={page === 0}
                            onClick={() => setPage(p => p - 1)}
                            className="border rounded-full p-2 disabled:opacity-30"
                        >
                            <ChevronLeft size={17} />
                        </button>

                        <span>{page + 1} / {totalPages}</span>

                        <button
                            disabled={(page + 1) * pageSize >= total}
                            onClick={() => setPage(p => p + 1)}
                            className="border rounded-full p-2 disabled:opacity-30"
                        >
                            <ChevronRight size={17} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Create / Edit modal */}
            {modalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-2xl w-full max-w-xl">

                        <div className="flex justify-between items-center p-5 border-b">
                            <h2 className="text-xl font-semibold">
                                {editingRecord ? "Edit record" : "Create record"}
                            </h2>

                            <button onClick={() => setModalOpen(false)}>
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={saveRecord} className="p-6 space-y-4">

                            <div>
                                <label className="block font-semibold text-sm mb-2">
                                    Record name
                                </label>

                                <input
                                    required
                                    value={form.name}
                                    onChange={(e) =>
                                        setForm({ ...form, name: e.target.value })
                                    }
                                    placeholder="www.example.com"
                                    className="w-full border rounded-md p-3"
                                />
                            </div>

                            <div>
                                <label className="block font-semibold text-sm mb-2">
                                    Record type
                                </label>

                                <select
                                    value={form.type}
                                    onChange={(e) =>
                                        setForm({ ...form, type: e.target.value })
                                    }
                                    className="w-full border rounded-md p-3 bg-white"
                                >
                                    {recordTypes.map(type => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>


                            {form.type === "MX" ? (
                                <>
                                    <div>
                                        <label className="block font-semibold text-sm mb-2">
                                            Priority
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            required
                                            value={form.priority}
                                            onChange={(e) =>
                                                setForm({ ...form, priority: Number(e.target.value) })
                                            }
                                            className="w-full border rounded-md p-3"
                                        />
                                    </div>

                                    <div>
                                        <label className="block font-semibold text-sm mb-2">
                                            Mail server
                                        </label>
                                        <input
                                            required
                                            value={form.target}
                                            onChange={(e) =>
                                                setForm({ ...form, target: e.target.value })
                                            }
                                            placeholder="mail.example.com"
                                            className="w-full border rounded-md p-3"
                                        />
                                    </div>
                                </>
                            ) : form.type === "SRV" ? (
                                <>
                                    {(["priority", "weight", "port"] as const).map((field) => (
                                        <div key={field}>
                                            <label className="block font-semibold text-sm mb-2 capitalize">
                                                {field}
                                            </label>
                                            <input
                                                type="number"
                                                min="0"
                                                max={field === "port" ? 65535 : 65535}
                                                required
                                                value={form[field]}
                                                onChange={(e) =>
                                                    setForm({ ...form, [field]: Number(e.target.value) })
                                                }
                                                className="w-full border rounded-md p-3"
                                            />
                                        </div>
                                    ))}

                                    <div>
                                        <label className="block font-semibold text-sm mb-2">
                                            Target
                                        </label>
                                        <input
                                            required
                                            value={form.target}
                                            onChange={(e) =>
                                                setForm({ ...form, target: e.target.value })
                                            }
                                            placeholder="server.example.com"
                                            className="w-full border rounded-md p-3"
                                        />
                                    </div>
                                </>
                            ) : form.type === "CAA" ? (
                                <>
                                    <div>
                                        <label className="block font-semibold text-sm mb-2">
                                            Flags
                                        </label>
                                        <input
                                            type="number"
                                            min="0"
                                            max="255"
                                            required
                                            value={form.flags}
                                            onChange={(e) =>
                                                setForm({ ...form, flags: Number(e.target.value) })
                                            }
                                            className="w-full border rounded-md p-3"
                                        />
                                    </div>

                                    <div>
                                        <label className="block font-semibold text-sm mb-2">
                                            Tag
                                        </label>
                                        <select
                                            value={form.tag}
                                            onChange={(e) =>
                                                setForm({ ...form, tag: e.target.value })
                                            }
                                            className="w-full border rounded-md p-3 bg-white"
                                        >
                                            <option value="issue">issue</option>
                                            <option value="issuewild">issuewild</option>
                                            <option value="iodef">iodef</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block font-semibold text-sm mb-2">
                                            Value
                                        </label>
                                        <input
                                            required
                                            value={form.value}
                                            onChange={(e) =>
                                                setForm({ ...form, value: e.target.value })
                                            }
                                            placeholder="letsencrypt.org"
                                            className="w-full border rounded-md p-3"
                                        />
                                    </div>
                                </>
                            ) : (
                                <div>
                                    <label className="block font-semibold text-sm mb-2">
                                        {form.type === "A"
                                            ? "IPv4 address"
                                            : form.type === "AAAA"
                                                ? "IPv6 address"
                                                : form.type === "CNAME"
                                                    ? "Canonical name"
                                                    : form.type === "TXT"
                                                        ? "Text value"
                                                        : form.type === "NS"
                                                            ? "Name server"
                                                            : form.type === "PTR"
                                                                ? "Pointer domain"
                                                                : "Value"}
                                    </label>

                                    <textarea
                                        required
                                        value={form.value}
                                        onChange={(e) =>
                                            setForm({ ...form, value: e.target.value })
                                        }
                                        placeholder="Enter record value"
                                        className="w-full border rounded-md p-3 min-h-24"
                                    />
                                </div>
                            )}


                            <div>
                                <label className="block font-semibold text-sm mb-2">
                                    TTL (seconds)
                                </label>

                                <input
                                    type="number"
                                    min="0"
                                    required
                                    value={form.ttl}
                                    onChange={(e) =>
                                        setForm({ ...form, ttl: Number(e.target.value) })
                                    }
                                    className="w-full border rounded-md p-3"
                                />
                            </div>

                            <div>
                                <label className="block font-semibold text-sm mb-2">
                                    Routing policy
                                </label>

                                <select
                                    value={form.routing_policy}
                                    onChange={(e) =>
                                        setForm({ ...form, routing_policy: e.target.value })
                                    }
                                    className="w-full border rounded-md p-3 bg-white"
                                >
                                    <option value="Simple">Simple</option>
                                    <option value="Weighted">Weighted</option>
                                    <option value="Latency">Latency</option>
                                    <option value="Failover">Failover</option>
                                    <option value="Geolocation">Geolocation</option>
                                    <option value="Multivalue">Multivalue answer</option>
                                </select>
                            </div>

                            <div className="flex justify-end gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={() => setModalOpen(false)}
                                    className="border rounded-full px-5 py-2"
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="bg-[#ff9900] rounded-full px-5 py-2 font-bold disabled:opacity-50"
                                >
                                    {saving
                                        ? "Saving..."
                                        : editingRecord
                                            ? "Save changes"
                                            : "Create record"}
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
