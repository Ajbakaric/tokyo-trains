import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import boardingIcon from "../assets/boarding.png";
import departuresIcon from "../assets/departures.png";

export default function ArrivalCard({ item, onLeave, context = "arrivals" }) {
  const [tl, setTl] = useState(getTimeLeft(item.delayedEpoch));
  const [leaving, setLeaving] = useState(false);

  // Live countdown
  useEffect(() => {
    const id = setInterval(() => {
      const next = getTimeLeft(item.delayedEpoch);
      setTl(next);

      // countdown reached 0
      if (!leaving && next.hours === 0 && next.minutes === 0 && next.seconds === 0) {
        setLeaving(true);
        if (typeof onLeave === "function") {
          // remove from parent after 3s
          setTimeout(() => onLeave(item.id), 3000);
        }
      }
    }, 1000);
    return () => clearInterval(id);
  }, [item.delayedEpoch, leaving, onLeave, item.id]);

  // status
  let statusIcon = "✅";
  let statusText = "On time";
  if (item.delayMin > 0) { statusIcon = "⚠️"; statusText = `Delayed +${item.delayMin}m`; }
  if (leaving) { statusIcon = "⏱"; statusText = "Leaving now"; }

  // context icon
  let ctxIcon = null;
  if (context === "boarding") ctxIcon = boardingIcon;
  if (context === "departures") ctxIcon = departuresIcon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 36 }}
      animate={{
        opacity: leaving ? 0.7 : 1,
        x: 0,
        filter: leaving ? "grayscale(20%)" : "none",
      }}
      exit={{ opacity: 0, x: -160, transition: { duration: 0.45 } }} // 👈 slide left on unmount
      transition={{ duration: 0.35 }}
      className="card p-3 sm:p-4 flex flex-col justify-between"
    >
      {/* Destination */}
      <div className="flex items-center gap-2 mb-1">
        <div className="shrink-0 w-10 h-10 rounded-2xl flex items-center justify-center bg-[var(--color-bg)] border border-outline shadow-[var(--shadow-innerhud)]">
          <span className="font-display text-base text-[var(--color-neon-cyan)]">{item.lineCode}</span>
        </div>

        <div className="font-display text-lg text-neon flex items-center gap-2">
          {item.destinationJP} <span className="text-subtext">({item.destinationEN})</span>
          {ctxIcon && (
            <span className="inline-flex w-8 h-8">
              <img src={ctxIcon} alt={context} className="w-full h-full object-contain" />
            </span>
          )}
        </div>
      </div>

      <div className="text-subtext text-xs sm:text-sm mb-2">
        {item.line} • Platform {item.platform}
      </div>

      {/* Time + status */}
      <div className="flex justify-between items-end">
        <div className="font-mono text-2xl text-neon neon-text">{item.eta}</div>
        <div className="text-xs text-subtext flex flex-col items-end tabular-nums">
          <span>{statusIcon} {statusText}</span>
          <span className="font-mono">{tl.label}</span>
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
    `${hours.toString().padStart(2,"0")}:`+
    `${minutes.toString().padStart(2,"0")}:`+
    `${seconds.toString().padStart(2,"0")}`;
  return { hours, minutes, seconds, label };
}
