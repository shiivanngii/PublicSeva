import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import CitizenNavbar from "../../components/CitizenNavbar";
import Footer from "../../components/Footer";
import { Upload, MapPin } from "lucide-react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import { createIssue } from "../../services/issueApi";

export default function ReportIssue() {
  const navigate = useNavigate();

  // ---------- FORM STATE ----------
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");

  // ---------- IMAGE STATE ----------
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  // ---------- MAP STATE ----------
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const [coords, setCoords] = useState(null);

  // ---------- UI STATE ----------
  const [loading, setLoading] = useState(false);

  // ---------- IMAGE HANDLER ----------
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  // ---------- MAP INITIALIZATION ----------
  useEffect(() => {
    if (!mapContainerRef.current) return;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Guard: ensure container still exists (component may have unmounted)
        if (!mapContainerRef.current) return;

        const lng = position.coords.longitude;
        const lat = position.coords.latitude;

        setCoords({ lng, lat });

        mapRef.current = new maplibregl.Map({
          container: mapContainerRef.current,
          style: `https://api.maptiler.com/maps/streets/style.json?key=${process.env.REACT_APP_MAPTILER_KEY}`,
          center: [lng, lat],
          zoom: 15
        });

        markerRef.current = new maplibregl.Marker({ draggable: true })
          .setLngLat([lng, lat])
          .addTo(mapRef.current);

        markerRef.current.on("dragend", () => {
          const { lng, lat } = markerRef.current.getLngLat();
          setCoords({ lng, lat });
        });
      },
      () => {
        alert("Please allow location access to report an issue.");
      }
    );

    return () => {
      mapRef.current && mapRef.current.remove();
    };
  }, []);

  // ---------- SUBMIT HANDLER ----------
  const handleSubmit = async () => {
    if (!image || !coords || !title || !description) {
      alert("Please fill all required fields");
      return;
    }

    const formData = new FormData();
    formData.append("image", image);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("address", address);
    formData.append("lat", coords.lat);
    formData.append("lng", coords.lng);

    try {
      setLoading(true);
      await createIssue(formData);
      navigate("/citizen/home");
    } catch (err) {
      console.error(err);
      alert("Failed to submit issue");
    } finally {
      setLoading(false);
    }
  };

  // ---------- UI ----------
  return (
    <>
      <CitizenNavbar />

      {/* PAGE WRAPPER */}
      <main className="max-w-4xl mx-auto px-6 py-10">
        {/* Heading */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            Report an Issue
          </h1>
          <p className="text-gray-600 dark:text-gray-300 mt-2">
            Help improve your community by reporting waste or cleanliness issues.
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 p-8 space-y-6">

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Upload Image
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
              id="imageUpload"
            />

            <label
              htmlFor="imageUpload"
              className="flex items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg h-48 cursor-pointer hover:border-green-500 transition overflow-hidden"
            >
              {preview ? (
                <img
                  src={preview}
                  alt="Preview"
                  className="w-full h-full object-contain bg-gray-100 dark:bg-gray-900"
                />
              ) : (
                <div className="text-center text-gray-500 dark:text-gray-400">
                  <Upload className="mx-auto mb-2" />
                  <p className="text-sm">Click to upload or drag & drop</p>
                  <p className="text-xs mt-1">JPG / PNG · Clear photo preferred</p>
                </div>
              )}
            </label>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Issue Title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              type="text"
              placeholder="e.g. Garbage piling near bus stop"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
              placeholder="Describe the issue in detail..."
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>

          {/* Location */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Confirm Location
            </label>

            <div
              ref={mapContainerRef}
              className="border border-gray-300 dark:border-gray-600 rounded-lg h-64 overflow-hidden"
            />

            {coords && (
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 flex items-center gap-1">
                <MapPin size={14} />
                {coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}
              </p>
            )}
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              Address (optional)
            </label>
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              type="text"
              placeholder="Area, road, landmark"
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>

          {/* Submit */}
          <div className="pt-4">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-70"
            >
              {loading ? "Submitting..." : "Submit Issue"}
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
