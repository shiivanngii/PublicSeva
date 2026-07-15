import { useState, useEffect } from "react";
import CitizenNavbar from "../../components/CitizenNavbar";
import CitizenLeftPanel from "../../components/CitizenLeftPanel";
import Footer from "../../components/Footer";
import { Mail, Phone, MapPin, Calendar, Edit2, Save, X, Loader2, Building } from "lucide-react";
import { getMyProfile, updateMyProfile } from "../../services/userApi";
import { getMyIssues } from "../../services/issueApi";

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export default function Profile() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({ total: 0, resolved: 0 });
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  // Edit form state
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    state: "",
    district: ""
  });

  useEffect(() => {
    fetchProfile();
    fetchStats();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await getMyProfile();
      setUser(data.user);
      setFormData({
        name: data.user.name || "",
        phone: data.user.phone || "",
        address: data.user.address || "",
        state: data.user.state || "",
        district: data.user.district || ""
      });
    } catch (err) {
      console.error("Failed to fetch profile:", err);
      setError("Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await getMyIssues();
      const issues = data.issues || [];
      setStats({
        total: issues.length,
        resolved: issues.filter(i => i.status === "RESOLVED").length
      });
    } catch (err) {
      console.error("Failed to fetch stats:", err);
    }
  };

  const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const data = await updateMyProfile(formData);
      setUser(data.user);
      setEditing(false);
    } catch (err) {
      console.error("Failed to update profile:", err);
      alert("Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user.name || "",
      phone: user.phone || "",
      address: user.address || "",
      state: user.state || "",
      district: user.district || ""
    });
    setEditing(false);
  };

  if (loading) {
    return (
      <>
        <CitizenNavbar />
        <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 justify-center items-center">
          <Loader2 className="animate-spin text-green-600" size={40} />
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <CitizenNavbar />
        <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900 justify-center items-center">
          <p className="text-red-500">{error}</p>
        </div>
      </>
    );
  }

  return (
    <>
      <CitizenNavbar />

      <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
        <CitizenLeftPanel />

        <main className="flex-1 p-8 max-w-4xl mx-auto">
          {/* Header Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6 mb-8">
            <div className="flex justify-between items-start">
              <div>
                {editing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="text-2xl font-bold bg-transparent border-b-2 border-green-500 focus:outline-none dark:text-white"
                  />
                ) : (
                  <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">{user.name}</h1>
                )}
                <p className="text-gray-600 dark:text-gray-300 capitalize">{user.role}</p>
              </div>

              {!editing ? (
                <button
                  onClick={() => setEditing(true)}
                  className="flex items-center gap-2 px-4 py-2 text-green-600 hover:bg-green-50 dark:hover:bg-gray-700 rounded-lg transition"
                >
                  <Edit2 size={18} />
                  Edit Profile
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={handleCancel}
                    className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                  >
                    <X size={18} />
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-lg transition disabled:opacity-50"
                  >
                    {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
                    Save
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <Stat label="Total Reports" value={stats.total} />
            <Stat label="Resolved" value={stats.resolved} />
          </div>

          {/* Details Card */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow p-6">
            <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-gray-100">
              Contact Information
            </h2>

            <div className="space-y-4">
              <Detail
                icon={<Mail />}
                label="Email"
                value={user.email}
                editable={false}
              />

              <Detail
                icon={<Phone />}
                label="Phone"
                value={formData.phone}
                editing={editing}
                name="phone"
                onChange={handleInputChange}
              />

              <Detail
                icon={<MapPin />}
                label="Address"
                value={formData.address}
                editing={editing}
                name="address"
                onChange={handleInputChange}
              />

              <Detail
                icon={<Building />}
                label="District"
                value={formData.district}
                editing={editing}
                name="district"
                onChange={handleInputChange}
              />

              <Detail
                icon={<MapPin />}
                label="State"
                value={formData.state}
                editing={editing}
                name="state"
                onChange={handleInputChange}
              />

              <Detail
                icon={<Calendar />}
                label="Joined"
                value={formatDate(user.createdAt)}
                editable={false}
              />
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </>
  );
}

function Stat({ label, value }) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 text-center">
      <h2 className="text-3xl font-bold text-green-500">{value}</h2>
      <p className="text-gray-600 dark:text-gray-300">{label}</p>
    </div>
  );
}

function Detail({ icon, label, value, editing, name, onChange, editable = true }) {
  return (
    <div className="flex gap-4 py-2">
      <div className="text-green-500">{icon}</div>
      <div className="flex-1">
        <p className="text-sm text-gray-500 dark:text-gray-400">{label}</p>
        {editing && editable ? (
          <input
            type="text"
            name={name}
            value={value || ""}
            onChange={onChange}
            className="w-full mt-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-500 focus:outline-none"
            placeholder={`Enter ${label.toLowerCase()}`}
          />
        ) : (
          <p className="font-medium text-gray-900 dark:text-gray-100">{value || "-"}</p>
        )}
      </div>
    </div>
  );
}
