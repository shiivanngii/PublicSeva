import { askGemini } from "../llm/geminiClient.js";
import { mapAISeverity } from "../utils/severityEngine.js";

function extractJSON(text) {
  return text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

export async function getAISeverity(description) {
  const prompt = `
You are a civic authority assistant.

Classify the severity of the following waste complaint
into ONLY one of these:
LOW, MEDIUM, HIGH, CRITICAL

Respond STRICTLY in JSON:
{
  "severity": "...",
  "reason": "..."
}

Complaint:
"${description}"
`;

  const raw = await askGemini(prompt);
  const parsed = JSON.parse(extractJSON(raw));

  return {
    label: parsed.severity,
    score: mapAISeverity(parsed.severity),
    reason: parsed.reason
  };
}
