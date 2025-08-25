// src/components/AlertsRibbon.jsx
export default function AlertsRibbon({ alerts = [] }) {
  if (!alerts.length) return null;
  const a = alerts[0];
  return (
    <div className="sticky top-[52px] z-10 bg-[var(--color-magenta)]/12 border-y border-[var(--color-magenta)]/40 px-3 py-2">
      <div className="text-xs text-[var(--color-text)]">
        <span className="font-semibold text-[var(--color-magenta)] mr-2">Service Alert</span>
        {a.header || a.text || "Service status update"}
      </div>
    </div>
  );
}
