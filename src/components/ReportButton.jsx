import { Plus } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function ReportButton() {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate("/citizen/report")}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-full shadow-lg transition"
      aria-label="Report Issue"
    >
      <Plus size={22} />
      <span className="font-medium">Report Issue</span>
    </button>
  );
}
