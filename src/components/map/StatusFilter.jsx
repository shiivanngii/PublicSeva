import React from "react";

export default function StatusFilter({ statusFilter, setStatusFilter }) {
    const statuses = [
        { key: "untouched", label: "Unsolved", color: "#8B0000" },
        { key: "in_progress", label: "In Progress", color: "#FFD93D" },
        { key: "resolved", label: "Resolved", color: "#6BCB77" },
    ];

    const handleToggle = (key) => {
        setStatusFilter((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    return (
        <div className="flex flex-col gap-2 p-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-lg shadow-lg">
            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Filter by Status
            </span>
            {statuses.map((status) => (
                <label
                    key={status.key}
                    className="flex items-center gap-2 cursor-pointer select-none"
                >
                    <input
                        type="checkbox"
                        checked={statusFilter[status.key]}
                        onChange={() => handleToggle(status.key)}
                        className="sr-only"
                    />
                    <div
                        className={`flex items-center gap-2 px-3 py-2 rounded-lg border-2 transition-all w-full ${statusFilter[status.key]
                                ? "border-current opacity-100"
                                : "border-gray-300 dark:border-gray-600 opacity-50"
                            }`}
                        style={{
                            borderColor: statusFilter[status.key] ? status.color : undefined,
                            backgroundColor: statusFilter[status.key] ? `${status.color}15` : "transparent",
                        }}
                    >
                        <span
                            className="w-3 h-3 rounded-full flex-shrink-0"
                            style={{ backgroundColor: status.color }}
                        />
                        <span
                            className="text-sm font-medium whitespace-nowrap"
                            style={{ color: statusFilter[status.key] ? status.color : undefined }}
                        >
                            {status.label}
                        </span>
                    </div>
                </label>
            ))}
        </div>
    );
}