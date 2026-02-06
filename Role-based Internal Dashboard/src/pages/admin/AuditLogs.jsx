import React, { useEffect, useMemo, useState } from "react";
// Correctly importing the constant from your MockData file
import { AUDIT_LOGS } from "../../services/MockData";
import Footer from "../../components/common/footer";

const FALLBACK_MOCK = [
    {
        id: "evt_1",
        timestamp: "2023-10-24T14:23:45Z",
        userName: "Sarah Jenkins",
        userEmail: "sarah.j@company.com",
        avatar: "https://i.pravatar.cc/150?u=sarah",
        action: "Permission Changed",
        ip: "192.168.1.104",
        status: "Success",
        details: "Changed role Admin permissions: +roles.write",
    },
];

// Changed to 5 users per page as requested
const ITEMS_PER_PAGE = 5;

const PaginationButton = ({ children, active, disabled, onClick }) => (
    <button
        disabled={disabled}
        onClick={onClick}
        className={`min-w-[36px] h-9 px-2 flex items-center justify-center rounded-md border text-sm font-medium transition-all
        ${active ? 'bg-blue-600 border-blue-600 text-white' : 'bg-white dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'}
        ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
    >
        {children}
    </button>
);

const parseDate = (s) => {
    const d = new Date(s);
    return isNaN(d.getTime()) ? null : d;
};

const exportToCSV = (rows) => {
    const cols = ["timestamp", "userName", "userEmail", "action", "ip", "status", "details"];
    const csv = [
        cols.join(","),
        ...rows.map((r) =>
            cols
                .map((c) => {
                    const v = r[c] ?? "";
                    return `"${String(v).replace(/"/g, '""')}"`;
                })
                .join(",")
        ),
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
};

