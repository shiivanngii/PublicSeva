import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Leaf,
  Camera,
  MapPin,
  BarChart3,
  Users,
  Sun,
  Moon
} from "lucide-react";

export default function LandingPage() {
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

  // Dark mode toggle
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <div className="min-h-screen bg-green-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 transition-colors duration-300">

      {/* Navbar */}
      <nav className="flex justify-between items-center px-8 py-4 bg-white dark:bg-gray-800 shadow">
        <div
          className="flex items-center gap-2 text-2xl font-bold text-green-700 dark:text-green-400 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <Leaf /> PublicSeva
        </div>

        <div className="flex items-center gap-4">
          {/* Dark mode toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition"
          >
            {darkMode ? <Sun /> : <Moon />}
          </button>

          <button
            onClick={() => navigate("/login")}
            className="px-4 py-2 border rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            Login
          </button>

          <button
            onClick={() => navigate("/signup")}
            className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded transition"
          >
            Sign Up
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="text-center py-24 px-6 bg-gradient-to-b from-green-100 to-green-50 dark:from-gray-800 dark:to-gray-900">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6">
          Report Waste. Track Action.{" "}
          <span className="text-green-600 dark:text-green-400">
            Clean Communities.
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-300 mb-8">
          PublicSeva empowers citizens to report waste hotspots with images and
          live location, while authorities monitor and resolve them efficiently.
        </p>

        <div className="flex justify-center gap-4">
          <button
            onClick={() => navigate("/signup")}
            className="px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg shadow transition"
          >
            Get Started
          </button>

          <button
            onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" })}
            className="px-8 py-3 border rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition"
          >
            Learn More
          </button>
        </div>
      </section>

      {/* Who is it for */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <h2 className="text-3xl font-semibold text-center mb-12">
          Who is it for?
        </h2>

        <div className="grid md:grid-cols-2 gap-10 max-w-5xl mx-auto px-6">
          <Card
            icon={<Users />}
            title="Citizens"
            items={[
              "Report waste with photos",
              "Automatic location detection",
              "Track issue status"
            ]}
          />

          <Card
            icon={<BarChart3 />}
            title="Authorities"
            items={[
              "Centralized monitoring dashboard",
              "Real-time status updates",
              "Faster issue resolution"
            ]}
          />
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-6">
        <h2 className="text-3xl font-semibold text-center mb-12">
          Key Features
        </h2>

        <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
          <Feature icon={<Camera />} title="Image Reporting" />
          <Feature icon={<MapPin />} title="Live Location" />
          <Feature icon={<BarChart3 />} title="Status Tracking" />
          <Feature icon={<Leaf />} title="Eco Impact" />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-green-700 dark:bg-gray-900 text-white text-center py-6">
        © 2026 PublicSeva · Cleaner Communities Through Technology
      </footer>
    </div>
  );
}

/* ---------- Reusable Components ---------- */

function Feature({ icon, title }) {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow hover:shadow-lg transition text-center">
      <div className="flex justify-center text-green-600 dark:text-green-400 mb-4">
        {icon}
      </div>
      <h3 className="font-semibold text-lg">{title}</h3>
    </div>
  );
}

function Card({ icon, title, items }) {
  return (
    <div className="bg-green-50 dark:bg-gray-700 p-8 rounded-xl shadow hover:shadow-lg transition">
      <h3 className="flex items-center gap-2 text-xl font-semibold text-green-700 dark:text-green-400 mb-4">
        {icon} {title}
      </h3>
      <ul className="space-y-2 text-gray-700 dark:text-gray-300">
        {items.map((item, i) => (
          <li key={i}>• {item}</li>
        ))}
      </ul>
    </div>
  );
}
