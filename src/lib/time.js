// src/lib/time.js

// Format times in JST (HH:MM, Japanese locale)
export const jst = new Intl.DateTimeFormat("ja-JP", {
  timeStyle: "short",
  timeZone: "Asia/Tokyo",
});

// Minutes until ETA (tries "HH:MM" in JST; falls back to null)
export function minutesUntilJST(etaStr) {
  if (!etaStr || !/^\d{1,2}:\d{2}$/.test(etaStr)) return null;

  // current time in JST
  const nowJST = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Tokyo" })
  );
  const [hh, mm] = etaStr.split(":").map(Number);

  // target today in JST
  const target = new Date(nowJST);
  target.setHours(hh, mm, 0, 0);

  // if target already passed by > 2 min, assume next day arrival
  if (target.getTime() < nowJST.getTime() - 2 * 60 * 1000) {
    target.setDate(target.getDate() + 1);
  }

  const diffMs = target - nowJST;
  return Math.round(diffMs / 60000); // minutes
}