const AuditLogs = () => {
    const [loading, setLoading] = useState(true);
    const [logs, setLogs] = useState([]);
    const [search, setSearch] = useState("");
    const [actionFilter, setActionFilter] = useState("All");
    const [statusFilter, setStatusFilter] = useState("All");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [detailsOpen, setDetailsOpen] = useState(false);
    const [selectedLog, setSelectedLog] = useState(null);
    const [sortDesc, setSortDesc] = useState(true);

    // load mock data (simulate network)
    useEffect(() => {
        setLoading(true);
        const t = setTimeout(() => {
            const rawData = Array.isArray(AUDIT_LOGS) && AUDIT_LOGS.length ? AUDIT_LOGS : FALLBACK_MOCK;

            const normalized = rawData.map((d, i) => ({
                id: d.id ?? `evt_${i + 1}`,
                timestamp: d.timestamp,
                userName: d.user?.name || d.userName || "Unknown",
                userEmail: d.user?.email || d.userEmail || "N/A",
                avatar: d.user?.avatar || d.avatar || null,
                action: d.action?.label || d.action || "Unknown Action",
                ip: d.ip,
                status: d.status,
                details: d.details
            }));

            setLogs(normalized);
            setLoading(false);
        }, 800);
        return () => clearTimeout(t);
    }, []);

    const filtered = useMemo(() => {
        if (!logs) return [];
        const q = search.trim().toLowerCase();
        let out = logs.filter((l) => {
            const matchesSearch =
                !q ||
                (l.action && l.action.toLowerCase().includes(q)) ||
                (l.userName && l.userName.toLowerCase().includes(q)) ||
                (l.userEmail && l.userEmail.toLowerCase().includes(q)) ||
                (l.ip && l.ip.toLowerCase().includes(q));
            const matchesAction = actionFilter === "All" || l.action === actionFilter;
            const matchesStatus = statusFilter === "All" || l.status === statusFilter;

            const d = parseDate(l.timestamp);
            let matchesDate = true;
            if (dateFrom) {
                const df = parseDate(dateFrom + "T00:00:00");
                matchesDate = matchesDate && d && d >= df;
            }
            if (dateTo) {
                const dt = parseDate(dateTo + "T23:59:59");
                matchesDate = matchesDate && d && d <= dt;
            }

            return matchesSearch && matchesAction && matchesStatus && matchesDate;
        });

        out.sort((a, b) => {
            const da = parseDate(a.timestamp);
            const db = parseDate(b.timestamp);
            if (!da || !db) return 0;
            return sortDesc ? db - da : da - db;
        });

        return out;
    }, [logs, search, actionFilter, statusFilter, dateFrom, dateTo, sortDesc]);

    const totalResults = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalResults / ITEMS_PER_PAGE));
    const page = Math.min(Math.max(1, currentPage), totalPages);

    useEffect(() => {
        setCurrentPage(page);
    }, [totalResults, page]);

    const paginated = useMemo(() => {
        return filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
    }, [filtered, page]);

    const stats = useMemo(() => {
        const now = Date.now();
        const last24 = logs.filter((l) => {
            const d = parseDate(l.timestamp);
            return d && now - d.getTime() <= 24 * 3600 * 1000;
        }).length;
        const failedLogins = logs.filter((l) => /login/i.test(l.action) && l.status === "Failed").length;
        const critical = logs.filter((l) => l.status === "Failed" || /alert/i.test(l.action)).length;
        return {
            last24,
            failedLogins,
            critical,
            uptime: "99.98%",
        };
    }, [logs]);

    const clearFilters = () => {
        setSearch("");
        setActionFilter("All");
        setStatusFilter("All");
        setDateFrom("");
        setDateTo("");
    };

    const openDetails = (log) => {
        setSelectedLog(log);
        setDetailsOpen(true);
    };

    const closeDetails = () => {
        setDetailsOpen(false);
        setSelectedLog(null);
    };

    const handleExport = () => {
        exportToCSV(filtered);
    };

    const handlePrint = () => {
        const printWin = window.open("", "_blank", "width=900,height=700");
        if (!printWin) return;
        const rowsHtml = filtered
            .map(
                (r) =>
                    `<tr>
            <td>${new Date(r.timestamp).toLocaleString()}</td>
            <td>${r.userName} <div style="font-size:small;color:#666">${r.userEmail}</div></td>
            <td>${r.action}</td>
            <td style="font-family:monospace">${r.ip}</td>
            <td>${r.status}</td>
          </tr>`
            )
            .join("");
        printWin.document.write(`
      <html><head><title>Audit Logs</title>
      <style>table{width:100%;border-collapse:collapse}td,th{border:1px solid #ddd;padding:8px}</style>
      </head><body>
      <h2>Audit Logs</h2>
      <table><thead><tr><th>Timestamp</th><th>User</th><th>Action</th><th>IP</th><th>Status</th></tr></thead><tbody>${rowsHtml}</tbody></table>
      </body></html>
    `);
        printWin.document.close();
        printWin.focus();
        setTimeout(() => printWin.print(), 500);
    };

    const actionOptions = useMemo(() => {
        const set = new Set(logs.map((l) => l.action).filter(Boolean));
        return ["All", ...Array.from(set)];
    }, [logs]);

    const statusOptions = useMemo(() => {
        const set = new Set(logs.map((l) => l.status).filter(Boolean));
        return ["All", ...Array.from(set)];
    }, [logs]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center h-screen gap-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="text-slate-500 animate-pulse">Loading users...</p>
            </div>
        );
    }

    return (
        <div className="mt-5 w-full max-w-7xl px-4 sm:px-4 lg:px-2 flex flex-col gap-6 overflow-x-hidden">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
                <div className="flex flex-col gap-1">
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">System Audit Logs</h1>
                    <p className="text-slate-500 dark:text-slate-400">Review administrative activities and security events.</p>
                </div>
                <div className="flex gap-3">
                    <button onClick={handleExport} className="inline-flex cursor-pointer items-center justify-center rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-200 shadow-sm hover:bg-slate-50 transition-all">
                        <span className="material-symbols-outlined mr-2 text-[20px]">file_download</span>
                        Export CSV
                    </button>
                    <button onClick={handlePrint} className="inline-flex cursor-pointer items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-blue-700 transition-all">
                        <span className="material-symbols-outlined mr-2 text-[20px]">print</span>
                        Print Report
                    </button>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                    title="Total Events (24h)"
                    value={stats.last24.toLocaleString()}
                    color="blue"
                    icon="event"
                />
                <MetricCard
                    title="Critical Alerts"
                    value={stats.critical}
                    color="red"
                    icon="report"
                />
                <MetricCard
                    title="Failed Logins"
                    value={stats.failedLogins}
                    color="amber"
                    icon="lock"
                />
                <MetricCard
                    title="System Uptime"
                    value={stats.uptime}
                    color="green"
                    icon="schedule"
                />
            </div>


            {/* Toolbar + Table */}
            <div className="bg-white dark:bg-[#1a202c] rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">

                        {/* Left: Search + Date */}
                        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
                            <div className="relative flex-1 min-w-[260px]">
                                <input
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="h-10 w-full rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 px-4 text-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                    placeholder="Search activities..."
                                />
                            </div>

                            <div className="flex items-center h-10 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-800 px-2 gap-2">
                                <input
                                    value={dateFrom}
                                    onChange={(e) => setDateFrom(e.target.value)}
                                    className="bg-transparent border-none text-sm focus:outline-none"
                                    type="date"
                                />
                                <span className="text-slate-400 text-sm">–</span>
                                <input
                                    value={dateTo}
                                    onChange={(e) => setDateTo(e.target.value)}
                                    className="bg-transparent border-none text-sm focus:outline-none"
                                    type="date"
                                />
                            </div>
                        </div>

                        {/* Right: Filters */}
                        <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-start lg:justify-end">
                            <select
                                value={actionFilter}
                                onChange={(e) => setActionFilter(e.target.value)}
                                className="h-10 rounded-lg border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white dark:bg-slate-800 px-3 text-sm cursor-pointer"
                            >
                                {actionOptions.map((a) => (
                                    <option key={a} value={a}>{a}</option>
                                ))}
                            </select>

                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="h-10 rounded-lg border border-slate-300 dark:border-slate-600 focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-white dark:bg-slate-800 px-3 text-sm cursor-pointer"
                            >
                                {statusOptions.map((s) => (
                                    <option key={s} value={s}>{s}</option>
                                ))}
                            </select>

                            <button
                                onClick={clearFilters}
                                className="h-10 px-2 text-sm cursor-pointer font-medium text-slate-500 hover:text-slate-700 transition"
                            >
                                Clear
                            </button>
                        </div>

                    </div>
                </div>


                <div className="relative w-full overflow-x-auto">
                    <table className="w-full cursor-default min-w-[1000px] divide-y divide-slate-200 dark:divide-slate-700">
                        <thead className="bg-slate-50 dark:bg-slate-800/50">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase cursor-pointer" onClick={() => setSortDesc(!sortDesc)}>
                                    Timestamp {sortDesc ? "↓" : "↑"}
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">User Account</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">Action</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">IP Address</th>
                                <th className="px-6 py-4 text-left text-xs font-semibold text-slate-500 uppercase">Status</th>
                                <th className="px-6 py-4"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                            {paginated.map((log) => (
                                <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                                    <td className="px-6 py-4 text-sm text-slate-600 dark:text-slate-300">
                                        <div className="font-medium">{new Date(log.timestamp).toLocaleDateString()}</div>
                                        <div className="text-xs text-slate-400">{new Date(log.timestamp).toLocaleTimeString()}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center">
                                            {log.avatar ? <img className="h-8 w-8 rounded-full mr-3" src={log.avatar} alt="" /> : <div className="h-8 w-8 rounded-full bg-slate-200 mr-3" />}
                                            <div className="text-sm">
                                                <div className="font-medium text-slate-900 dark:text-white">{log.userName}</div>
                                                <div className="text-xs text-slate-500">{log.userEmail}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-slate-700 dark:text-slate-200">{log.action}</td>
                                    <td className="px-6 py-4 text-sm font-mono text-slate-500">{log.ip}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${log.status === "Success" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                                            {log.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button onClick={() => openDetails(log)} className="text-blue-600 cursor-pointer hover:text-blue-800 font-medium">Details</button>
                                    </td>
                                </tr>
                            ))}
                            {paginated.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="px-6 py-10 text-center text-slate-500">No results found for your filters.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Footer */}
                <div className="px-6 py-4 cursor-default border-t border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                        Showing <span className="font-medium">{(page - 1) * ITEMS_PER_PAGE + 1}</span> to <span className="font-medium">{Math.min(page * ITEMS_PER_PAGE, totalResults)}</span> of <span className="font-medium">{totalResults}</span> results
                    </span>
                    <div className="flex items-center gap-2">
                        <PaginationButton
                            disabled={page === 1}
                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                        >
                            <span className="material-symbols-outlined text-[20px]">chevron_left</span>
                        </PaginationButton>

                        {/* Page Numbers */}
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pNum) => {
                            // Only show current page, 1 before, 1 after, and first/last to keep it clean
                            if (pNum === 1 || pNum === totalPages || (pNum >= page - 1 && pNum <= page + 1)) {
                                return (
                                    <PaginationButton
                                        key={pNum}
                                        active={pNum === page}
                                        onClick={() => setCurrentPage(pNum)}
                                    >
                                        {pNum}
                                    </PaginationButton>
                                );
                            }
                            // Show ellipsis if there's a gap
                            if (pNum === page - 2 || pNum === page + 2) {
                                return <span key={pNum} className="text-slate-400">...</span>;
                            }
                            return null;
                        })}

                        <PaginationButton
                            disabled={page === totalPages}
                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                        >
                            <span className="material-symbols-outlined text-[20px]">chevron_right</span>
                        </PaginationButton>
                    </div>
                </div>
            </div>

            {/* Details Modal */}
            {detailsOpen && selectedLog && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
                    <div className="relative w-full max-w-2xl bg-white dark:bg-[#0f1724] rounded-xl p-6 shadow-xl">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">Log Details</h2>
                            <button onClick={closeDetails} className="material-symbols-outlined">close</button>
                        </div>
                        <div className="space-y-3 text-sm">
                            <p><strong>Timestamp:</strong> {new Date(selectedLog.timestamp).toLocaleString()}</p>
                            <p><strong>User:</strong> {selectedLog.userName} ({selectedLog.userEmail})</p>
                            <p><strong>Action:</strong> {selectedLog.action}</p>
                            <p><strong>IP:</strong> {selectedLog.ip}</p>
                            <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800 rounded font-mono text-xs whitespace-pre-wrap">
                                {selectedLog.details}
                            </div>
                        </div>
                        <div className="mt-6 flex justify-end gap-3">
                            <button onClick={() => navigator.clipboard.writeText(JSON.stringify(selectedLog, null, 2))} className="px-4 py-2 border rounded">Copy JSON</button>
                            <button onClick={closeDetails} className="px-4 py-2 bg-blue-600 text-white rounded">Close</button>
                        </div>
                    </div>
                </div>
            )}
            <Footer />
        </div>
    );
};

