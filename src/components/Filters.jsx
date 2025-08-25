// src/components/Filters.jsx
import { useEffect } from "react";

export default function Filters({ allCodes, active, setActive }) {
  useEffect(() => {
    try { localStorage.setItem("tb_lines", JSON.stringify([...active])); } catch {}
  }, [active]);

  function toggle(code) {
    setActive(prev => {
      const next = new Set(prev);
      next.has(code) ? next.delete(code) : next.add(code);
      return next;
    });
  }

  function clearAll() { setActive(new Set()); }

  return (
    <div className="flex flex-wrap items-center gap-2 my-3">
      <span className="text-xs text-subtext mr-1">Lines:</span>
      {allCodes.map(code => (
        <button
          key={code}
          onClick={() => toggle(code)}
          className={`px-2 py-1 rounded-lg border text-sm ${
            active.has(code)
              ? "border-[var(--color-neon-cyan)] text-[var(--color-neon-cyan)]"
              : "border-outline/60 text-subtext hover:border-outline"
          }`}
          aria-pressed={active.has(code)}
        >
          {code}
        </button>
      ))}
      <button onClick={clearAll} className="ml-1 px-2 py-1 rounded-lg text-xs border border-outline/60 text-subtext">
        Clear
      </button>
    </div>
  );
}
