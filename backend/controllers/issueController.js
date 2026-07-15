import Issue from "../models/Issue.js";
import { getAISeverity } from "../services/aiSeverityService.js";
import {
  calculateVoteScore,
  calculateTimeScore,
  calculateTotalSeverity
} from "../utils/severityEngine.js";

/**
 * Helper: Update severity score for an issue
 */
async function updateIssueSeverity(issue) {
  const aiScore = issue.aiSeverity?.score || 0;
  const voteScore = calculateVoteScore(issue.votes?.length || 0);
  const timeScore = calculateTimeScore(issue.createdAt);
  const totalScore = aiScore + voteScore + timeScore;

  issue.severityBreakdown = { aiScore, voteScore, timeScore };
  issue.severityScore = totalScore;

  return issue;
}

/**
 * @desc    Create a new issue (post)
 * @route   POST /api/issues
 * @access  Citizen (authenticated)
 */
export const createIssue = async (req, res) => {
  try {
    const { title, description, address, lat, lng } = req.body;

    // basic validation
    if (!title || !description || !lat || !lng || !req.file) {
      return res.status(400).json({
        success: false,
        message: "Title, description, image, and location are required"
      });
    }

    const aiSeverity = await getAISeverity(description);

    // Initial time score (just created = 5 points)
    const initialTimeScore = 5;
    const initialTotalScore = aiSeverity.score + 0 + initialTimeScore; // 0 votes at creation

    const issue = await Issue.create({
      title,
      description,
      images: [req.file.path],
      address,
      location: {
        type: "Point",
        coordinates: [Number(lng), Number(lat)]
      },
      createdBy: req.user.id,
      aiSeverity,
      severityBreakdown: {
        aiScore: aiSeverity.score,
        voteScore: 0,
        timeScore: initialTimeScore
      },
      severityScore: initialTotalScore
    });

    res.status(201).json({
      success: true,
      issue
    });
  } catch (err) {
    console.error("CREATE ISSUE ERROR:", err);
    console.error("Error stack:", err.stack);
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

/**
 * @desc    Get all issues (feed) - also updates time-based severity
 * @route   GET /api/issues
 * @access  Public
 */
export const getAllIssues = async (req, res) => {
  try {
    const issues = await Issue.find()
      .populate("createdBy", "name role")
      .sort({ createdAt: -1 });

    // Recalculate time score for each issue (time changes!)
    const updatedIssues = await Promise.all(
      issues.map(async (issue) => {
        const currentTimeScore = calculateTimeScore(issue.createdAt);
        const storedTimeScore = issue.severityBreakdown?.timeScore || 0;

        // Only update if time score has changed
        if (currentTimeScore !== storedTimeScore) {
          await updateIssueSeverity(issue);
          await issue.save();
        }
        return issue;
      })
    );

    res.json({
      success: true,
      issues: updatedIssues
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

/**
 * @desc    Get single issue
 * @route   GET /api/issues/:id
 * @access  Public
 */
export const getIssueById = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id)
      .populate("createdBy", "name role")
      .populate("comments.user", "name");

    if (!issue) {
      return res.status(404).json({
        success: false,
        message: "Issue not found"
      });
    }

    res.json({
      success: true,
      issue
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

/**
 * @desc    Get current user's issues - also updates time-based severity
 * @route   GET /api/issues/my
 * @access  Authenticated
 */
export const getMyIssues = async (req, res) => {
  try {
    const issues = await Issue.find({
      createdBy: req.user.id
    })
      .populate("createdBy", "name role")
      .sort({ createdAt: -1 });

    // Recalculate time score for each issue
    const updatedIssues = await Promise.all(
      issues.map(async (issue) => {
        const currentTimeScore = calculateTimeScore(issue.createdAt);
        const storedTimeScore = issue.severityBreakdown?.timeScore || 0;

        if (currentTimeScore !== storedTimeScore) {
          await updateIssueSeverity(issue);
          await issue.save();
        }
        return issue;
      })
    );

    res.json({
      success: true,
      issues: updatedIssues
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message
    });
  }
};

/**
 * @desc    Get issues by user
 * @route   GET /api/issues/user/:userId
 * @access  Public
 */
export const getIssuesByUser = async (req, res) => {
  try {
    const issues = await Issue.find({
      createdBy: req.params.userId
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
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
 * @desc    Like or unlike an issue - updates severity score
 * @route   POST /api/issues/:id/like
 * @access  Authenticated
 */
export const toggleLike = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({ success: false, message: "Issue not found" });
    }

    const userId = req.user.id;
    const voted = issue.votes.includes(userId);

    if (voted) {
      issue.votes.pull(userId);
    } else {
      issue.votes.push(userId);
    }

    // Recalculate severity after vote change
    await updateIssueSeverity(issue);
    await issue.save();

    res.json({
      success: true,
      liked: !voted,
      totalLikes: issue.votes.length,
      severityScore: issue.severityScore,
      severityBreakdown: issue.severityBreakdown
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

/**
 * @desc    Add comment to issue
 * @route   POST /api/issues/:id/comment
 * @access  Authenticated
 */
export const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ success: false, message: "Comment text required" });
    }

    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({ success: false, message: "Issue not found" });
    }

    issue.comments.push({
      user: req.user.id,
      text
    });

    await issue.save();

    res.status(201).json({
      success: true,
      comment: issue.comments.at(-1)
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
