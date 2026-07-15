import mongoose from "mongoose";
import dotenv from "dotenv";
import Issue from "./models/Issue.js";
import User from "./models/User.js";

dotenv.config();

await mongoose.connect(process.env.MONGO_URI);

const user = await User.findOne();

if (!user) {
  console.log("❌ No user found. Create a user first.");
  process.exit();
}

const issues = [
  // ===================== MUMBAI =====================
  {
    title: "Garbage piling near bus stop",
    description:
      "Large pile of garbage near the bus stop causing foul smell and attracting stray animals. Situation worsens during evening hours.",
    images: ["https://thumbs.dreamstime.com/z/overcrowded-garbage-cans-next-to-bus-stop-vilnius-lithuania-july-baltic-country-very-little-money-allocated-96852364.jpg?ct=jpeg"],
    location: { type: "Point", coordinates: [72.8731, 19.1155] },
    address: "Andheri East, Mumbai",
    createdBy: user._id,
    votes: []
  },
  {
    title: "Overflowing trash bins on main road",
    description:
      "Municipal garbage bins are overflowing for the last 4 days. Waste is spreading on the road and causing traffic issues.",
    images: ["PASTE_IMAGE_URL_HERE"],
    location: { type: "Point", coordinates: [72.8856, 19.0596] },
    address: "Kurla West, Mumbai",
    createdBy: user._id,
    votes: []
  },

  // ===================== NAVI MUMBAI =====================
  {
    title: "Illegal dumping near residential area",
    description:
      "Construction waste and plastic garbage dumped illegally near residential society. Children play nearby which is unsafe.",
    images: ["PASTE_IMAGE_URL_HERE"],
    location: { type: "Point", coordinates: [73.0150, 19.0330] },
    address: "Vashi, Navi Mumbai",
    createdBy: user._id,
    votes: []
  },
  {
    title: "Blocked drainage due to waste",
    description:
      "Drainage line is blocked due to plastic and garbage. Water stagnation causing mosquito breeding.",
    images: ["PASTE_IMAGE_URL_HERE"],
    location: { type: "Point", coordinates: [73.0297, 19.0222] },
    address: "Nerul, Navi Mumbai",
    createdBy: user._id,
    votes: []
  },

  // ===================== THANE =====================
  {
    title: "Garbage heap beside society gate",
    description:
      "Garbage heap beside society gate has not been cleared for a week. Residents facing severe hygiene issues.",
    images: ["PASTE_IMAGE_URL_HERE"],
    location: { type: "Point", coordinates: [72.9781, 19.2183] },
    address: "Ghodbunder Road, Thane",
    createdBy: user._id,
    votes: []
  },
  {
    title: "Waste dumped near lake",
    description:
      "Plastic and household waste dumped near lake area. This is polluting water and harming birds.",
    images: ["PASTE_IMAGE_URL_HERE"],
    location: { type: "Point", coordinates: [72.9758, 19.2058] },
    address: "Upvan Lake, Thane",
    createdBy: user._id,
    votes: []
  },

  // ===================== MAHARASHTRA (OTHER DISTRICTS) =====================
  {
    title: "Garbage accumulation near market",
    description:
      "Daily market waste is not cleared properly leading to unhygienic conditions for vendors and customers.",
    images: ["PASTE_IMAGE_URL_HERE"],
    location: { type: "Point", coordinates: [73.7898, 18.5204] },
    address: "Shivaji Market, Pune",
    createdBy: user._id,
    votes: []
  },
  {
    title: "Open dumping beside highway",
    description:
      "Open dumping of garbage beside highway causing bad odor and environmental damage.",
    images: ["PASTE_IMAGE_URL_HERE"],
    location: { type: "Point", coordinates: [75.3433, 19.8762] },
    address: "Aurangabad Highway Area",
    createdBy: user._id,
    votes: []
  },
  {
    title: "Waste near school premises",
    description:
      "Garbage dumped near school premises. Children and parents are affected due to foul smell and insects.",
    images: ["PASTE_IMAGE_URL_HERE"],
    location: { type: "Point", coordinates: [74.2433, 16.7050] },
    address: "Kolhapur City",
    createdBy: user._id,
    votes: []
  }
];

await Issue.insertMany(issues);

console.log("✅ Sample issues inserted successfully");
process.exit();
