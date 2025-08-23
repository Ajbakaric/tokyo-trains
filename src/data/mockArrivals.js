export const arrivals = [
  {
    id: "GZ-1201",
    line: "銀座線",
    lineCode: "G",
    destinationJP: "渋谷",
    destinationEN: "Shibuya",
    platform: 2,
    eta: "12:14",
    status: "On time",
    etaMin: 2, // 👈 imminent demo (optional; overrides parsing)
  },
  {
    id: "MR-0744",
    line: "丸ノ内線",
    lineCode: "M",
    destinationJP: "池袋",
    destinationEN: "Ikebukuro",
    platform: 1,
    eta: "12:18",
    status: "Delayed +3m",
  },
  {
    id: "HS-0032",
    line: "日比谷線",
    lineCode: "H",
    destinationJP: "中目黒",
    destinationEN: "Naka-meguro",
    platform: 3,
    eta: "12:25",
    status: "Cancelled",
  },
];
