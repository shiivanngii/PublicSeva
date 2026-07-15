import React from "react";
import { Plus, Minus } from "lucide-react";

export default function ZoomControls({ onZoomIn, onZoomOut }) {
    return (
        <div className="flex flex-col gap-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            <button
                onClick={onZoomIn}
                className="p-2 hover:bg-green-100 dark:hover:bg-gray-700 transition-colors group"
                aria-label="Zoom in"
            >
                <Plus className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-green-600 dark:group-hover:text-green-400" />
            </button>
            <div className="h-px bg-gray-200 dark:bg-gray-700" />
            <button
                onClick={onZoomOut}
                className="p-2 hover:bg-green-100 dark:hover:bg-gray-700 transition-colors group"
                aria-label="Zoom out"
            >
                <Minus className="w-5 h-5 text-gray-600 dark:text-gray-300 group-hover:text-green-600 dark:group-hover:text-green-400" />
            </button>
        </div>
    );
}