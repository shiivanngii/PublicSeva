import { v2 as cloudinary } from "cloudinary";

// Safe default config (uses env vars)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "demo",
  api_key: process.env.CLOUDINARY_API_KEY || "demo",
  api_secret: process.env.CLOUDINARY_API_SECRET || "demo"
});

// ✅ Export as default
export default cloudinary;
