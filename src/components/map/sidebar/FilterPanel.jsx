import React from "react";
import { Search } from "lucide-react";

export default function FilterPanel({ filters, onFilterChange }) {
    const handleChange = (field, value) => {
        onFilterChange({ ...filters, [field]: value });
    };

    return (
        <div className="flex flex-wrap items-end gap-3 p-4">
            {/* Report ID Search */}
            <div className="flex-1 min-w-[120px]">
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Report ID
                </label>
                <div className="relative">
                    <Search size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search..."
                        value={filters.reportId}
                        onChange={(e) => handleChange("reportId", e.target.value)}
                        className="w-full pl-7 pr-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md
                                   bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200
                                   focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                    />
                </div>
            </div>

            {/* Status Dropdown */}
            <div className="flex-1 min-w-[120px]">
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Status
                </label>
                <select
                    value={filters.status}
                    onChange={(e) => handleChange("status", e.target.value)}
                    className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md
                               bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200
                               focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                >
                    <option value="">Select Status</option>
                    <option value="untouched">Untouched</option>
                    <option value="in_progress">In Progress</option>
                    <option value="resolved">Resolved</option>
                </select>
            </div>

            {/* Severity Dropdown */}
            <div className="flex-1 min-w-[120px]">
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Severity
                </label>
                <select
                    value={filters.severity}
                    onChange={(e) => handleChange("severity", e.target.value)}
                    className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md
                               bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200
                               focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                >
                    <option value="">Select Severity</option>
                    <option value="high">High (70+)</option>
                    <option value="moderate">Moderate (40-69)</option>
                    <option value="low">Low (0-39)</option>
                </select>
            </div>

            {/* Location Search */}
            <div className="flex-1 min-w-[120px]">
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Location
                </label>
                <div className="relative">
                    <Search size={14} className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                        type="text"
                        placeholder="Search..."
                        value={filters.location}
                        onChange={(e) => handleChange("location", e.target.value)}
                        className="w-full pl-7 pr-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md
                                   bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200
                                   focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                    />
                </div>
            </div>
        </div>
    );
}