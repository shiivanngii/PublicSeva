import { useState, useEffect } from "react";
import CitizenNavbar from "../../components/CitizenNavbar";
import CitizenLeftPanel from "../../components/CitizenLeftPanel";
import Footer from "../../components/Footer";
import { MapPin, Flame, Loader2, Clock, CheckCircle, AlertCircle } from "lucide-react";
import { getMyIssues } from "../../services/issueApi";

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

const statusIcons = {
  UNSOLVED: AlertCircle,
  IN_PROGRESS: Clock,
  RESOLVED: CheckCircle,
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

export default function CheckStatus() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("ALL"); // ALL, UNSOLVED, IN_PROGRESS, RESOLVED

  useEffect(() => {
    const fetchMyIssues = async () => {
      try {
        const data = await getMyIssues();
        setIssues(data.issues || []);
      } catch (err) {
        console.error("Failed to fetch issues:", err);
        setError("Failed to load your issues");
      } finally {
        setLoading(false);
      }
    };

    fetchMyIssues();
  }, []);

  const filteredIssues = filter === "ALL"
    ? issues
    : issues.filter(issue => issue.status === filter);

  const counts = {
    ALL: issues.length,
    UNSOLVED: issues.filter(i => i.status === "UNSOLVED").length,
    IN_PROGRESS: issues.filter(i => i.status === "IN_PROGRESS").length,
    RESOLVED: issues.filter(i => i.status === "RESOLVED").length,
  };

  return (
    <>
      <CitizenNavbar />

      <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
        <CitizenLeftPanel />

        <main className="flex-1 px-6 py-8 max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            My Reports
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Track the status of issues you've reported
          </p>

          {/* Status Filter Tabs */}
          <div className="flex flex-wrap gap-2 mb-8">
            {[
              { key: "ALL", label: "All", color: "bg-gray-600" },
              { key: "UNSOLVED", label: "Unsolved", color: "bg-red-600" },
              { key: "IN_PROGRESS", label: "In Progress", color: "bg-yellow-600" },
              { key: "RESOLVED", label: "Resolved", color: "bg-green-600" },
            ].map(({ key, label, color }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition flex items-center gap-2 ${filter === key
                    ? `${color} text-white`
                    : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                  }`}
              >
                {label}
                <span className={`px-2 py-0.5 rounded-full text-xs ${filter === key
                    ? "bg-white/20"
                    : "bg-gray-200 dark:bg-gray-700"
                  }`}>
                  {counts[key]}
                </span>
              </button>
            ))}
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center items-center py-20">
              <Loader2 className="animate-spin text-green-600" size={40} />
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-20 text-red-500">
              {error}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && issues.length === 0 && (
            <div className="text-center py-20 text-gray-500 dark:text-gray-400">
              <p className="text-lg">You haven't reported any issues yet.</p>
              <p className="mt-2">Report your first issue to track it here!</p>
            </div>
          )}

          {/* Empty Filtered State */}
          {!loading && !error && issues.length > 0 && filteredIssues.length === 0 && (
            <div className="text-center py-20 text-gray-500 dark:text-gray-400">
              <p className="text-lg">No {filter.toLowerCase().replace("_", " ")} issues.</p>
            </div>
          )}

          {/* Issues List */}
          {!loading && !error && filteredIssues.map((issue) => {
            const StatusIcon = statusIcons[issue.status] || AlertCircle;

            return (
              <div
                key={issue._id}
                className="bg-white dark:bg-gray-800 rounded-2xl shadow border dark:border-gray-700 overflow-hidden mb-6"
              >
                <div className="flex flex-col md:flex-row">
                  {/* Issue Image */}
                  {issue.images && issue.images[0] && (
                    <img
                      src={issue.images[0]}
                      alt={issue.title}
                      className="w-full md:w-48 h-40 md:h-auto object-cover"
                    />
                  )}

                  <div className="flex-1 p-6">
                    {/* Badges */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {/* Status Badge */}
                      <span className={`px-3 py-1 text-xs rounded-full flex items-center gap-1 ${statusStyles[issue.status]}`}>
                        <StatusIcon size={14} />
                        {issue.status.replace("_", " ")}
                      </span>

                      {/* Severity Badge */}
                      {issue.aiSeverity?.label && (
                        <span className={`px-3 py-1 text-xs rounded-full ${severityStyles[issue.aiSeverity.label] || severityStyles.MEDIUM}`}>
                          <Flame size={14} className="inline mr-1" />
                          {issue.aiSeverity.label}
                        </span>
                      )}
                    </div>

                    {/* Title & Description */}
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      {issue.title}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 mt-1 text-sm line-clamp-2">
                      {issue.description}
                    </p>

                    {/* Location & Time */}
                    <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-gray-500 dark:text-gray-400">
                      {issue.address && (
                        <div className="flex items-center gap-1">
                          <MapPin size={14} />
                          {issue.address}
                        </div>
                      )}
                      <span>Reported {formatTimeAgo(issue.createdAt)}</span>
                    </div>

                    {/* AI Reason if available */}
                    {issue.aiSeverity?.reason && (
                      <p className="text-xs text-gray-400 mt-2 italic">
                        AI Analysis: {issue.aiSeverity.reason}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </main>
      </div>

      <Footer />
    </>
  );
}
