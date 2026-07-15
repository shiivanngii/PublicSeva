import React, { useMemo } from "react";
import { X, Filter } from "lucide-react";
import FilterPanel from "./FilterPanel";
import MyLocationToggle from "./MyLocationToggle";
import PostList from "./PostList";
// import mockData from "../../../data/mockData.json";

export default function LeftSidebar({
    isOpen,
    onClose,
    posts,
    filters,
    onFilterChange,
    selectedPostId,
    onPostClick,
    myLocationActive,
    onMyLocationToggle,
    onLocationFound,

    // admin controls
    onEditPost,
    onDeletePost,
    onStatusChange,
}) {
    // Check if any filter is active
    const hasActiveFilters = useMemo(() => {
        return (
            filters.reportId.trim() !== "" ||
            filters.status !== "" ||
            filters.severity !== "" ||
            filters.location.trim() !== ""
        );
    }, [filters]);

    // const to retrieve the current selected issue
    const selectedPost = useMemo(
        () => posts.find((p) => p.report_id === selectedPostId),
        [posts, selectedPostId]
    );


    // Apply filters - search ALL posts when filters are active, otherwise show clicked + nearby
    const filteredPosts = useMemo(() => {
        // Determine source: all posts if filters active, otherwise just sidebar posts
        const sourceData = posts;

        if (!sourceData || sourceData.length === 0) return [];

        return sourceData.filter((post) => {
            // If no filters active, show all from source
            if (!hasActiveFilters) {
                return true;
            }

            // OR logic: post matches if it matches ANY active filter
            const matches = [];

            if (filters.reportId.trim() !== "") {
                matches.push(
                    post.report_id.toLowerCase().includes(filters.reportId.toLowerCase())
                );
            }

            if (filters.status !== "") {
                matches.push(post.status === filters.status);
            }

            if (filters.severity !== "") {
                const severity = post.severity;
                if (filters.severity === "high") matches.push(severity >= 70);
                else if (filters.severity === "moderate") matches.push(severity >= 40 && severity < 70);
                else if (filters.severity === "low") matches.push(severity < 40);
            }

            if (filters.location.trim() !== "") {
                matches.push(
                    post.location.toLowerCase().includes(filters.location.toLowerCase())
                );
            }

            // Return true if ANY filter matches (OR logic)
            return matches.some((match) => match);
        });
    }, [posts, filters, hasActiveFilters]);

    return (
        <>
            {/* Backdrop for mobile */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-20 lg:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar - Wider width */}
            <div
                className={`
                    bg-white dark:bg-gray-800
                    border-r border-gray-200 dark:border-gray-700
                    shadow-sm

                    w-[480px] max-w-full
                    flex flex-col

                    sticky top-16
                    h-[calc(100vh-4rem)]

                    ${isOpen ? "block" : "hidden"}
                `}
                >

                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 bg-green-600 flex-shrink-0">
                    <h2 className="text-lg font-semibold text-white">
                        Waste Hotspots Reports
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-md text-white/80 hover:text-white hover:bg-white/10 transition"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Filters Header Row */}
                <div className="flex items-center justify-between px-4 py-2 bg-white dark:bg-gray-800 flex-shrink-0">
                    <div className="flex items-center gap-2">
                        <Filter size={16} className="text-green-600 dark:text-green-400" />
                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Filters</span>
                        {hasActiveFilters && (
                            <span className="text-xs text-green-600 dark:text-green-400"></span>
                        )}
                    </div>
                    <MyLocationToggle
                        isActive={myLocationActive}
                        onToggle={onMyLocationToggle}
                        onLocationFound={onLocationFound}
                    />
                </div>

                {/* Filter Panel - Horizontal */}
                <FilterPanel filters={filters} onFilterChange={onFilterChange} />

                {/* Admin Action panel */}
                {selectedPost && (
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                        <div className="flex flex-col gap-2">
                            <div className="flex items-center justify-between">
                                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                    Admin Actions
                                </span>
                                <span className="text-xs text-gray-500">
                                    ID: {selectedPost.report_id.slice(-6)}
                                </span>
                            </div>

                            {/* Status Change */}
                            <select
                                value={selectedPost.status}
                                onChange={(e) =>
                                    onStatusChange?.(selectedPost.report_id, e.target.value)
                                }
                                className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded-md
                                        bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200
                                        focus:ring-2 focus:ring-green-500 outline-none"
                            >
                                <option value="untouched">Untouched</option>
                                <option value="in_progress">In Progress</option>
                                <option value="resolved">Resolved</option>
                            </select>

                            {/* Action Buttons */}
                            <div className="flex gap-2 pt-1">
                                <button
                                    onClick={() => onEditPost?.(selectedPost)}
                                    className="flex-1 px-3 py-1.5 text-sm rounded-md
                                            bg-green-600 text-white hover:bg-green-700 transition"
                                >
                                    Edit
                                </button>

                                <button
                                    onClick={() => onDeletePost?.(selectedPost.report_id)}
                                    className="flex-1 px-3 py-1.5 text-sm rounded-md
                                            bg-red-500 text-white hover:bg-red-600 transition"
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}


                {/* Post List - Scrollable */}
                <div className="flex-1 overflow-y-auto">
                    <PostList
                        posts={filteredPosts}
                        selectedPostId={selectedPostId}
                        onPostClick={onPostClick}
                    />
                </div>
            </div>
        </>
    );
}