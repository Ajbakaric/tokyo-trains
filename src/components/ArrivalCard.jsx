// src/components/ArrivalCard.jsx
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function ArrivalCard({ item, onLeave }) {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(item.delayedEpoch));
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      const left = getTimeLeft(item.delayedEpoch);
      setTimeLeft(left);

      // When countdown hits 0 → mark as leaving
      if (!leaving && left.hours === 0 && left.minutes === 0 && left.seconds === 0) {
        setLeaving(true);

        // After 5s trigger removal
        setTimeout(() => {
          if (onLeave) onLeave(item.id);
        }, 5000);
      }
    }, 1000);

    return () => clearInterval(id);
  }, [item.delayedEpoch, leaving, onLeave]);

  const { hours, minutes, seconds, label } = timeLeft;

  let statusIcon = "✅";
  let statusText = "On time";
  if (leaving) {
    statusIcon = "⏱";
    statusText = "Leaving now";
  } else if (item.delayMin > 0) {
    statusIcon = "⚠️";
    statusText = `Delayed +${item.delayMin}m`;
  }

  return (
    <motion.div
      className="card p-3 sm:p-4 flex flex-col justify-between"
      layout
    >
      {/* Destination */}
      <div className="font-display text-lg text-neon mb-1">
        {item.destinationJP}{" "}
        <span className="text-subtext">({item.destinationEN})</span>
      </div>
      <div className="text-subtext text-sm mb-2">
        {item.line} • Platform {item.platform}
      </div>

      {/* Time + Status */}
      <div className="flex justify-between items-end">
        <div className="font-mono text-2xl text-neon neon-text">{item.eta}</div>
        <div className="text-xs text-subtext flex flex-col items-end">
          <span>
            {statusIcon} {statusText}
          </span>
          <span className="font-mono">{label}</span>
        </div>
      </div>
    </motion.div>
  );
}

function getTimeLeft(targetEpoch) {
  const diff = Math.max(0, targetEpoch - Date.now());
  const hours = Math.floor(diff / 3600000);
  const minutes = Math.floor((diff % 3600000) / 60000);
  const seconds = Math.floor((diff % 60000) / 1000);

  const label =
    `${hours.toString().padStart(2, "0")}:` +
    `${minutes.toString().padStart(2, "0")}:` +
    `${seconds.toString().padStart(2, "0")}`;

  return { hours, minutes, seconds, label };
}
