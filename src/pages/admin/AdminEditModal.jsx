import { useState } from "react";

export default function AdminEditModal({ issue, onClose, onSave }) {
  const [form, setForm] = useState({
    title: issue.title,
    description: issue.description,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg w-full max-w-lg">
        <h2 className="text-lg font-bold mb-4">Edit Issue</h2>

        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          className="w-full border p-2 mb-3 rounded"
        />

        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          rows={4}
        />

        <div className="flex justify-end gap-3 mt-4">
          <button onClick={onClose} className="text-gray-500">Cancel</button>
          <button
            onClick={() => onSave(issue._id, form)}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
