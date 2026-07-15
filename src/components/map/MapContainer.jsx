import React, { useRef, useEffect, useState, useCallback, useImperativeHandle, forwardRef } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import Supercluster from "supercluster";
import SearchBar from "./SearchBar";
import StatusFilter from "./StatusFilter";

// Status color mapping
const STATUS_COLORS = {
  untouched: "#8B0000",
  in_progress: "#FFD93D",
  resolved: "#6BCB77",
};

// Fixed marker size for consistent anchor positioning
const MARKER_SIZE = 70;

// Calculate distance between two coordinates in meters
const getDistanceInMeters = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // Earth's radius in meters
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const MapContainer = forwardRef(function MapContainer({ 
        data = [],
        statusFilter, 
        setStatusFilter, 
        darkMode, 
        onMarkerClick, 
        highlightedPostId 
    },
  ref
) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const markersRef = useRef({});
  const clusterRef = useRef(null);
  const updateTimeoutRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);

  const API_KEY = process.env.REACT_APP_MAPTILER_KEY;

  // Expose methods to parent via ref
  useImperativeHandle(ref, () => ({
    flyToPost: (postId) => {
      const post = data.find((p) => p.report_id === postId);
      if (post && map.current) {
        map.current.flyTo({
          center: [post.longitude, post.latitude],
          zoom: 15,
          duration: 1000,
        });
      }
    },
    flyToLocation: (lat, lng) => {
      if (map.current) {
        map.current.flyTo({
          center: [lng, lat],
          zoom: 14,
          duration: 1500,
        });
      }
    },
    getNearbyPosts: (clickedPost, radiusMeters = 500) => {
      return data.filter((post) => {
        if (post.report_id === clickedPost.report_id) return true;
        const distance = getDistanceInMeters(
          clickedPost.latitude,
          clickedPost.longitude,
          post.latitude,
          post.longitude
        );
        return distance <= radiusMeters;
      });
    },
  }));

  // Get map style based on dark mode
  const getMapStyle = useCallback(
    (isDark) => {
      return isDark
        ? `https://api.maptiler.com/maps/streets-v2-dark/style.json?key=${API_KEY}`
        : `https://api.maptiler.com/maps/streets-v2/style.json?key=${API_KEY}`;
    },
    [API_KEY]
  );


  // Initialize map - 3D view with accurate marker positioning
  useEffect(() => {
    if (map.current) return;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: getMapStyle(darkMode),
      center: [72.8777, 19.076], // Mumbai
      zoom: 12,
      pitch: 45, // 3D tilt for enhanced UI
      bearing: -17.6,
      antialias: true,
    });

    map.current.on("load", () => {
      setMapLoaded(true);
    });

    // Add navigation control
    map.current.addControl(
      new maplibregl.NavigationControl({ showCompass: true }),
      "bottom-right"
    );

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [API_KEY, getMapStyle, darkMode]);

  // Update map style when dark mode changes
  useEffect(() => {
    if (map.current && mapLoaded) {

      Object.values(markersRef.current).forEach((marker) => marker.remove());
      markersRef.current = {};

      map.current.setStyle(getMapStyle(darkMode));

      map.current.once("style.load", () => {
        setMapLoaded(false);
        setTimeout(() => setMapLoaded(true), 50);
      });
    }
  }, [darkMode]);

  // Create marker element
  const createMarkerElement = useCallback(
    (isCluster, data, count, statusColor, imageUrl, isHighlighted = false) => {
      const el = document.createElement("div");
      el.className = "marker-container";
      el.style.cssText = `
      position: relative;
      cursor: pointer;
      width: ${MARKER_SIZE}px;
      height: ${MARKER_SIZE + 16}px;
      display: flex;
      flex-direction: column;
      align-items: center;
      ${isHighlighted ? "transform: scale(1.2); z-index: 100;" : ""}
    `;

      el.innerHTML = `
      <div class="count-badge" style="
        position: absolute;
        top: -10px;
        right: -10px;
        min-width: 28px;
        height: 28px;
        padding: 0 6px;
        border-radius: 50%;
        background: ${statusColor};
        color: white;
        font-weight: 600;
        font-size: 13px;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        font-family: system-ui, -apple-system, sans-serif;
        border: 2px solid white;
      ">${count}</div>
      <div class="marker-image" style="
        width: ${MARKER_SIZE}px;
        height: ${MARKER_SIZE}px;
        border: 4px solid ${isHighlighted ? "#16a34a" : statusColor};
        border-radius: 16px;
        overflow: hidden;
        background: white;
        box-shadow: ${isHighlighted ? "0 0 0 4px rgba(22, 163, 74, 0.3)," : ""} 0 4px 12px rgba(0,0,0,0.3);
        transition: transform 0.2s ease-out;
      ">
        <img src="${imageUrl}" alt="marker" style="
          width: 100%;
          height: 100%;
          object-fit: cover;
        " onerror="this.style.display='none'" />
      </div>
      <div class="marker-tip" style="
        width: 0;
        height: 0;
        border-left: 10px solid transparent;
        border-right: 10px solid transparent;
        border-top: 14px solid ${isHighlighted ? "#16a34a" : statusColor};
        margin-top: -2px;
        filter: drop-shadow(0 2px 2px rgba(0,0,0,0.2));
      "></div>
    `;

      // Add hover effect
      el.addEventListener("mouseenter", () => {
        const img = el.querySelector(".marker-image");
        if (img) img.style.transform = "scale(1.1)";
      });
      el.addEventListener("mouseleave", () => {
        const img = el.querySelector(".marker-image");
        if (img) img.style.transform = "scale(1)";
      });

      return el;
    },
    []
  );

  // Create and update markers
  const updateMarkers = useCallback(() => {
    if (!map.current || !mapLoaded || !clusterRef.current) return;

    const newMarkers = {};

    // Get current bounds and zoom
    const bounds = map.current.getBounds();
    const zoom = Math.floor(map.current.getZoom());

    // Get clusters for current view
    const clusters = clusterRef.current.getClusters(
      [bounds.getWest(), bounds.getSouth(), bounds.getEast(), bounds.getNorth()],
      zoom
    );

    // Create markers for each cluster/point
    clusters.forEach((clusterData) => {
      const coordinates = clusterData.geometry.coordinates;
      const isCluster = clusterData.properties.cluster;

      // Create unique ID for this marker
      const id = isCluster
        ? `cluster_${clusterData.properties.cluster_id}`
        : `point_${clusterData.properties.report_id}`;

      // Check if marker already exists and hasn't changed highlight state
      const isHighlighted = !isCluster && clusterData.properties.report_id === highlightedPostId;
      const existingMarker = markersRef.current[id];

      if (existingMarker && existingMarker._isHighlighted === isHighlighted) {
        newMarkers[id] = existingMarker;
        delete markersRef.current[id];
        return;
      }

      // Remove existing marker if highlight state changed
      if (existingMarker) {
        existingMarker.remove();
      }

      let el, statusColor, count, imageUrl;

      if (isCluster) {
        // Get all points in this cluster to determine dominant status
        const clusterPoints = clusterRef.current.getLeaves(
          clusterData.properties.cluster_id,
          Infinity
        );
        const statusCounts = { untouched: 0, in_progress: 0, resolved: 0 };

        clusterPoints.forEach((point) => {
          statusCounts[point.properties.status]++;
        });

        // Find dominant status
        const dominantStatus = Object.keys(statusCounts).reduce((a, b) =>
          statusCounts[a] > statusCounts[b] ? a : b
        );

        statusColor = STATUS_COLORS[dominantStatus];
        count = clusterData.properties.point_count;
        // Use first image from images array
        imageUrl = clusterPoints[0]?.properties.images?.[0] || "";

        el = createMarkerElement(true, clusterData, count, statusColor, imageUrl);

        // Add click handler for cluster - zoom to expansion level
        el.addEventListener("click", (e) => {
          e.stopPropagation();
          const expansionZoom = clusterRef.current.getClusterExpansionZoom(
            clusterData.properties.cluster_id
          );
          map.current.easeTo({
            center: coordinates,
            zoom: Math.min(expansionZoom, 16),
            duration: 500,
          });
        });
      } else {
        // Single point marker
        const point = clusterData.properties;
        statusColor = STATUS_COLORS[point.status];
        count = 1;
        // Use first image from images array
        imageUrl = point.images?.[0] || "";

        el = createMarkerElement(false, clusterData, count, statusColor, imageUrl, isHighlighted);

        // Create popup for single points - shown on hover, positioned above marker
        const popup = new maplibregl.Popup({
          anchor: "bottom",
          offset: [0, -MARKER_SIZE - 6],
          closeButton: false,
          closeOnClick: false,
        }).setHTML(`
          <div class="marker-popup" style="font-family: system-ui, -apple-system, sans-serif;">
            <div style="padding: 8px 12px; background: ${statusColor}; color: white; font-weight: bold; border-radius: 4px 4px 0 0;">
              ${point.report_id}
            </div>
            <div style="padding: 12px;">
              <p style="margin: 0 0 8px 0; font-size: 14px; color: #333;">${point.description}</p>
              <p style="margin: 0 0 8px 0; font-size: 12px; color: #666;">📍 ${point.location}</p>
              <div style="display: flex; gap: 12px; font-size: 12px; color: #666;">
                <span>Vote Count: ${point.votes}</span>
                <span>Report Count: ${point.reports}</span>
              </div>
            </div>
          </div>
        `);

        // Create marker - viewport alignment keeps markers upright
        const marker = new maplibregl.Marker({
          element: el,
          anchor: "bottom",
          offset: [0, -6],
          pitchAlignment: "viewport",
          rotationAlignment: "viewport",
        })
          .setLngLat(coordinates)
          .setPopup(popup)
          .addTo(map.current);

        // Store highlight state on marker
        marker._isHighlighted = isHighlighted;

        let hideTimeout = null;

        const showPopup = () => {
          if (hideTimeout) {
            clearTimeout(hideTimeout);
            hideTimeout = null;
          }
          if (!popup.isOpen()) {
            marker.togglePopup();
          }
        };

        const hidePopup = () => {
          hideTimeout = setTimeout(() => {
            if (popup.isOpen()) {
              marker.togglePopup();
            }
          }, 100);
        };

        // Marker hover events
        el.addEventListener("mouseenter", showPopup);
        el.addEventListener("mouseleave", hidePopup);

        // Click handler for single point - open sidebar
        el.addEventListener("click", (e) => {
          e.stopPropagation();
          if (onMarkerClick) {
            onMarkerClick(point);
          }
        });

        // Keep popup open when hovering over it
        popup.on("open", () => {
          const popupEl = popup.getElement();
          if (popupEl) {
            popupEl.addEventListener("mouseenter", showPopup);
            popupEl.addEventListener("mouseleave", hidePopup);
          }
        });

        newMarkers[id] = marker;
        return;
      }

      // Create cluster marker (no popup) - viewport alignment keeps markers upright
      const marker = new maplibregl.Marker({
        element: el,
        anchor: "bottom",
        offset: [0, -6],
        pitchAlignment: "viewport",
        rotationAlignment: "viewport",
      })
        .setLngLat(coordinates)
        .addTo(map.current);

      marker._isHighlighted = false;
      newMarkers[id] = marker;
    });

    // Remove old markers that are no longer in view
    Object.values(markersRef.current).forEach((marker) => marker.remove());

    // Update ref with new markers
    markersRef.current = newMarkers;
  }, [mapLoaded, createMarkerElement, onMarkerClick, highlightedPostId]);


  // Initialize Supercluster when data or filter changes
    useEffect(() => {
    if (!data.length) return;

    const filteredData = data.filter(
        (point) => statusFilter[point.status]
    );

    const features = filteredData.map((point) => ({
        type: "Feature",
        properties: { ...point },
        geometry: {
        type: "Point",
        coordinates: [point.longitude, point.latitude],
        },
    }));

    clusterRef.current = new Supercluster({
        radius: 40,
        maxZoom: 16,
    });

    clusterRef.current.load(features);

    // Update markers if map is already loaded
    if (map.current && mapLoaded) {
        updateMarkers();
    }
    }, [data, statusFilter, mapLoaded, updateMarkers]);

  // Update markers when map moves or highlighted post changes
  useEffect(() => {
    if (!map.current || !mapLoaded) return;

    // Initial render
    updateMarkers();

    // Debounced update on map events to prevent ResizeObserver errors
    const handleMapChange = () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
      updateTimeoutRef.current = setTimeout(() => {
        updateMarkers();
      }, 50);
    };

    map.current.on("moveend", handleMapChange);
    map.current.on("zoomend", handleMapChange);

    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
      if (map.current) {
        map.current.off("moveend", handleMapChange);
        map.current.off("zoomend", handleMapChange);
      }
    };
  }, [updateMarkers, mapLoaded, highlightedPostId]);

  // Search handler
  const handleSearch = ({ lat, lng }) => {
    if (map.current) {
      map.current.flyTo({
        center: [lng, lat],
        zoom: 14,
        duration: 1500,
      });
    }
  };

  return (
    <div className="relative w-full h-full">
      {/* Search Bar - Centered at top */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 w-full max-w-md px-4">
        <SearchBar onSearch={handleSearch} />
      </div>

      {/* Status Filters - Top left corner */}
      <div className="absolute top-4 left-4 z-10">
        <StatusFilter statusFilter={statusFilter} setStatusFilter={setStatusFilter} />
      </div>

      {/* Map Container */}
      <div ref={mapContainer} className="w-full h-full" />

      {/* Global popup styles */}
      <style>{`
        .maplibregl-popup-content {
          padding: 0;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
        }
        .maplibregl-popup-tip {
          border-top-color: white;
        }
      `}</style>
    </div>
  );
});

export default MapContainer;