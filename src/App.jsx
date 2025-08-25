// src/App.jsx
import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import TrainBoard from "./components/TrainBoard";
import Filters from "./components/Filters";
import AlertsRibbon from "./components/AlertsRibbon";
import { generateTrains, LINES, LINE_COLORS } from "./lib/trainSim";
import { LANGS } from "./lib/i18n";

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

  // seed data
  useEffect(() => {
    const arr = generateTrains(24, 20); // evening arrivals
    const dep = generateTrains(18, 6);  // morning departures
    const now = Date.now();
    if (arr[0]) { arr[0].delayedEpoch = now;       arr[0].status = "Boarding"; }
    if (arr[1]) { arr[1].delayedEpoch = now + 5000; arr[1].status = "Boarding"; }
    setArrivals(arr);
    setDepartures(dep);
  }, []);

  // sticky clock + minute pulse
  useEffect(() => {
    const id = setInterval(() => {
      const d = new Date();
      setAsOf(d);
      setPulse(d.getSeconds() === 0);
    }, 1000);
    return () => clearInterval(id);
  }, []);

  // persist tab/lang
  useEffect(() => { try { localStorage.setItem("tb_tab", tab); } catch {} }, [tab]);
  useEffect(() => { try { localStorage.setItem("tb_lang", lang); } catch {} }, [lang]);

  // keyboard shortcuts: 1/2/3 switch tabs
  useEffect(() => {
    function onKey(e) {
      if (e.key === "1") setTab("boarding");
      if (e.key === "2") setTab("arrivals");
      if (e.key === "3") setTab("departures");
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // tabs + filters
  const tabs = [
    { id: "boarding", label: "Boarding" },
    { id: "arrivals", label: "Arrivals" },
    { id: "departures", label: "Departures" },
  ];
  const lineCodes = useMemo(() => LINES.map(l => l.code), []);
  function applyFilter(list) {
    if (!lineFilter.size) return list;
    return list.filter(t => lineFilter.has(t.lineCode));
  }

  // boarding = arrivals within 60s, top up to 2 items if needed
  const boarding = useMemo(() => {
    const soon = arrivals.filter(t => t.delayedEpoch - Date.now() <= 60_000);
    const out = applyFilter(soon).slice(0, 4);
    let i = 0;
    while (out.length < 2 && i < arrivals.length) {
      const c = arrivals[i++];
      if (!out.find(x => x.id === c.id)) out.push(c);
    }
    return out;
  }, [arrivals, lineFilter]);

  const filteredArrivals   = useMemo(() => applyFilter(arrivals),   [arrivals, lineFilter]);
  const filteredDepartures = useMemo(() => applyFilter(departures), [departures, lineFilter]);

  return (
    <div className="hud-grid min-h-dvh">
      <header className="sticky top-0 z-10 bg-bg/90 backdrop-blur border-b border-outline px-4 py-3 text-center">
        <h1 className="font-display tracking-widest text-2xl text-neon neon-text">東京メトロ</h1>
        <p className="text-subtext text-xs">Next Arrivals — Mobile First</p>
        <p className={`text-[10px] text-subtext mt-1 transition-shadow ${pulse ? "shadow-[0_0_6px_#00D1FF]" : ""}`}>
          基準時刻 / As of: {asOf.toLocaleTimeString("ja-JP", { hour12: false })} JST
        </p>

        {/* language toggle */}
        <div className="absolute right-4 top-3 flex gap-2">
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
      </header>

      <AlertsRibbon alerts={alerts} />

      {/* Tabs with animated underline */}
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

      {/* Filters */}
      <div className="mx-auto max-w-screen-xl px-4">
        <Filters allCodes={lineCodes} active={lineFilter} setActive={setLineFilter} />
      </div>

      {/* Boards */}
      <main className="mx-auto max-w-screen-xl px-4 pb-10">
        {tab === "boarding"   && <TrainBoard trains={boarding}           type="boarding"   setTrains={setArrivals} lang={lang} />}
        {tab === "arrivals"   && <TrainBoard trains={filteredArrivals}   type="arrivals"   lang={lang} />}
        {tab === "departures" && <TrainBoard trains={filteredDepartures} type="departures" lang={lang} />}
      </main>
    </div>
  );
}
