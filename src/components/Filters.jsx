// src/components/Filters.jsx
import { useEffect } from "react";

export default function Filters({ allCodes, active, setActive }) {
  // Persist selection
  useEffect(() => {
    try {
      localStorage.setItem("tb_lines", JSON.stringify([...active]));
    } catch {}
  }, [active]);

  function toggle(code) {
    setActive(prev => {
      const next = new Set(prev);
      next.has(code) ? next.delete(code) : next.add(code);
      return next;
    });
  }

  function clearAll() {
    setActive(new Set());
  }

  return (
    <div className="chip-bar px-4 py-2">{/* sticky above hero */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs text-subtext mr-1">Lines:</span>

        {allCodes.map(code => {
          const on = active.has(code);
          return (
            <button
              key={code}
              onClick={() => toggle(code)}
              aria-pressed={on}
              className={`px-2 py-1 rounded-2xl border text-xs transition-colors
                ${on
                  ? "bg-[var(--color-neon)] text-black border-transparent"
                  : "bg-[var(--color-panel)]/60 text-subtext border border-outline/60 hover:border-outline"}`}
              title={on ? `Hide ${code}` : `Show ${code}`}
            >
              {code}
            </button>
          );
        })}

        <button
          onClick={clearAll}
          className="ml-1 px-2 py-1 rounded-2xl text-xs border border-outline/60 text-subtext hover:border-outline"
          title="Clear all filters"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
