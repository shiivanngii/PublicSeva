import { useNavigate } from "react-router-dom";
import { MapPin, PlusCircle, Search, Bell } from "lucide-react";

export default function CitizenLeftPanel() {
  const navigate = useNavigate();

  return (
    <aside className="w-72 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 p-5 space-y-6">

      {/* Search */}
      <div>
        <div className="flex items-center gap-2 mb-2 text-gray-600 dark:text-gray-300 font-medium">
          <Search size={16} />
          Search
        </div>
        <input
          type="text"
          placeholder="Area, road, landmark"
          className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-800 dark:border-gray-600"
        />
      </div>

      {/* Nearby Issues */}
      <div className="bg-green-50 dark:bg-gray-800 p-4 rounded-lg">
        <div className="flex items-center gap-2 text-green-700 dark:text-green-400 font-semibold mb-1">
          <MapPin size={16} />
          Issues near you
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          8 reported issues within 2 km
        </p>

        <button
          onClick={() => navigate("/citizen/map")}
          className="mt-2 text-sm text-green-700 dark:text-green-400 hover:underline"
        >
          View on map →
        </button>
      </div>

      {/* My Contributions */}
      <div>
        <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1">
          My Contributions
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          You have reported <span className="font-semibold">3</span> issues
        </p>
      </div>

      {/* Recent Updates */}
      <div>
        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-semibold mb-2">
          <Bell size={16} />
          Recent Updates
        </div>

        <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
          <li>🟢 Garbage cleared near Bus Stop</li>
          <li>🟡 Work started at Market Road</li>
        </ul>
      </div>
    </aside>
  );
}
