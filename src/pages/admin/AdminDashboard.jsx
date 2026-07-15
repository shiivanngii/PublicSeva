import { useState } from "react";
import { useEffect } from "react";
import AdminEditModal from "./AdminEditModal";
import ConfirmDeleteModal from "./ConfirmDeleteModal";
import {
  fetchAdminIssues,
  updateIssueStatus,
  deleteIssue,
  updateIssue,
} from "../../services/adminService";

import LeftSidebar from "../../components/map/sidebar/LeftSidebar";
import CitizenNavbar from "../../components/CitizenNavbar";

// Map container to be used
import MapContainer from "../../components/map/MapContainer";

// Prevention of incorrect status changes
const UI_TO_API_STATUS = {
  untouched: "UNSOLVED",
  in_progress: "IN_PROGRESS",
  resolved: "RESOLVED",
};

const API_TO_UI_STATUS = {
  UNSOLVED: "untouched",
  IN_PROGRESS: "in_progress",
  RESOLVED: "resolved",
};


export default function AdminDashboard() {
  // Left Sidebar state const
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Post card state const
  const [selectedPostId, setSelectedPostId] = useState(null);

  // Filtering const
  const [filters, setFilters] = useState({
    reportId: "",
    status: "",
    severity: "",
    location: "",
  });

  // admin local map state
  const [statusFilter, setStatusFilter] = useState({
    untouched: true,
    in_progress: true,
    resolved: true,
  });


  // const to keep track of valid transitions
  const isValidStatusTransition = (from, to) => {
    if (from === "RESOLVED" && to !== "RESOLVED") return false;
    return true;
  };


  // User location parsing const
  const [myLocationActive, setMyLocationActive] = useState(false);

  // delete guard const
  const [deleteTarget, setDeleteTarget] = useState(null);

  // edit issue const
  const [editingIssue, setEditingIssue] = useState(null);

  // for loading bar
  const [loading, setLoading] = useState(true);

  // issues state (MUST exist before useEffect)
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    const loadIssues = async () => {
      try {
        setLoading(true);
        const res = await fetchAdminIssues();
        setIssues(Array.isArray(res.data) ? res.data : res.data.issues || []);
      } catch (err) {
        console.error("Failed to load issues", err);
      } finally {
        setLoading(false);
      }
    };

    loadIssues();
  }, []);

  // UI-only status update
  const handleStatusChange = async (id, uiStatus) => {
    const apiStatus = UI_TO_API_STATUS[uiStatus];

    // 🚨 Guard 1: invalid mapping
    if (!apiStatus) {
      console.warn("Invalid status selected:", uiStatus);
      return;
    }

    const issue = issues.find((i) => i._id === id);

    // 🚨 Guard 2: issue not found
    if (!issue) {
      console.warn("Issue not found for status update:", id);
      return;
    }

    // guard for invalid status change
    if (!isValidStatusTransition(issue.status, apiStatus)) {
      alert("Resolved issues cannot be moved back.");
      return;
    }


    // 🚨 Guard 3: no-op (same status)
    if (issue.status === apiStatus) {
      console.info("Status unchanged, skipping API call");
      return;
    }

    try {
      await updateIssueStatus(id, apiStatus);

      // Optimistic UI update
      setIssues((prev) =>
        prev.map((i) =>
          i._id === id ? { ...i, status: apiStatus } : i
        )
      );
    } catch (err) {
      console.error("Status update failed", err);

      // Optional: toast / alert later
      alert("Failed to update issue status. Please try again.");
    }
  };


  // UI-only edit save
  const handleEditSave = async (id, data) => {
    try {
      const res = await updateIssue(id, data);

      setIssues((prev) =>
        prev.map((issue) =>
          issue._id === id ? res.data : issue
        )
      );

      setEditingIssue(null);
    } catch (err) {
      console.error("Edit failed", err);
      alert("Failed to save changes");
    }
  };

  // Step 1: only OPEN confirmation modal
  const handleDelete = (id) => {
    setDeleteTarget(id);
  };

  // Step 2: actual delete AFTER confirmation
  const handleDeleteConfirm = async () => {
    try {
      await deleteIssue(deleteTarget);
      setIssues((prev) =>
        prev.filter((i) => i._id !== deleteTarget)
      );
    } catch (err) {
      console.error("Delete failed", err);
    } finally {
      setDeleteTarget(null);
    }
  };

  // derived array to be used with the new Issue Schema
  const sidebarPosts = issues.map((issue) => ({
    // REQUIRED BY PostCard
    report_id: issue._id,

    // main title for issue card (fetch from db)
    title: issue.title,

    description: issue.description,

    images:
      issue.images && issue.images.length > 0
        ? issue.images
        : ["https://placehold.co/400x300?text=No+Image"],

    location: issue.address || "Unknown location",

    // 🔑 STATUS MAPPING (VERY IMPORTANT)
    status:
      issue.status === "UNSOLVED"
        ? "untouched"
        : issue.status === "IN_PROGRESS"
          ? "in_progress"
          : "resolved",

    // 🔥 SEVERITY (already computed backend-side)
    severity: issue.severityScore ?? 0,

    // COUNTS
    votes: issue.votes?.length ?? 0,
    reports: issue.comments?.length ?? 0,

    // METADATA
    createdAt: issue.createdAt,

    // MAP (used later)
    latitude: issue.location?.coordinates?.[1],
    longitude: issue.location?.coordinates?.[0],
  }));


  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-800">
      <CitizenNavbar
        mode="admin"
        adminLinks={[
          { label: "Dashboard", path: "/admin/dashboard" },
          { label: "Issues", path: "/admin/dashboard" },
          { label: "Map View", path: "/admin/map" }, // future
        ]}
      />
      {/* <div className="flex min-h-screen bg-gray-50 dark:bg-gray-800">
      <AdminSidebar /> */}


      {/* MAIN AREA */}
      <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
        {/* LEFT: Map-style Sidebar */}
        <LeftSidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          posts={sidebarPosts}
          filters={filters}
          onFilterChange={setFilters}
          selectedPostId={selectedPostId}
          onPostClick={(post) => {
            setSelectedPostId(post.report_id);
          }}
          myLocationActive={myLocationActive}
          onMyLocationToggle={setMyLocationActive}
          onLocationFound={(coords) => {
            console.log("Admin location:", coords);
          }}
          onEditPost={(post) => {
            const originalIssue = issues.find((i) => i._id === post.report_id);
            setEditingIssue(originalIssue);
          }}
          onDeletePost={(id) => handleDelete(id)}
          onStatusChange={(id, status) => handleStatusChange(id, status)}
        />

        {/* RIGHT: placeholder for map */}
        <div className="flex-1 relative">
          <MapContainer
            data={sidebarPosts}          // 🔑 DB DATA
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            darkMode={document.documentElement.classList.contains("dark")}
            highlightedPostId={selectedPostId}
            onMarkerClick={(post) => {
              setSelectedPostId(post.report_id);
            }}
          />
        </div>
      </div>

      <main className="flex-1 p-8 space-y-6">
        {/* <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
          Issue Moderation
        </h1> */}

        {/* loading guard */}
        {loading && (
          <p className="text-gray-500">Loading issues...</p>
        )}

        {/* existing code preserved, just guarded */}
        {/* {!loading &&
          issues.map((issue) => (
            <AdminIssueCard
              key={issue._id}
              issue={issue}
              onStatusChange={handleStatusChange}
              onEdit={setEditingIssue}
              onDelete={handleDelete}
            />
          ))} */}
      </main>

      {editingIssue && (
        <AdminEditModal
          issue={editingIssue}
          onClose={() => setEditingIssue(null)}
          onSave={handleEditSave}
        />
      )}

      {deleteTarget && (
        <ConfirmDeleteModal
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
    // </div>
  );
}
