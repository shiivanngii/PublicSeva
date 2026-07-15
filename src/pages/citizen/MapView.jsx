import { useState, useEffect, useRef, useCallback } from "react";
import maplibregl from "maplibre-gl";
import CitizenNavbar from "../../components/CitizenNavbar";
import IssueMapSidebar from "../../components/IssueMapSidebar";
import { getAllIssues } from "../../services/issueApi";
import { Loader2, Locate } from "lucide-react";

// Color functions based on status and severity
function getMarkerColor(issue) {
    const status = issue.status;
    const severityScore = issue.severityScore || 0;

    if (status === "RESOLVED") {
        return "rgba(34, 197, 94, 0.5)"; // Green
    }

    if (status === "IN_PROGRESS") {
        return "rgba(234, 179, 8, 0.5)"; // Yellow
    }

    // UNSOLVED - shade of red based on severity
    if (severityScore <= 25) {
        return "rgba(254, 202, 202, 0.6)"; // Light red
    } else if (severityScore <= 50) {
        return "rgba(252, 165, 165, 0.6)"; // Medium-light red
    } else if (severityScore <= 75) {
        return "rgba(248, 113, 113, 0.6)"; // Medium-dark red
    } else {
        return "rgba(185, 28, 28, 0.6)"; // Dark red (critical)
    }
}

function getMarkerBorderColor(issue) {
    const status = issue.status;
    const severityScore = issue.severityScore || 0;

    if (status === "RESOLVED") {
        return "rgba(22, 163, 74, 1)"; // Green border
    }

    if (status === "IN_PROGRESS") {
        return "rgba(202, 138, 4, 1)"; // Yellow border
    }

    // UNSOLVED - darker red border based on severity
    if (severityScore <= 25) {
        return "rgba(252, 165, 165, 1)";
    } else if (severityScore <= 50) {
        return "rgba(248, 113, 113, 1)";
    } else if (severityScore <= 75) {
        return "rgba(220, 38, 38, 1)";
    } else {
        return "rgba(127, 29, 29, 1)";
    }
}

