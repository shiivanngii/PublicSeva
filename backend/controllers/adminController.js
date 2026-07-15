import Issue from "../models/Issue.js";

/* ----------------------------------------
   STATUS TRANSITION RULES
---------------------------------------- */
const STATUS_FLOW = {
  UNSOLVED: ["IN_PROGRESS"],
  IN_PROGRESS: ["RESOLVED"],
  RESOLVED: []
};

/**
 * @desc    Get all issues (admin view)
 * @route   GET /api/admin/issues
 * @access  Admin
 */
export const getAllIssuesAdmin = async (req, res) => {
  try {
    const issues = await Issue.find()
      .populate("createdBy", "name email role")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      total: issues.length,
      issues
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

/**
 * @desc    Update issue status
 * @route   PATCH /api/admin/issues/:id/status
 * @access  Admin
 */
export const updateIssueStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const issueId = req.params.id;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required"
      });
    }

    const issue = await Issue.findById(issueId);
    if (!issue) {
      return res.status(404).json({
        success: false,
        message: "Issue not found"
      });
    }

    const currentStatus = issue.status;

    // Validate transition
    if (!STATUS_FLOW[currentStatus].includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status transition: ${currentStatus} → ${status}`
      });
    }

    issue.status = status;
    await issue.save();

    res.json({
      success: true,
      message: `Issue status updated to ${status}`,
      issue: {
        id: issue._id,
        status: issue.status,
        updatedAt: issue.updatedAt
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

export const deleteIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    await issue.deleteOne();

    res.json({ message: "Issue deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};


/**
 * @desc    Update issue details
 * @route   PATCH /api/admin/issues/:id
 * @access  Admin
 */
export const updateIssue = async (req, res) => {
  try {
      const updated = await Issue.findByIdAndUpdate(
        req.params.id,
        {
          title: req.body.title,
          description: req.body.description,
        },
        { new: true }
      );

      res.json(updated);
    } catch (err) {
      res.status(400).json({ error: "Failed to update issue" });
    }
};