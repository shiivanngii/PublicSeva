/**
 * Severity Score Calculator
 * Total Max Score: 100 points
 * - AI Score: max 40 points
 * - Vote Score: max 30 points (1 point per vote)
 * - Time Score: max 30 points (based on days passed)
 */

/**
 * Map AI severity label to score (max 40)
 */
export function mapAISeverity(label) {
  const map = {
    LOW: 10,
    MEDIUM: 20,
    HIGH: 30,
    CRITICAL: 40
  };
  return map[label] || 10;
}

/**
 * Calculate vote score (1 point per vote, max 30)
 */
export function calculateVoteScore(voteCount) {
  return Math.min(voteCount, 30);
}

/**
 * Calculate time score based on days passed (max 30)
 * - Less than 1 day: 5 points
 * - 1-3 days: 10 points
 * - 3-7 days: 20 points
 * - More than 7 days: 30 points
 */
export function calculateTimeScore(createdAt) {
  const now = new Date();
  const created = new Date(createdAt);
  const diffMs = now - created;
  const diffDays = diffMs / (1000 * 60 * 60 * 24);

  if (diffDays < 1) return 5;
  if (diffDays < 3) return 10;
  if (diffDays < 7) return 20;
  return 30;
}

/**
 * Calculate total severity score
 * @param {Object} params
 * @param {number} params.aiScore - AI severity score (max 40)
 * @param {number} params.voteCount - Number of votes
 * @param {Date} params.createdAt - Issue creation date
 * @returns {number} Total severity score (max 100)
 */
export function calculateTotalSeverity({ aiScore, voteCount, createdAt }) {
  const voteScore = calculateVoteScore(voteCount);
  const timeScore = calculateTimeScore(createdAt);

  return aiScore + voteScore + timeScore;
}

/**
 * Get severity breakdown for an issue
 */
export function getSeverityBreakdown({ aiScore, voteCount, createdAt }) {
  const voteScore = calculateVoteScore(voteCount);
  const timeScore = calculateTimeScore(createdAt);

  return {
    aiScore,
    voteScore,
    timeScore,
    totalScore: aiScore + voteScore + timeScore
  };
}
