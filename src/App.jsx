import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import HeroSpline from "./components/HeroSpline";
import TrainBoard from "./components/TrainBoard";
import Filters from "./components/Filters";
import AlertsRibbon from "./components/AlertsRibbon";
import { generateTrains, LINES } from "./lib/trainSim";
import { LANGS } from "./lib/i18n";
import AudioToggle from "./components/AudioToggle";

export default function App() {
  const [arrivals, setArrivals] = useState([]);
  const [departures, setDepartures] = useState([]);
  const [tab, setTab] = useState(() => localStorage.getItem("tb_tab") || "boarding");
  const [lang, setLang] = useState(() => localStorage.getItem("tb_lang") || "en");
  const [asOf, setAsOf] = useState(() => new Date());
  const [pulse, setPulse] = useState(false);
  const [lineFilter, setLineFilter] = useState(() => {
    try { const raw = localStorage.getItem("tb_lines"); return raw ? new Set(JSON.parse(raw)) : new Set(); }
    catch { return new Set(); }
  });
  const [alerts] = useState([{ header: "Ginza Line delays near Shimbashi (+5m)" }]);

  // Seed (longer horizon)
  useEffect(() => {
    // Arrivals: horizon ~27m (slower pacing)
    const arr = generateTrains(28, 27);
    // Departures: horizon ~30m, slightly offset into the future
    const dep = generateTrains(22, 30, { departures: true, startOffsetMin: 2 });

    // Force a couple of immediate boardings so you can observe the left-exit
    const now = Date.now();
    for (let i=0; i<Math.min(2, arr.length); i++){
      arr[i].delayedEpoch = now + i*1500; // 0s, 1.5s
      arr[i].eta = new Date(arr[i].delayedEpoch).toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit"});
      arr[i].status = "Boarding";
    }

    setArrivals(arr);
    setDepartures(dep);
  }, []);

  // Clock + pulse
  useEffect(() => {
    const id = setInterval(() => {
      const d = new Date();
      setAsOf(d);
      setPulse(d.getSeconds() === 0);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => { try { localStorage.setItem("tb_tab", tab); } catch {} }, [tab]);
  useEffect(() => { try { localStorage.setItem("tb_lang", lang); } catch {} }, [lang]);

  // Shortcuts
  useEffect(() => {
    function onKey(e){ if (e.key==="1") setTab("boarding"); if (e.key==="2") setTab("arrivals"); if (e.key==="3") setTab("departures"); }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const tabs = [
    { id: "boarding", label: "Boarding" },
    { id: "arrivals", label: "Arrivals" },
    { id: "departures", label: "Departures" },
  ];
  const lineCodes = useMemo(() => LINES.map(l=>l.code), []);

  function applyFilter(list){
    if (!lineFilter.size) return list;
    return list.filter(t => lineFilter.has(t.lineCode));
  }

  // BOARDING: show more items (<= 90s), then top up to 6
  const boarding = useMemo(() => {
    const soon = arrivals.filter(t => t.delayedEpoch - Date.now() <= 90_000);
    const prime = applyFilter(soon);
    const out = [...prime].sort((a,b)=>a.delayedEpoch-b.delayedEpoch).slice(0, 6);

    if (out.length < 6) {
      const pool = applyFilter(arrivals).sort((a,b)=>a.delayedEpoch-b.delayedEpoch);
      for (const c of pool) {
        if (out.length >= 6) break;
        if (!out.find(x => x.id === c.id)) out.push(c);
      }
    }
    return out;
  }, [arrivals, lineFilter]);

  const filteredArrivals   = useMemo(() => applyFilter(arrivals),   [arrivals, lineFilter]);
  const filteredDepartures = useMemo(() => applyFilter(departures), [departures, lineFilter]);

  return (
    <div className="hud-grid min-h-dvh">
      {/* Spline hero */}
      <HeroSpline />

      {/* Transparent slim sticky controls bar */}
      <header className="sticky top-0 z-20 bg-transparent backdrop-blur-0 border-b border-transparent px-4 py-2">
        <div className="mx-auto max-w-screen-xl flex items-center justify-between gap-3">
          <p className={`text-[10px] text-subtext transition-shadow ${pulse ? "shadow-[0_0_6px_#00D1FF]" : ""}`}>
            基準時刻 / As of: {asOf.toLocaleTimeString("ja-JP", { hour12: false })} JST
          </p>
          <div className="flex items-center gap-3">
            <AudioToggle />
            {LANGS.map(l => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-2 py-1 rounded ${lang===l ? "bg-[var(--color-neon)] text-black" : "bg-[var(--color-panel)] text-subtext"}`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Alerts */}
      <AlertsRibbon alerts={alerts} />

      {/* Tabs */}
      <div className="flex justify-center mt-4">
        <div className="relative inline-flex gap-6">
          {tabs.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} className="relative py-2">
              <span className={tab===t.id ? "text-neon" : "text-subtext"}>{t.label}</span>
              {tab===t.id && (
                <motion.div
                  layoutId="tab-underline"
                  className="absolute left-0 right-0 -bottom-1 h-[2px] bg-[var(--color-neon)] shadow-[0_0_8px_#FFD300]"
                />
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Filters (sticky chip bar styles applied in your CSS) */}
      <div className="mx-auto max-w-screen-xl px-4">
        <Filters allCodes={lineCodes} active={lineFilter} setActive={setLineFilter} />
      </div>

      {/* Boards */}
      <main className="mx-auto max-w-screen-xl px-4 pb-10">
        {tab==="boarding" && (
          <TrainBoard trains={boarding} type="boarding" setTrains={setArrivals} lang={lang} />
        )}
        {tab==="arrivals" && (
          <TrainBoard trains={filteredArrivals} type="arrivals" lang={lang} />
        )}
        {tab==="departures" && (
          <TrainBoard trains={filteredDepartures} type="departures" lang={lang} />
        )}
      </main>
    </div>
  );
}
