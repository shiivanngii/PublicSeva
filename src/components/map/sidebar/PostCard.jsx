import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import { MapPin, ThumbsUp, Flag, Calendar } from "lucide-react";
import "swiper/css";
import "swiper/css/pagination";

// Status color mapping
const STATUS_COLORS = {
    untouched: { bg: "#8B0000", text: "Untouched" },
    in_progress: { bg: "#FFD93D", text: "In Progress" },
    resolved: { bg: "#6BCB77", text: "Resolved" },
};

// Get severity level and color
const getSeverityInfo = (severity) => {
    if (severity >= 70) return { label: "High", color: "#DC2626" };
    if (severity >= 40) return { label: "Moderate", color: "#F59E0B" };
    return { label: "Low", color: "#10B981" };
};

// Format date
const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
};

export default function PostCard({ post, isSelected, onClick }) {
    const statusInfo = STATUS_COLORS[post.status];
    const severityInfo = getSeverityInfo(post.severity);

    return (
        <div
            onClick={() => onClick(post)}
            className={`
                bg-white dark:bg-gray-700 rounded-xl shadow-md cursor-pointer
                transition-all duration-200 hover:shadow-lg border border-gray-200 dark:border-gray-600
                ${isSelected ? "ring-2 ring-green-500 ring-offset-2 dark:ring-offset-gray-800" : ""}
            `}
            style={{ minHeight: "140px" }}
        >
            {/* Horizontal Layout: Image Left, Content Right */}
            <div className="flex h-full">
                {/* Image Swiper - Left Side */}
                <div className="w-32 flex-shrink-0 rounded-l-xl overflow-hidden">
                    <Swiper
                        modules={[Pagination]}
                        pagination={{ clickable: true }}
                        className="w-full h-full"
                        style={{ height: "140px" }}
                    >
                        {post.images.map((image, index) => (
                            <SwiperSlide key={index}>
                                <img
                                    src={image}
                                    alt={`${post.report_id} - ${index + 1}`}
                                    className="w-full h-full object-cover"
                                    style={{ height: "140px" }}
                                    onError={(e) => {
                                        e.target.src = "https://placehold.co/400x300/gray/white?text=Image";
                                    }}
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>

                {/* Content - Right Side */}
                <div className="flex-1 p-3 flex flex-col justify-between min-w-0">
                    {/* Top Row: Date, Report ID, Vote/Report counts */}
                    <div>
                        <div className="flex items-start justify-between gap-2 mb-1">
                            <div>
                                <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                                    <Calendar size={10} />
                                    <span>{formatDate(post.createdAt)}</span>
                                </div>
                                <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100 line-clamp-1">
                                    {post.title}
                                </h3>

                            </div>
                            {/* Vote & Report Counts - Right */}
                            <div className="flex flex-col items-end text-xs text-gray-600 dark:text-gray-400 flex-shrink-0">
                                <div className="flex items-center gap-1">
                                    <ThumbsUp size={10} className="text-blue-500" />
                                    <span>{post.votes}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Flag size={10} className="text-red-500" />
                                    <span>{post.reports}</span>
                                </div>
                            </div>
                        </div>

                        {/* Description */}
                        <p className="text-xs text-gray-700 dark:text-gray-300 line-clamp-2 mb-2">
                            {post.description}
                        </p>
                    </div>

                    {/* Bottom Row: Location, Severity, Status */}
                    <div className="flex items-center gap-2 flex-wrap">
                        {/* Location */}
                        <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                            <MapPin size={10} className="text-green-600 dark:text-green-400 flex-shrink-0" />
                            <span className="truncate max-w-[100px]">{post.location.split(",")[0]}</span>
                        </div>

                        {/* Severity Badge */}
                        <span
                            className="px-1.5 py-0.5 rounded text-[10px] font-medium text-white"
                            style={{ backgroundColor: severityInfo.color }}
                        >
                            {severityInfo.label}
                        </span>

                        {/* Status Badge */}
                        <span
                            className="px-1.5 py-0.5 rounded text-[10px] font-medium"
                            style={{
                                backgroundColor: statusInfo.bg,
                                color: post.status === "in_progress" ? "#333" : "#fff",
                            }}
                        >
                            {statusInfo.text}
                        </span>
                    </div>
                </div>
            </div>

            {/* Swiper pagination styles */}
            <style>{`
                .swiper-pagination-bullet {
                    background: white;
                    opacity: 0.6;
                    width: 6px;
                    height: 6px;
                }
                .swiper-pagination-bullet-active {
                    background: #16a34a;
                    opacity: 1;
                }
                .swiper-pagination {
                    bottom: 4px !important;
                }
            `}</style>
        </div>
    );
}