export default function MapView() {
    const mapContainer = useRef(null);
    const map = useRef(null);
    const [issues, setIssues] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedIssue, setSelectedIssue] = useState(null);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [userLocation, setUserLocation] = useState(null);

    // Fetch all issues
    useEffect(() => {
        const fetchIssues = async () => {
            try {
                const data = await getAllIssues();
                setIssues(data.issues || []);
            } catch (err) {
                console.error("Failed to fetch issues:", err);
            } finally {
                setLoading(false);
            }
        };
        fetchIssues();
    }, []);

    // Get user location
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    setUserLocation({
                        lng: position.coords.longitude,
                        lat: position.coords.latitude,
                    });
                },
                (error) => {
                    console.warn("Geolocation error:", error);
                    // Default to Mumbai, India
                    setUserLocation({ lng: 72.8777, lat: 19.076 });
                }
            );
        } else {
            setUserLocation({ lng: 72.8777, lat: 19.076 });
        }
    }, []);

    // Add issue markers to map
    const addIssueMarkers = useCallback(() => {
        if (!map.current || issues.length === 0) return;

        // Remove existing layers/sources if they exist
        if (map.current.getLayer("issues-circles")) {
            map.current.removeLayer("issues-circles");
        }
        if (map.current.getLayer("issues-borders")) {
            map.current.removeLayer("issues-borders");
        }
        if (map.current.getSource("issues")) {
            map.current.removeSource("issues");
        }

        // Create GeoJSON data
        const geojsonData = {
            type: "FeatureCollection",
            features: issues
                .filter((issue) => issue.location?.coordinates)
                .map((issue) => ({
                    type: "Feature",
                    properties: {
                        id: issue._id,
                        fillColor: getMarkerColor(issue),
                        borderColor: getMarkerBorderColor(issue),
                        status: issue.status,
                        severityScore: issue.severityScore || 0,
                    },
                    geometry: {
                        type: "Point",
                        coordinates: issue.location.coordinates,
                    },
                })),
        };

        // Add source
        map.current.addSource("issues", {
            type: "geojson",
            data: geojsonData,
        });

        // Add circle layer (filled circles)
        map.current.addLayer({
            id: "issues-circles",
            type: "circle",
            source: "issues",
            paint: {
                "circle-radius": [
                    "interpolate",
                    ["linear"],
                    ["zoom"],
                    10, 20,
                    15, 40,
                    18, 60
                ],
                "circle-color": ["get", "fillColor"],
                "circle-opacity": 0.7,
                "circle-stroke-width": 3,
                "circle-stroke-color": ["get", "borderColor"],
                "circle-blur": 0.3,
            },
        });

        // Add click handler
        map.current.on("click", "issues-circles", (e) => {
            const clickedId = e.features[0].properties.id;
            const clickedIssue = issues.find((i) => i._id === clickedId);
            if (clickedIssue) {
                setSelectedIssue(clickedIssue);
                setSidebarOpen(true);
            }
        });

        // Change cursor on hover
        map.current.on("mouseenter", "issues-circles", () => {
            map.current.getCanvas().style.cursor = "pointer";
        });

        map.current.on("mouseleave", "issues-circles", () => {
            map.current.getCanvas().style.cursor = "";
        });
    }, [issues]);

    // Initialize map
    useEffect(() => {
        if (!userLocation || map.current) return;

        map.current = new maplibregl.Map({
            container: mapContainer.current,
            style: "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json",
            center: [userLocation.lng, userLocation.lat],
            zoom: 13,
            pitch: 45,
            bearing: -17.6,
            antialias: true,
        });

        // Add navigation controls
        map.current.addControl(new maplibregl.NavigationControl(), "top-left");

        // Add user location marker
        new maplibregl.Marker({ color: "#3b82f6" })
            .setLngLat([userLocation.lng, userLocation.lat])
            .setPopup(new maplibregl.Popup().setHTML("<p>Your Location</p>"))
            .addTo(map.current);

        map.current.on("load", () => {
            addIssueMarkers();
        });

        return () => {
            if (map.current) {
                map.current.remove();
                map.current = null;
            }
        };
    }, [userLocation, addIssueMarkers]);

    // Update markers when issues change
    useEffect(() => {
        if (map.current && map.current.loaded()) {
            addIssueMarkers();
        }
    }, [issues, addIssueMarkers]);

    const handleCloseSidebar = () => {
        setSidebarOpen(false);
        setTimeout(() => setSelectedIssue(null), 300);
    };

    const centerOnUser = () => {
        if (map.current && userLocation) {
            map.current.flyTo({
                center: [userLocation.lng, userLocation.lat],
                zoom: 14,
                pitch: 45,
            });
        }
    };

    return (
        <div className="h-screen flex flex-col bg-gray-900">
            <CitizenNavbar />

            <div className="flex-1 relative">
                {/* Loading Overlay */}
                {loading && (
                    <div className="absolute inset-0 bg-gray-900/80 flex items-center justify-center z-40">
                        <div className="text-center">
                            <Loader2 className="animate-spin text-green-500 mx-auto" size={48} />
                            <p className="text-gray-300 mt-4">Loading map...</p>
                        </div>
                    </div>
                )}

                {/* Map Container */}
                <div ref={mapContainer} className="map-container" />

                {/* Legend */}
                <div className="absolute bottom-6 left-6 bg-gray-800/90 backdrop-blur-sm rounded-xl p-4 border border-gray-700 z-30">
                    <h4 className="text-sm font-semibold text-gray-200 mb-3">Issue Status</h4>
                    <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                            <span className="w-4 h-4 rounded-full bg-green-500/60 border-2 border-green-600"></span>
                            <span className="text-gray-300">Resolved</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-4 h-4 rounded-full bg-yellow-500/60 border-2 border-yellow-600"></span>
                            <span className="text-gray-300">In Progress</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-4 h-4 rounded-full bg-red-300/60 border-2 border-red-400"></span>
                            <span className="text-gray-300">Unsolved (Low)</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="w-4 h-4 rounded-full bg-red-600/60 border-2 border-red-700"></span>
                            <span className="text-gray-300">Unsolved (High)</span>
                        </div>
                    </div>
                </div>

                {/* Center on User Button */}
                <button
                    onClick={centerOnUser}
                    className="absolute bottom-6 right-6 p-3 bg-gray-800/90 backdrop-blur-sm rounded-xl border border-gray-700 text-gray-300 hover:text-white hover:bg-gray-700 transition z-30"
                    title="Center on your location"
                >
                    <Locate size={24} />
                </button>

                {/* Sidebar */}
                <IssueMapSidebar
                    issue={selectedIssue}
                    isOpen={sidebarOpen}
                    onClose={handleCloseSidebar}
                />
            </div>
        </div>
    );
}
