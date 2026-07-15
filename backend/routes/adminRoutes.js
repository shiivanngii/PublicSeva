import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import { allowRoles } from "../middleware/roleMiddleware.js";
import {
  getAllIssuesAdmin,
  updateIssueStatus,
  deleteIssue,
  updateIssue
} from "../controllers/adminController.js";

const router = express.Router();

/**
 * Admin issue dashboard
 */
router.get(
  "/issues",
  authMiddleware,
  allowRoles("admin"),
  getAllIssuesAdmin
);

/**
 * Update issue status
 */
router.patch(
  "/issues/:id/status",
  authMiddleware,
  allowRoles("admin"),
  updateIssueStatus
);

/**
 * Delete Issue from db
 */
router.delete(
    "/issues/:id",
    authMiddleware,
    allowRoles("admin"), 
    deleteIssue);

/**
 * Update Issue details
 */
router.patch(
    "/issues/:id", 
    authMiddleware,
    allowRoles("admin"),
    updateIssue);

export default router;
