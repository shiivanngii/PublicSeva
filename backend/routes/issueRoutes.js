import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";
import {
  createIssue,
  getAllIssues,
  getIssueById,
  getIssuesByUser,
  getMyIssues,
  toggleLike,
  addComment
} from "../controllers/issueController.js";

const router = express.Router();

router.post("/", authMiddleware, upload.single("image"), createIssue);
router.get("/", getAllIssues);
router.get("/my", authMiddleware, getMyIssues); // Must be before /:id
router.get("/:id", getIssueById);
router.get("/user/:userId", getIssuesByUser);
router.post("/:id/like", authMiddleware, toggleLike);
router.post("/:id/comment", authMiddleware, addComment);

export default router;
