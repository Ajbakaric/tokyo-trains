// src/components/TrainBoard.jsx
import ArrivalCard from "./ArrivalCard";
import SkeletonCard from "./SkeletonCard";
import { motion, AnimatePresence } from "framer-motion";

export default function TrainBoard({ trains, type = "arrivals", setTrains, lang = "en" }) {
  if (!trains) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mt-4">
        {Array.from({ length: 4 }).map((_, i) => <SkeletonCard key={i} />)}
      </div>
    );
  }
  if (!trains.length) {
    return <div className="text-subtext text-sm text-center my-6">No upcoming {type}.</div>;
  }

  const canMutate = typeof setTrains === "function";
  function handleLeave(id) {
    if (!canMutate) return;
    setTrains(prev => prev.filter(t => t.id !== id));
  }

  return (
    <motion.ul
      role="list"
      aria-live="polite"
      className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5 mt-4"
      initial="hidden"
      animate="visible"
      variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.06 } } }}
    >
      <AnimatePresence mode="popLayout">
        {trains.map(t => (
          <motion.li
            key={t.id}
            initial={{ opacity: 0, x: 80 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -80 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <ArrivalCard
              item={t}
              onLeave={canMutate ? handleLeave : undefined}
              context={type}
              lang={lang}
            />
          </motion.li>
        ))}
      </AnimatePresence>
    </motion.ul>
  );
}
