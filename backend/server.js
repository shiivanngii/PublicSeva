import "dotenv/config"; // Auto-loads .env before other imports
import express from "express";
import cors from "cors";
import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import passport from "./config/passport.js";
import userRoutes from "./routes/userRoutes.js";
import roleTestRoutes from "./routes/roleTestRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import issueRoutes from "./routes/issueRoutes.js";
connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use passport based auth
app.use(passport.initialize());

// Call all authentication API routes
app.use("/api/auth", authRoutes);

// Call all role-test api routes
app.use("/api/test", roleTestRoutes);

// call all user-related api routes
app.use("/api/users", userRoutes);

// call all admin-related api routes
app.use("/api/admin", adminRoutes);

// call all issue-related api routes
app.use("/api/issues", issueRoutes);




app.get("/", (req, res) => {
  res.send("PublicSeva Backend Running");
});



const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`)
);

