// src/components/ArrivalCard.jsx
import { motion } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import boardingIcon from "../assets/boarding.png";
import departuresIcon from "../assets/departures.png";

export default function ArrivalCard({
  item,
  onLeave,
  context = "arrivals", // "arrivals" | "boarding" | "departures"
  lang = "en",
}) {
  const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(item.delayedEpoch));
  const [leaving, setLeaving] = useState(false);
  const timeoutRef = useRef(null);

  // live HH:MM:SS countdown + leaving-after-5s
  useEffect(() => {
    const id = setInterval(() => {
      const left = getTimeLeft(item.delayedEpoch);
      setTimeLeft(left);

      const atZero = left.hours === 0 && left.minutes === 0 && left.seconds === 0;
      if (!leaving && atZero) {
        setLeaving(true);
        // schedule removal after 5s
        if (!timeoutRef.current) {
          timeoutRef.current = setTimeout(() => {
            if (onLeave) onLeave(item.id);
            timeoutRef.current = null;
          }, 5000);
        }
      }
    }, 1000);

    return () => {
      clearInterval(id);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [item.delayedEpoch, leaving, onLeave, item.id]);

  // status badge
  const { badgeClass, statusText } = useMemo(() => {
    if (leaving) {
      return {
        badgeClass: "border-[var(--color-neon)] text-[var(--color-neon)]",
        statusText: "Leaving now",
      };
    }
    if (item.delayMin > 0) {
      return {
        badgeClass: "border-[var(--color-magenta)] text-[var(--color-magenta)]",
        statusText: `Delayed +${item.delayMin}m`,
      };
    }
    return { badgeClass: "border-outline/60 text-subtext", statusText: "On time" };
  }, [leaving, item.delayMin]);

  // icon by context (boarding icon for arrivals/boarding, departures for departures)
  const ctxIcon = context === "departures" ? departuresIcon : boardingIcon;

  // progress toward ETA (0–100) normalized to a 1h window
  const progress = useMemo(() => {
    const totalMs = 60 * 60 * 1000;
    const msLeft = Math.max(0, (item.delayedEpoch ?? Date.now()) - Date.now());
    return Math.min(100, Math.max(0, 100 - (msLeft / totalMs) * 100));
  }, [item.delayedEpoch, timeLeft.seconds]); // tick once per second

  const destMain = lang === "ja" ? item.destinationJP : item.destinationEN;
  const destAlt  = lang === "ja" ? item.destinationEN : item.destinationJP;

  return (
    <motion.div
      layout
      className="card p-3 sm:p-4 flex flex-col gap-2 hover:shadow-[0_0_16px_rgba(0,209,255,.12)] transition-shadow"
    >
      {/* Header: line chip + destination + platform + context icon */}
      <div className="flex items-center gap-2 min-w-0">
        {/* line chip with color */}
        <div
          className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center border text-black"
          style={{
            background: item.lineColor || "var(--color-neon-cyan)",
            borderColor: "color-mix(in oklab, #000 20%, transparent)",
          }}
          title={item.line}
        >
          <span className="font-display text-base">{item.lineCode}</span>
        </div>

        {/* destination + line text */}
        <div className="flex-1 min-w-0">
          <div className="font-display text-lg text-neon flex items-center gap-2 min-w-0">
            <span className="truncate max-w-[14ch] sm:max-w-[18ch]">{destMain}</span>
            <span className="text-subtext truncate max-w-[16ch] sm:max-w-[20ch]">({destAlt})</span>
            {ctxIcon && (
              <span className="inline-flex w-25 h-25 shrink-0">
                <img src={ctxIcon} alt={context} className="w-full h-full object-contain" />
              </span>
            )}
          </div>
          <div className="text-subtext text-xs sm:text-sm truncate">{item.line}</div>
        </div>

        {/* platform chip */}
        <div
          className="px-2 py-1 rounded-lg text-xs border"
          title={`Platform ${item.platform}`}
          style={{ borderColor: "var(--color-outline)", color: "var(--color-text)" }}
        >
          番線 {item.platform}
        </div>
      </div>

      {/* Time + status */}
      <div className="flex items-end justify-between">
        <div className="font-mono text-neon neon-text text-2xl sm:text-3xl">{item.eta}</div>
        <div
          className={`text-[10px] sm:text-xs px-2 py-[2px] rounded-lg border ${badgeClass}`}
          aria-label={`Status: ${statusText}, time left ${timeLeft.label}`}
        >
          {statusText} • {timeLeft.label}
        </div>
      </div>

      {/* progress to ETA */}
      <div className="h-1 rounded bg-white/5 overflow-hidden" role="progressbar" aria-valuenow={Math.round(progress)} aria-valuemin={0} aria-valuemax={100}>
        <div
          className="h-full transition-[width] duration-700"
          style={{ width: `${progress}%`, background: "var(--color-neon-cyan)" }}
        />
      </div>
    </motion.div>
  );
}

function getTimeLeft(targetEpoch) {
  const diff = Math.max(0, (targetEpoch ?? Date.now()) - Date.now());
  const hours = Math.floor(diff / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);
  const seconds = Math.floor((diff % 60_000) / 1000);
  const label =
    `${hours.toString().padStart(2, "0")}:` +
    `${minutes.toString().padStart(2, "0")}:` +
    `${seconds.toString().padStart(2, "0")}`;
  return { hours, minutes, seconds, label };
}
