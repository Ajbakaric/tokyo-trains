// src/lib/trainSim.js
import { jst, minutesUntilJST } from "./time";

// Generate fake trains for both departures + arrivals
export function generateTrains(count = 12, startHour = 20) {
  const trains = [];
  const now = new Date(
    new Date().toLocaleString("en-US", { timeZone: "Asia/Tokyo" })
  );

  for (let i = 0; i < count; i++) {
    const hh = startHour + Math.floor(i / 6); // spread across hours
    const mm = (i % 6) * 10; // every 10 minutes
    const eta = `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;

    // scheduled time as Date in JST
    const sched = new Date(now);
    sched.setHours(hh, mm, 0, 0);

    // random delay up to 5 minutes
    const delayMin = Math.random() < 0.2 ? Math.floor(Math.random() * 6) : 0;
    const delayedEpoch = sched.getTime() + delayMin * 60000;

    trains.push({
      id: `G-${i}`,
      line: "銀座線 / Ginza Line",
      lineCode: "G",
      destinationJP: "浅草",
      destinationEN: "Asakusa",
      platform: 2,
      eta,
      delayedEpoch,
      delayMin,
      status: delayMin > 0 ? `Delayed +${delayMin}m` : "On time",
      minutesAway: minutesUntilJST(eta) + delayMin,
    });
  }

  return trains;
}
