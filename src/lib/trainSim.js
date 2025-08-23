// src/lib/trainSim.js
import { minutesUntilJST } from "./time";

/**
 * Generate fake trains for arrivals & departures
 */
export function generateTrains(count = 12, startHour = 6) {
  const trains = [];
  const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Tokyo" }));
  let current = new Date(now);
  current.setHours(startHour, 0, 0, 0);

  for (let i = 0; i < count; i++) {
    // stagger each train randomly between 2–15 minutes after the last
    const gap = 2 + Math.floor(Math.random() * 14); // minutes
    current = new Date(current.getTime() + gap * 60000);

    // random delay up to 5 minutes
    const delayMin = Math.random() < 0.2 ? Math.floor(Math.random() * 6) : 0;
    const delayedEpoch = current.getTime() + delayMin * 60000;

    // civilian (12h) format
    const eta = current.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
      timeZone: "Asia/Tokyo",
    });

    trains.push({
      id: `T-${i}`,
      line: "銀座線 / Ginza Line",
      lineCode: "G",
      destinationJP: "浅草",
      destinationEN: "Asakusa",
      platform: 2,
      eta,
      delayedEpoch,
      delayMin,
      status: delayMin > 0 ? `Delayed +${delayMin}m` : "On time",
      minutesAway: minutesUntilJST(
        current.toLocaleTimeString("ja-JP", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
          timeZone: "Asia/Tokyo",
        })
      ) + delayMin,
    });
  }

  return trains;
}
