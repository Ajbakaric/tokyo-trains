// src/App.jsx
import { useEffect, useState } from "react";
import TrainBoard from "./components/TrainBoard";
import { generateTrains } from "./lib/trainSim";

export default function App() {
  const [arrivals, setArrivals] = useState([]);
  const [departures, setDepartures] = useState([]);
  const [tab, setTab] = useState("arrivals");

  useEffect(() => {
    const arr = generateTrains(12, 20); // evening schedule
    const dep = generateTrains(12, 6);  // morning schedule
    setArrivals(arr);
    setDepartures(dep);
  }, []);

  return (
    <div className="hud-grid min-h-dvh">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-bg/90 backdrop-blur border-b border-outline px-4 py-3 text-center">
        <h1 className="font-display tracking-widest text-2xl text-neon neon-text">
          東京メトロ
        </h1>
        <p className="text-subtext text-xs">Next Arrivals — Mobile First</p>
      </header>

      {/* Tabs */}
      <div className="flex justify-center mt-4 gap-2">
        <button
          className={`px-4 py-2 rounded-xl ${
            tab === "arrivals"
              ? "bg-[var(--neon-cyan)] text-black font-bold"
              : "bg-[var(--color-panel)] text-subtext"
          }`}
          onClick={() => setTab("arrivals")}
        >
          Arrivals
        </button>
        <button
          className={`px-4 py-2 rounded-xl ${
            tab === "departures"
              ? "bg-[var(--neon-cyan)] text-black font-bold"
              : "bg-[var(--color-panel)] text-subtext"
          }`}
          onClick={() => setTab("departures")}
        >
          Departures
        </button>
      </div>

      {/* Boards */}
      <main className="mx-auto max-w-screen-xl px-4 py-6">
        {tab === "arrivals" && <TrainBoard trains={arrivals} type="arrivals" />}
        {tab === "departures" && (
          <TrainBoard trains={departures} type="departures" />
        )}
      </main>
    </div>
  );
}

