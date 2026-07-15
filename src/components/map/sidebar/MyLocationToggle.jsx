import React, { useState } from "react";
import { MapPin, Loader2 } from "lucide-react";

export default function MyLocationToggle({ isActive, onToggle, onLocationFound }) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleToggle = () => {
        if (isActive) {
            onToggle(false);
            setError(null);
            return;
        }

        if (!navigator.geolocation) {
            setError("Not supported");
            return;
        }

        setIsLoading(true);
        setError(null);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setIsLoading(false);
                setError(null);
                onToggle(true);
                onLocationFound({
                    lat: position.coords.latitude,
                    lng: position.coords.longitude,
                });
            },
            (err) => {
                setIsLoading(false);
                setError(err.code === 1 ? "Denied" : "Error");
                onToggle(false);
            },
            { enableHighAccuracy: false, timeout: 15000, maximumAge: 60000 }
        );
    };

    return (
        <div className="flex items-center gap-2">
            <MapPin size={16} className={isActive ? "text-green-600" : "text-gray-400"} />
            <span className="text-sm text-gray-700 dark:text-gray-300">My Location</span>

            {/* Toggle Switch */}
            <button
                onClick={handleToggle}
                disabled={isLoading}
                className={`
                    relative w-12 h-6 rounded-full transition-colors duration-200
                    ${isActive ? "bg-green-600" : "bg-gray-300 dark:bg-gray-600"}
                    ${isLoading ? "opacity-50" : ""}
                `}
            >
                <span
                    className={`
                        absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow
                        transition-transform duration-200 flex items-center justify-center
                        ${isActive ? "translate-x-6" : "translate-x-0"}
                    `}
                >
                    {isLoading && <Loader2 size={12} className="text-green-600 animate-spin" />}
                </span>
            </button>

            {error && <span className="text-xs text-red-500">{error}</span>}
        </div>
    );
}