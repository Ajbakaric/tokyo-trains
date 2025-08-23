// src/lib/metroCatalog.js
const ORG_PATH =
  "/metro/api/t131202d3100000006-2c070de3ed8892d8988620a1e996cd57-0/json"; // ✅ exact match

export async function fetchOrganizationInfo({ limit = 5, body = {} } = {}) {
  const url = `${ORG_PATH}?limit=${encodeURIComponent(limit)}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify(body || {}), // required, {} is fine
  });

  // be tolerant: upstream 404/HTML shouldn’t crash the UI
  const text = await res.text();
  if (!res.ok) throw new Error(`Upstream ${res.status}: ${text.slice(0,120)}`);

  try { return JSON.parse(text); } catch { return text; }
}
