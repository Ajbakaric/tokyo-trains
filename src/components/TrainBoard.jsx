import { AnimatePresence } from "framer-motion";
import ArrivalCard from "./ArrivalCard";

// Keep parent from clipping exit motion to the left
const gridCls = "grid gap-3 sm:gap-4 grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 overflow-visible";

export default function TrainBoard({ trains, type, setTrains, lang }) {
  function handleLeave(id){
    if (!setTrains) return;
    // Removing the item triggers unmount → ArrivalCard exit anim runs (x:-160)
    setTrains(prev => prev.filter(t => t.id !== id));
  }

  const sorted = [...trains].sort((a,b)=>a.delayedEpoch - b.delayedEpoch);

  return (
    <section className="mt-4">
      <div className={gridCls}>
        {/* AnimatePresence must be the *direct* parent of the animated cards */}
        <AnimatePresence mode="wait" initial={false}>
          {sorted.map(t => (
            <ArrivalCard
              key={t.id}
              item={t}
              onLeave={type === "boarding" ? handleLeave : undefined}
              context={type === "boarding" ? "boarding" : type}
            />
          ))}
        </AnimatePresence>
      </div>
      {sorted.length === 0 && (
        <div className="text-subtext text-sm mt-3">No trains to display.</div>
      )}
    </section>
  );
}