const MetricCard = ({ title, value, color, icon }) => {
    const colorMap = {
        blue: {
            border: "hover:border-blue-500/50",
            shadow: "hover:shadow-blue-500/10",
            text: "text-blue-600 dark:text-blue-400",
            bg: "bg-blue-50 dark:bg-blue-900/20",
        },
        red: {
            border: "hover:border-rose-500/50",
            shadow: "hover:shadow-rose-500/10",
            text: "text-rose-600 dark:text-rose-400",
            bg: "bg-rose-50 dark:bg-rose-900/20",
        },
        amber: {
            border: "hover:border-amber-500/50",
            shadow: "hover:shadow-amber-500/10",
            text: "text-amber-600 dark:text-amber-400",
            bg: "bg-amber-50 dark:bg-amber-900/20",
        },
        green: {
            border: "hover:border-emerald-500/50",
            shadow: "hover:shadow-emerald-500/10",
            text: "text-emerald-600 dark:text-emerald-400",
            bg: "bg-emerald-50 dark:bg-emerald-900/20",
        },
    };

    const style = colorMap[color] || colorMap.blue;

    return (
        <div
            className={`
        group relative bg-white dark:bg-slate-900 p-5 rounded-xl
        border border-slate-200 dark:border-slate-800
        shadow-sm flex flex-col justify-between
        transition-all duration-300 ease-out
        hover:-translate-y-1 hover:shadow-lg
        ${style.shadow} ${style.border}
      `}
        >
            {/* Header */}
            <div className="flex justify-between items-start mb-3">
                <p className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-wider">
                    {title}
                </p>

                <div
                    className={`
            p-2 rounded-lg transition-all duration-300
            group-hover:scale-110 group-hover:rotate-3
            ${style.bg} ${style.text}
          `}
                >
                    <span className="material-symbols-outlined !text-2xl">
                        {icon}
                    </span>
                </div>
            </div>

            {/* Value */}
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                {value}
            </h3>

            {/* Footer */}
            <p className="text-[10px] font-medium text-slate-400 uppercase tracking-tight mt-2">
                Updated now
            </p>
        </div>
    );
};


export default AuditLogs;