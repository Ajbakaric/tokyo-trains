// Slower, more staggered train generator (+ ~15m overall horizon)
// and lightweight delays to keep variety.

export const LINES = [
  { code: "G", nameJP: "銀座線",       nameEN: "Ginza Line",       color: "#ff9500" },
  { code: "M", nameJP: "丸ノ内線",     nameEN: "Marunouchi Line",  color: "#e60012" },
  { code: "H", nameJP: "日比谷線",     nameEN: "Hibiya Line",      color: "#b5b5ac" },
  { code: "T", nameJP: "東西線",       nameEN: "Tozai Line",       color: "#00b5e2" },
  { code: "C", nameJP: "千代田線",     nameEN: "Chiyoda Line",     color: "#00bb85" },
  { code: "Y", nameJP: "有楽町線",     nameEN: "Yurakucho Line",   color: "#c1ab05" },
  { code: "Z", nameJP: "半蔵門線",     nameEN: "Hanzomon Line",    color: "#8f76d6" },
  { code: "N", nameJP: "南北線",       nameEN: "Namboku Line",     color: "#00ac9b" },
  { code: "F", nameJP: "副都心線",     nameEN: "Fukutoshin Line",  color: "#b77f00" },
];

const DESTS = [
  ["渋谷","Shibuya"],["浅草","Asakusa"],["銀座","Ginza"],["表参道","Omotesando"],
  ["赤坂見附","Akasaka-mitsuke"],["池袋","Ikebukuro"],["新宿三丁目","Shinjuku-sanchome"],
  ["北千住","Kita-Senju"],["中目黒","Naka-Meguro"],["目黒","Meguro"],
  ["清澄白河","Kiyosumi-shirakawa"],["押上","Oshiage"],["中野","Nakano"],["飯田橋","Iidabashi"]
];
const PLATFORMS = [1,2,3,4,5,6];

function rand(min,max){ return Math.random()*(max-min)+min; }
function choice(a){ return a[Math.floor(Math.random()*a.length)]; }
function id(){ return Math.random().toString(36).slice(2,10); }

export function formatTime(epoch){
  return new Date(epoch).toLocaleTimeString("en-US",{hour:"numeric",minute:"2-digit"});
}

/**
 * Generate trains with a longer horizon (default ~27m), still with some near arrivals.
 * @param {number} count
 * @param {number} horizonMin  upper bound for ETA minutes (default 27)
 * @param {{startOffsetMin?:number, departures?:boolean}} opts
 */
export function generateTrains(count=24, horizonMin=27, opts={}){
  const now = Date.now();
  const startOffsetMin = opts.startOffsetMin ?? 0;
  const departures = !!opts.departures;

  const items = [];
  for (let i=0;i<count;i++){
    const line = choice(LINES);
    const [destJP,destEN] = choice(DESTS);
    const platform = choice(PLATFORMS);

    // Distribution (slower & more staggered):
    // 20% within 0–1 min, 50% within 1–8 min, 30% within 8–horizonMin
    let etaMin;
    const r = Math.random();
    if (r < 0.20) etaMin = rand(0, 1);
    else if (r < 0.70) etaMin = rand(1, Math.min(8, horizonMin));
    else etaMin = rand(8, horizonMin);

    // add jitter so cards don't sync
    const etaMs = (startOffsetMin + etaMin) * 60_000 + rand(0, 12_000);

    // small delay chance (0–2m)
    const delayMin = Math.random() < 0.35 ? Math.round(rand(0,2)) : 0;
    const delayedEpoch = now + etaMs + delayMin*60_000;

    items.push({
      id: id(),
      line: line.nameJP,
      lineEN: line.nameEN,
      lineCode: line.code,
      lineColor: line.color,
      destinationJP: destJP,
      destinationEN: destEN,
      platform,
      eta: formatTime(delayedEpoch),
      delayedEpoch,
      delayMin,
      status: "On time",
      kind: departures ? "departure" : "arrival",
    });
  }

  items.sort((a,b)=>a.delayedEpoch-b.delayedEpoch);
  return items;
}
