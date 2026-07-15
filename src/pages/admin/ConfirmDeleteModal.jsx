export default function ConfirmDeleteModal({ onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg w-full max-w-sm">
        <h2 className="text-lg font-bold mb-2 text-gray-800 dark:text-white">
          Delete Issue?
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          This action cannot be undone. Are you sure?
        </p>

        <div className="flex justify-end gap-3 mt-5">
          <button
            onClick={onCancel}
            className="px-3 py-1 rounded border"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-3 py-1 rounded bg-red-600 text-white"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
