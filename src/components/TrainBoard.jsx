// src/components/TrainBoard.jsx
import ArrivalCard from "./ArrivalCard";

export default function TrainBoard({ trains, type = "arrivals" }) {
  if (!trains?.length) {
    return (
      <div className="text-subtext text-sm text-center my-6">
        No upcoming {type}.
      </div>
    );
  }

  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
      {trains.map((t) => (
        <ArrivalCard key={t.id} item={t} />
      ))}
    </ul>
  );
}
