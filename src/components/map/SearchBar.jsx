import React, { useState } from "react";
import { Search, X } from "lucide-react";

export default function SearchBar({ onSearch }) {
    const [query, setQuery] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const API_KEY = process.env.REACT_APP_MAPTILER_API_KEY;

    const handleInputChange = async (e) => {
        const value = e.target.value;
        setQuery(value);

        if (value.length < 3) {
            setSuggestions([]);
            return;
        }

        setIsLoading(true);
        try {
            const response = await fetch(
                `https://api.maptiler.com/geocoding/${encodeURIComponent(value)}.json?key=${API_KEY}&country=IN&proximity=72.8777,19.0760`
            );
            const data = await response.json();
            setSuggestions(data.features || []);
        } catch (error) {
            console.error("Geocoding error:", error);
            setSuggestions([]);
        }
        setIsLoading(false);
    };

    const handleSelect = (feature) => {
        const [lng, lat] = feature.center;
        setQuery(feature.place_name);
        setSuggestions([]);
        onSearch({ lat, lng, name: feature.place_name });
    };

    const handleClear = () => {
        setQuery("");
        setSuggestions([]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (suggestions.length > 0) {
            handleSelect(suggestions[0]);
        }
    };

    return (
        <div className="relative w-full max-w-md">
            <form onSubmit={handleSubmit} className="relative">
                <div className="relative flex items-center">
                    <Search className="absolute left-3 w-5 h-5 text-gray-400" />
                    <input
                        type="text"
                        value={query}
                        onChange={handleInputChange}
                        placeholder="Search a location..."
                        className="w-full pl-10 pr-10 py-2.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 text-gray-800 dark:text-gray-200 placeholder-gray-400"
                    />
                    {query && (
                        <button
                            type="button"
                            onClick={handleClear}
                            className="absolute right-3 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition"
                        >
                            <X className="w-4 h-4 text-gray-400" />
                        </button>
                    )}
                </div>
            </form>

            {/* Suggestions Dropdown */}
            {suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg overflow-hidden z-50">
                    {suggestions.map((feature) => (
                        <button
                            key={feature.id}
                            onClick={() => handleSelect(feature)}
                            className="w-full px-4 py-3 text-left hover:bg-green-50 dark:hover:bg-gray-700 border-b border-gray-100 dark:border-gray-700 last:border-b-0 transition"
                        >
                            <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                {feature.text}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                {feature.place_name}
                            </div>
                        </button>
                    ))}
                </div>
            )}

            {/* Loading indicator */}
            {isLoading && (
                <div className="absolute top-full left-0 right-0 mt-1 p-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg">
                    <div className="text-sm text-gray-500 dark:text-gray-400">Searching...</div>
                </div>
            )}
        </div>
    );
}