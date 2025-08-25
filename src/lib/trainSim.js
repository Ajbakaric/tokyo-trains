// src/lib/trainSim.js
import { minutesUntilJST } from "./time";

/** Tokyo Metro line colors (approx) */
export const LINE_COLORS = {
  G: "#FF9500", // Ginza
  M: "#E60012", // Marunouchi
  H: "#B5B5AC", // Hibiya
  T: "#009BBF", // Tozai
  C: "#00BB85", // Chiyoda
  Y: "#C1A470", // Yurakucho
  Z: "#8F76D6", // Hanzomon
  N: "#00AC9B", // Namboku
  F: "#9C5E31", // Fukutoshin
};

export const LINES = [
  { code: "G", jp: "銀座線", en: "Ginza", stations: ["浅草","上野","末広町","銀座","新橋","虎ノ門","渋谷"], stationsEN: ["Asakusa","Ueno","Suehirocho","Ginza","Shimbashi","Toranomon","Shibuya"] },
  { code: "M", jp: "丸ノ内線", en: "Marunouchi", stations: ["池袋","後楽園","御茶ノ水","東京","銀座","霞ヶ関","新宿三丁目","新宿"], stationsEN: ["Ikebukuro","Korakuen","Ochanomizu","Tokyo","Ginza","Kasumigaseki","Shinjuku-sanchome","Shinjuku"] },
  { code: "H", jp: "日比谷線", en: "Hibiya", stations: ["北千住","上野","秋葉原","霞ケ関","六本木","中目黒"], stationsEN: ["Kitasenju","Ueno","Akihabara","Kasumigaseki","Roppongi","Naka-meguro"] },
  { code: "T", jp: "東西線", en: "Tozai", stations: ["中野","高田馬場","早稲田","飯田橋","大手町","門前仲町","西船橋"], stationsEN: ["Nakano","Takadanobaba","Waseda","Iidabashi","Otemachi","Monzen-nakacho","Nishi-Funabashi"] },
  { code: "C", jp: "千代田線", en: "Chiyoda", stations: ["代々木上原","表参道","大手町","北千住","我孫子"], stationsEN: ["Yoyogi-uehara","Omotesando","Otemachi","Kitasenju","Abiko"] },
  { code: "Y", jp: "有楽町線", en: "Yurakucho", stations: ["和光市","池袋","有楽町","豊洲","新木場"], stationsEN: ["Wakoshi","Ikebukuro","Yurakucho","Toyosu","Shin-Kiba"] },
  { code: "Z", jp: "半蔵門線", en: "Hanzomon", stations: ["渋谷","表参道","永田町","大手町","押上"], stationsEN: ["Shibuya","Omotesando","Nagatacho","Otemachi","Oshiage"] },
  { code: "N", jp: "南北線", en: "Namboku", stations: ["目黒","白金高輪","溜池山王","後楽園","赤羽岩淵"], stationsEN: ["Meguro","Shirokane-takanawa","Tameike-sanno","Korakuen","Akabane-iwabuchi"] },
  { code: "F", jp: "副都心線", en: "Fukutoshin", stations: ["和光市","池袋","新宿三丁目","渋谷"], stationsEN: ["Wakoshi","Ikebukuro","Shinjuku-sanchome","Shibuya"] },
];

function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

/** Generate fake trains for both arrivals & departures. */
export function generateTrains(count = 24, startHour = 6) {
  const trains = [];
  const now = new Date(new Date().toLocaleString("en-US", { timeZone: "Asia/Tokyo" }));
  let t = new Date(now);
  t.setHours(startHour, 0, 0, 0);

  for (let i = 0; i < count; i++) {
    // Stagger 2–15 minutes
    const gapMin = 2 + Math.floor(Math.random() * 14);
    t = new Date(t.getTime() + gapMin * 60000);

    const line = pick(LINES);
    const idx = Math.floor(Math.random() * line.stations.length);
    const destJP = line.stations[idx];
    const destEN = line.stationsEN[idx];

    const delayMin = Math.random() < 0.22 ? Math.floor(Math.random() * 6) : 0;
    const delayedEpoch = t.getTime() + delayMin * 60000;

    const etaLabel = t.toLocaleTimeString("en-US", {
      hour: "numeric", minute: "2-digit", hour12: true, timeZone: "Asia/Tokyo",
    });

    trains.push({
      id: `T-${Date.now()}-${i}-${Math.random().toString(36).slice(2,6)}`,
      line: `${line.jp} / ${line.en} Line`,
      lineCode: line.code,
      destinationJP: destJP,
      destinationEN: destEN,
      platform: 1 + Math.floor(Math.random() * 4),
      eta: etaLabel,
      delayedEpoch,
      delayMin,
      status: delayMin > 0 ? `Delayed +${delayMin}m` : "On time",
      lineColor: LINE_COLORS[line.code],
      minutesAway:
        minutesUntilJST(
          t.toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Asia/Tokyo" })
        ) + delayMin,
    });
  }

  return trains;
}

// explicit exports (for App.jsx imports)
export { generateTrains as default };
