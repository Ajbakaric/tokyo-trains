// src/components/TrainBoard.jsx
import ArrivalCard from "./ArrivalCard";
import { motion, AnimatePresence } from "framer-motion";

export default function TrainBoard({ trains, type = "arrivals", setTrains }) {
  if (!Array.isArray(trains) || trains.length === 0) {
    return <div className="text-subtext text-sm text-center my-6">No upcoming {type}.</div>;
  }
  const canMutate = typeof setTrains === "function";

  function handleLeave(id) {
    if (!canMutate) return;
    setTrains(prev => prev.filter(t => t.id !== id));
  }

  return (
    <motion.ul
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4"
      initial="hidden"
      animate="visible"
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
    >
      <AnimatePresence mode="popLayout">
        {trains.map(t => (
          <motion.li
            key={t.id}
            initial={{ opacity: 0, x: 80 }}   // phase in from right
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -80 }}     // phase out to left
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <ArrivalCard
              item={t}
              onLeave={canMutate ? handleLeave : undefined}
              context={type}                   // <- controls which icon to show
            />
          </motion.li>
        ))}
      </AnimatePresence>
    </motion.ul>
  );
}
