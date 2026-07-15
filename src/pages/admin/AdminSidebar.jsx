import { ClipboardList, ShieldAlert, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { logout } from "../../utils/auth";

export default function AdminSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <aside className="w-72 bg-white dark:bg-gray-900 border-r p-5 space-y-6">
      <h2 className="text-xl font-bold text-green-700 dark:text-green-400">
        Admin Panel
      </h2>

      <nav className="space-y-3 text-gray-700 dark:text-gray-300">
        <button
          onClick={() => navigate("/admin/dashboard")}
          className="flex items-center gap-3 w-full p-2 rounded hover:bg-green-100 dark:hover:bg-gray-800"
        >
          <ClipboardList size={18} />
          All Issues
        </button>

        <button
          onClick={() => navigate("/admin/reports")}
          className="flex items-center gap-3 w-full p-2 rounded hover:bg-green-100 dark:hover:bg-gray-800"
        >
          <ShieldAlert size={18} />
          Flagged Issues
        </button>
      </nav>

      <button
        onClick={handleLogout}
        className="flex items-center gap-2 text-red-600 hover:underline"
      >
        <LogOut size={16} />
        Logout
      </button>
    </aside>
  );
}
