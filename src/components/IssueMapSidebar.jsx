import { X, MapPin, Flame, ThumbsUp, MessageCircle } from "lucide-react";

const severityStyles = {
    LOW: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
    MEDIUM: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
    HIGH: "bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300",
    CRITICAL: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
};

const statusStyles = {
    UNSOLVED: "bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300",
    IN_PROGRESS: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-300",
    RESOLVED: "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300",
};

function formatTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return "Yesterday";
    return `${diffDays} days ago`;
}

export default function IssueMapSidebar({ issue, isOpen, onClose }) {
    if (!issue) return null;

    return (
        <div
            className={`issue-sidebar fixed top-0 right-0 h-full w-96 bg-gray-900 border-l border-gray-700 shadow-2xl z-50 overflow-y-auto ${isOpen ? "open" : "closed"
                }`}
        >
            {/* Header */}
            <div className="sticky top-0 bg-gray-900 border-b border-gray-700 p-4 flex justify-between items-center">
                <h2 className="text-lg font-bold text-gray-100">Issue Details</h2>
                <button
                    onClick={onClose}
                    className="p-2 rounded-full hover:bg-gray-800 text-gray-400 hover:text-gray-100 transition"
                >
                    <X size={20} />
                </button>
            </div>

            {/* Issue Card */}
            <div className="p-4">
                <div className="bg-gray-800 rounded-2xl shadow border border-gray-700 overflow-hidden">
                    {/* Issue Image */}
                    {issue.images && issue.images[0] && (
                        <img
                            src={issue.images[0]}
                            alt={issue.title}
                            className="w-full h-48 object-cover"
                        />
                    )}

                    <div className="p-5">
                        {/* Badges */}
                        <div className="flex flex-wrap gap-2">
                            {issue.aiSeverity?.label && (
                                <span
                                    className={`px-3 py-1 text-xs rounded-full ${severityStyles[issue.aiSeverity.label] || severityStyles.MEDIUM
                                        }`}
                                >
                                    <Flame size={14} className="inline mr-1" />
                                    {issue.aiSeverity.label}
                                </span>
                            )}
                            <span
                                className={`px-3 py-1 text-xs rounded-full ${statusStyles[issue.status]}`}
                            >
                                {issue.status.replace("_", " ")}
                            </span>
                        </div>

                        {/* Severity Score */}
                        {issue.severityScore !== undefined && (
                            <div className="mt-3">
                                <div className="flex justify-between text-xs text-gray-400 mb-1">
                                    <span>Severity Score</span>
                                    <span>{issue.severityScore}/100</span>
                                </div>
                                <div className="w-full bg-gray-700 rounded-full h-2">
                                    <div
                                        className="h-2 rounded-full bg-gradient-to-r from-yellow-500 via-orange-500 to-red-600"
                                        style={{ width: `${issue.severityScore}%` }}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Title & Description */}
                        <h3 className="text-lg font-semibold mt-4 text-gray-100">
                            {issue.title}
                        </h3>
                        <p className="text-gray-300 mt-2 text-sm">{issue.description}</p>

                        {/* Location */}
                        {issue.address && (
                            <div className="flex items-center gap-2 text-sm text-gray-400 mt-3">
                                <MapPin size={16} />
                                {issue.address}
                            </div>
                        )}

                        {/* Author */}
                        {issue.createdBy && (
                            <p className="text-xs text-gray-500 mt-2">
                                Reported by {issue.createdBy.name || "Anonymous"}
                            </p>
                        )}

                        {/* Footer with Vote & Comment counts */}
                        <div className="flex justify-between mt-4 border-t border-gray-700 pt-4">
                            <div className="flex gap-6">
                                <div className="flex items-center gap-2 text-gray-300">
                                    <ThumbsUp size={18} />
                                    {issue.votes?.length || 0}
                                </div>
                                <div className="flex items-center gap-2 text-gray-300">
                                    <MessageCircle size={18} />
                                    {issue.comments?.length || 0}
                                </div>
                            </div>
                            <span className="text-xs text-gray-500">
                                {formatTimeAgo(issue.createdAt)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Comments Preview */}
                {issue.comments && issue.comments.length > 0 && (
                    <div className="mt-4 bg-gray-800 rounded-xl p-4 border border-gray-700">
                        <h4 className="text-sm font-semibold text-gray-300 mb-3">
                            Recent Comments ({issue.comments.length})
                        </h4>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                            {issue.comments.slice(-3).map((comment, idx) => (
                                <div key={idx} className="bg-gray-700 rounded-lg p-3">
                                    <div className="flex justify-between items-start">
                                        <span className="text-sm font-medium text-gray-100">
                                            {comment.user?.name || "Anonymous"}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            {formatTimeAgo(comment.createdAt)}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-300 mt-1">{comment.text}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
