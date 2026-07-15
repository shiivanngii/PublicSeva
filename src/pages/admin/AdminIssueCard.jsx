import { Pencil, Trash2 } from "lucide-react";

const STATUS_COLORS = {
  UNSOLVED: "bg-red-100 text-red-700",
  IN_PROGRESS: "bg-yellow-100 text-yellow-700",
  RESOLVED: "bg-green-100 text-green-700",
};

export default function AdminIssueCard({
  issue,
  onStatusChange,
  onEdit,
  onDelete,
}) {
  return (
    <div className="bg-white dark:bg-gray-900 p-5 rounded-lg shadow border">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold">{issue.title}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {issue.description}
          </p>
        </div>

        <span
          className={`px-3 py-1 rounded text-xs font-semibold ${STATUS_COLORS[issue.status]}`}
        >
          {issue.status}
        </span>
      </div>

      <div className="mt-4 flex justify-between items-center">
        <select
          value={issue.status}
          onChange={(e) =>
            onStatusChange(issue._id, e.target.value)
          }
          className="border px-2 py-1 rounded text-sm dark:bg-gray-800"
        >
          <option value="UNSOLVED">UNSOLVED</option>
          <option value="IN_PROGRESS">IN_PROGRESS</option>
          <option value="RESOLVED">RESOLVED</option>
        </select>

        <div className="flex gap-4">
          <button
            onClick={() => onEdit(issue)}
            className="flex items-center gap-1 text-blue-600 hover:underline"
          >
            <Pencil size={16} />
            Edit
          </button>

          <button
            onClick={() => onDelete(issue._id)}
            className="flex items-center gap-1 text-red-600 hover:underline"
          >
            <Trash2 size={16} />
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
