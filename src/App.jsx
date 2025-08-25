// src/App.jsx
import { useEffect, useState, useMemo } from "react";
import TrainBoard from "./components/TrainBoard";
import { generateTrains } from "./lib/trainSim";

// Icons (adjust filenames to what you actually saved)
import boardingIcon from "./assets/boarding.png";    // <-- if you don't have this yet, delete this line
import departuresIcon from "./assets/departures.png";

export default function App() {
  const [arrivals, setArrivals] = useState([]);
  const [departures, setDepartures] = useState([]);
  const [tab, setTab] = useState("boarding"); // default to Boarding

  useEffect(() => {
    const arr = generateTrains(20, 20); // evening arrivals
    const dep = generateTrains(20, 6);  // morning departures

    // Demo: force two to be "boarding now" so you can see animation immediately
    const now = Date.now();
    if (arr[0]) { arr[0].delayedEpoch = now;         arr[0].status = "Boarding"; }
    if (arr[1]) { arr[1].delayedEpoch = now + 5000;  arr[1].status = "Boarding"; }

    setArrivals(arr);
    setDepartures(dep);
  }, []);

  // Boarding view = arrivals with <= 1m remaining, always keep 2–4 visible
  const boarding = useMemo(() => {
    const soon = arrivals.filter(t => t.delayedEpoch - Date.now() <= 60_000);
    const out = soon.slice(0, 4);
    // ensure minimum of 2 visible by topping up with the next arrivals
    let i = 0;
    while (out.length < 2 && i < arrivals.length) {
      const candidate = arrivals[i++];
      if (!out.find(x => x.id === candidate.id)) out.push(candidate);
    }
    return out;
  }, [arrivals]);

  function TabButton({ active, onClick, icon, children }) {
    return (
      <button
        onClick={onClick}
        className={
          "flex items-center gap-2 px-4 py-2 rounded-xl border transition " +
          (active
            ? "bg-[var(--neon-cyan)] text-black border-transparent shadow-[0_0_8px_rgba(0,209,255,.6)]"
            : "bg-[var(--color-panel)] text-subtext border-outline/60 hover:border-outline")
        }
      >
        <img
          src={icon}
          alt=""
          className={active ? "w-5 h-5 drop-shadow-[0_0_6px_#00D1FF]" : "w-5 h-5 opacity-80"}
        />
        <span className="font-semibold">{children}</span>
      </button>
    );
  }

  return (
    <div className="hud-grid min-h-dvh">
      <header className="sticky top-0 z-10 bg-bg/90 backdrop-blur border-b border-outline px-4 py-3 text-center">
        <h1 className="font-display tracking-widest text-2xl text-neon neon-text">東京メトロ</h1>
        <p className="text-subtext text-xs">Train Simulation Board</p>
      </header>

      {/* Tabs */}
      <div className="flex justify-center mt-4 gap-2">
        <TabButton
          active={tab === "boarding"}
          onClick={() => setTab("boarding")}
          icon={boardingIcon}
        >
          Boarding
        </TabButton>

        <TabButton
          active={tab === "arrivals"}
          onClick={() => setTab("arrivals")}
          icon={typeof arrivalsIcon !== "undefined" ? arrivalsIcon : boardingIcon /* fallback */}
        >
          Arrivals
        </TabButton>

        <TabButton
          active={tab === "departures"}
          onClick={() => setTab("departures")}
          icon={departuresIcon}
        >
          Departures
        </TabButton>
      </div>

      {/* Boards */}
      <main className="mx-auto max-w-screen-xl px-4 py-6">
        {tab === "boarding"   && <TrainBoard trains={boarding}   setTrains={setArrivals} type="boarding" />}
        {tab === "arrivals"   && <TrainBoard trains={arrivals}   type="arrivals" />}
        {tab === "departures" && <TrainBoard trains={departures} type="departures" />}
      </main>
    </div>
  );
}
