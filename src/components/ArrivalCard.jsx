// src/components/ArrivalCard.jsx
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import boardingIcon from "../assets/boarding.png";
import departuresIcon from "../assets/departures.png";

export default function ArrivalCard({ item, onLeave, context = "arrivals" }) {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(item.delayedEpoch));
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      const left = getTimeLeft(item.delayedEpoch);
      setTimeLeft(left);

      const atZero = left.hours === 0 && left.minutes === 0 && left.seconds === 0;
      if (!leaving && atZero) {
        setLeaving(true);
        const tid = setTimeout(() => onLeave && onLeave(item.id), 5000);
        return () => clearTimeout(tid);
      }
    }, 1000);
    return () => clearInterval(id);
  }, [item.delayedEpoch, leaving, onLeave]);

  // status label
  let statusIcon = "✅";
  let statusText = "On time";
  if (leaving) {
    statusIcon = "⏱";
    statusText = "Leaving now";
  } else if (item.delayMin > 0) {
    statusIcon = "⚠️";
    statusText = `Delayed +${item.delayMin}m`;
  }

  // choose icon by context
  let ctxIcon = null;
  if (context === "boarding" || context === "arrivals") ctxIcon = boardingIcon;
  if (context === "departures") ctxIcon = departuresIcon;

  return (
    <motion.div className="card p-3 sm:p-4 flex flex-col justify-between" layout>
      {/* Destination + context icon */}
      <div className="flex items-center gap-2 mb-1">
        <div className="shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center bg-[var(--color-bg)] border border-outline shadow-[var(--shadow-innerhud)]">
          <span className="font-display text-base text-[var(--color-neon-cyan)]">{item.lineCode}</span>
        </div>
        <div className="font-display text-lg text-neon">
          {item.destinationJP} <span className="text-subtext">({item.destinationEN})</span>
        </div>
        {ctxIcon && <img src={ctxIcon} alt={context} className="w-5 h-5 opacity-90 ml-1" />}
      </div>

      <div className="text-subtext text-xs sm:text-sm mb-2">
        {item.line} • Platform {item.platform}
      </div>

      {/* Time + status */}
      <div className="flex justify-between items-end">
        <div className="font-mono text-2xl text-neon neon-text">{item.eta}</div>
        <div className="text-xs text-subtext flex flex-col items-end">
          <span>{statusIcon} {statusText}</span>
          <span className="font-mono">{timeLeft.label}</span>
        </div>
      </div>
    </motion.div>
  );
}

function getTimeLeft(targetEpoch) {
  const diff = Math.max(0, targetEpoch - Date.now());
  const hours = Math.floor(diff / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);
  const seconds = Math.floor((diff % 60_000) / 1000);
  const label =
    `${hours.toString().padStart(2, "0")}:` +
    `${minutes.toString().padStart(2, "0")}:` +
    `${seconds.toString().padStart(2, "0")}`;
  return { hours, minutes, seconds, label };
}
