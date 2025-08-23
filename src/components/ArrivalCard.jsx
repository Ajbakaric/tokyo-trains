// src/components/ArrivalCard.jsx
import { motion } from "framer-motion";

export default function ArrivalCard({ item }) {
  const mins = Math.max(
    0,
    Math.round((item.delayedEpoch - Date.now()) / 60000)
  );

  return (
    <motion.li
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="card p-3 sm:p-4 flex flex-col justify-between"
    >
      {/* Top row: line + destination */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="shrink-0 w-10 h-10 rounded-xl flex items-center justify-center bg-[var(--bg)] border border-[var(--outline)]">
            <span className="font-display text-lg text-[var(--neon-cyan)]">
              {item.lineCode}
            </span>
          </div>
          <div className="leading-tight">
            <div className="font-semibold">
              {item.destinationJP}{" "}
              <span className="text-subtext">({item.destinationEN})</span>
            </div>
            <div className="text-xs text-subtext">
              {item.line} • Platform {item.platform}
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="font-mono text-2xl text-neon neon-text">
            {item.eta}
          </div>
          <div className="text-[10px] text-subtext">
            {item.status} • in {mins}m
          </div>
        </div>
      </div>
    </motion.li>
  );
}
