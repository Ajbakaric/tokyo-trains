// Common local-government terms → English.
// Expand this map as you encounter new labels.
// We fallback to JP if not found.
// src/utils/jpToEn.js
const dict = {
  "東京都練馬区": "Nerima City, Tokyo",
  "区長室": "Mayor’s Office",
  "広聴広報課": "Public Relations Section",
  "庶務係": "General Affairs Unit",
  "広報調整係": "PR Coordination Unit",
  "広報戦略係": "PR Strategy Unit",
  "広報係": "Public Relations Unit",
  "広聴担当係": "Public Feedback Unit",
  "危機管理課": "Crisis Management Section",
  "防災計画課": "Disaster Planning Section",
  "総務課": "General Affairs Section",
  // Add more as you encounter them...
};

export function translate(jp) {
  return dict[jp] || jp; // fallback to JP if no EN
}
