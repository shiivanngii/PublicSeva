import { useState, useEffect } from "react";
import CitizenNavbar from "../../components/CitizenNavbar";
import CitizenLeftPanel from "../../components/CitizenLeftPanel";
import Footer from "../../components/Footer";
import ReportButton from "../../components/ReportButton";
import { ThumbsUp, MessageCircle, MapPin, Flame, Loader2, Send, X } from "lucide-react";
import { getAllIssues, toggleLike, addComment } from "../../services/issueApi";
import { jwtDecode } from "jwt-decode";

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

function getCurrentUserId() {
  const token = localStorage.getItem("token");
  if (!token) return null;
  try {
    return jwtDecode(token).id;
  } catch {
    return null;
  }
}

export default function Home() {
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedComments, setExpandedComments] = useState({});
  const [commentText, setCommentText] = useState({});
  const [submittingComment, setSubmittingComment] = useState({});

  const currentUserId = getCurrentUserId();

  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = async () => {
    try {
      const data = await getAllIssues();
      setIssues(data.issues || []);
    } catch (err) {
      console.error("Failed to fetch issues:", err);
      setError("Failed to load issues");
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (issueId) => {
    try {
      const result = await toggleLike(issueId);
      // Update the issue in state
      setIssues(prev => prev.map(issue => {
        if (issue._id === issueId) {
          const votes = issue.votes || [];
          if (result.liked) {
            return { ...issue, votes: [...votes, currentUserId] };
          } else {
            return { ...issue, votes: votes.filter(id => id !== currentUserId) };
          }
        }
        return issue;
      }));
    } catch (err) {
      console.error("Failed to toggle like:", err);
      alert("Please login to vote");
    }
  };

  const toggleCommentSection = (issueId) => {
    setExpandedComments(prev => ({
      ...prev,
      [issueId]: !prev[issueId]
    }));
  };

  const handleAddComment = async (issueId) => {
    const text = commentText[issueId]?.trim();
    if (!text) return;

    setSubmittingComment(prev => ({ ...prev, [issueId]: true }));

    try {
      const result = await addComment(issueId, text);
      // Update the issue with new comment
      setIssues(prev => prev.map(issue => {
        if (issue._id === issueId) {
          return {
            ...issue,
            comments: [...(issue.comments || []), result.comment]
          };
        }
        return issue;
      }));
      setCommentText(prev => ({ ...prev, [issueId]: "" }));
    } catch (err) {
      console.error("Failed to add comment:", err);
      alert("Please login to comment");
    } finally {
      setSubmittingComment(prev => ({ ...prev, [issueId]: false }));
    }
  };

  const isLiked = (issue) => {
    return issue.votes?.includes(currentUserId);
  };

  return (
    <>
      <CitizenNavbar />

      <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
        <CitizenLeftPanel />

        <main className="flex-1 px-6 py-8 max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Community Issues
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Problems reported by citizens near you
          </p>

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
              <p className="text-lg">No issues reported yet.</p>
              <p className="mt-2">Be the first to report an issue!</p>
            </div>
          )}

          {/* Issues List */}
          {!loading && !error && issues.map((issue) => (
            <div
              key={issue._id}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow border dark:border-gray-700 overflow-hidden mb-8"
            >
              {/* Issue Image */}
              {issue.images && issue.images[0] && (
                <img
                  src={issue.images[0]}
                  alt={issue.title}
                  className="w-full h-64 object-cover"
                />
              )}

              <div className="p-6">
                {/* Badges */}
                <div className="flex flex-wrap gap-2">
                  {issue.aiSeverity?.label && (
                    <span className={`px-3 py-1 text-xs rounded-full ${severityStyles[issue.aiSeverity.label] || severityStyles.MEDIUM}`}>
                      <Flame size={14} className="inline mr-1" />
                      {issue.aiSeverity.label}
                    </span>
                  )}
                  <span className={`px-3 py-1 text-xs rounded-full ${statusStyles[issue.status]}`}>
                    {issue.status.replace("_", " ")}
                  </span>
                </div>

                {/* Title & Description */}
                <h2 className="text-xl font-semibold mt-4 text-gray-900 dark:text-gray-100">
                  {issue.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mt-2">
                  {issue.description}
                </p>

                {/* Location */}
                {issue.address && (
                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mt-3">
                    <MapPin size={16} />
                    {issue.address}
                  </div>
                )}

                {/* Author */}
                {issue.createdBy && (
                  <p className="text-xs text-gray-400 mt-2">
                    Reported by {issue.createdBy.name || "Anonymous"}
                  </p>
                )}

                {/* Footer with Vote & Comment buttons */}
                <div className="flex justify-between mt-4 border-t dark:border-gray-700 pt-4">
                  <div className="flex gap-6">
                    <button
                      onClick={() => handleLike(issue._id)}
                      className={`flex items-center gap-2 transition ${isLiked(issue)
                          ? "text-green-500"
                          : "text-gray-600 dark:text-gray-300 hover:text-green-500"
                        }`}
                    >
                      <ThumbsUp size={18} fill={isLiked(issue) ? "currentColor" : "none"} />
                      {issue.votes?.length || 0}
                    </button>
                    <button
                      onClick={() => toggleCommentSection(issue._id)}
                      className={`flex items-center gap-2 transition ${expandedComments[issue._id]
                          ? "text-blue-500"
                          : "text-gray-600 dark:text-gray-300 hover:text-blue-500"
                        }`}
                    >
                      <MessageCircle size={18} fill={expandedComments[issue._id] ? "currentColor" : "none"} />
                      {issue.comments?.length || 0}
                    </button>
                  </div>
                  <span className="text-xs text-gray-400">
                    {formatTimeAgo(issue.createdAt)}
                  </span>
                </div>

                {/* Comments Section */}
                {expandedComments[issue._id] && (
                  <div className="mt-4 border-t dark:border-gray-700 pt-4">
                    {/* Existing Comments */}
                    <div className="space-y-3 max-h-60 overflow-y-auto">
                      {issue.comments?.length === 0 && (
                        <p className="text-gray-400 text-sm">No comments yet. Be the first!</p>
                      )}
                      {issue.comments?.map((comment, idx) => (
                        <div key={idx} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3">
                          <div className="flex justify-between items-start">
                            <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                              {comment.user?.name || "Anonymous"}
                            </span>
                            <span className="text-xs text-gray-400">
                              {formatTimeAgo(comment.createdAt)}
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                            {comment.text}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Add Comment Input */}
                    <div className="flex gap-2 mt-4">
                      <input
                        type="text"
                        value={commentText[issue._id] || ""}
                        onChange={(e) => setCommentText(prev => ({ ...prev, [issue._id]: e.target.value }))}
                        onKeyDown={(e) => e.key === "Enter" && handleAddComment(issue._id)}
                        placeholder="Write a comment..."
                        className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-500 focus:outline-none text-sm"
                      />
                      <button
                        onClick={() => handleAddComment(issue._id)}
                        disabled={submittingComment[issue._id] || !commentText[issue._id]?.trim()}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {submittingComment[issue._id] ? (
                          <Loader2 size={18} className="animate-spin" />
                        ) : (
                          <Send size={18} />
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </main>
      </div>

      <ReportButton />
      <Footer />
    </>
  );
}
