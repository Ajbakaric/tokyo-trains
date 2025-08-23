import React, { useEffect, useState } from "react";
import OrgCard from "./OrgCard";

const ORG_PATH =
  "/metro/api/t131202d3100000006-2c070de3ed8892d8988620a1e996cd57-0/json";

const PAGE = 20;

export default function OrgInfo() {
  const [items, setItems] = useState([]);
  const [meta, setMeta] = useState(null);
  const [err, setErr] = useState(null);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);

  async function load() {
    try {
      setLoading(true);
      setErr(null);

      const res = await fetch(`${ORG_PATH}?limit=${PAGE}&offset=${offset}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({}), // keep body empty for now
      });

      const text = await res.text();
      if (!res.ok) throw new Error(`Upstream ${res.status}: ${text.slice(0, 200)}`);

      const json = JSON.parse(text);
      setMeta({ total: json.total, limit: json.limit, metadata: json.metadata });

      // Normalize rows into groups by dept/section/address
      const newGroups = normalize(json.hits || []);

      // Merge without duplicates
      setItems((prev) => {
        const byKey = new Map(prev.map((g) => [g.key, g]));
        for (const g of newGroups) {
          if (!byKey.has(g.key)) byKey.set(g.key, g);
        }
        return Array.from(byKey.values());
      });

      setOffset((o) => o + PAGE);
    } catch (e) {
      setErr(String(e.message || e));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  return (
    <section className="card p-4 mb-6">
      <h2 className="font-display text-neon neon-text text-xl mb-3">
        組織情報 / Organization
      </h2>

      {err && <div className="text-[var(--color-magenta)] text-sm">Error: {err}</div>}
      {!err && !items.length && <div className="text-subtext">Loading…</div>}

      {meta && (
        <div className="mb-4 rounded-2xl border border-outline/60 bg-[var(--color-bg)] p-3 text-sm">
          <div><strong>Total:</strong> {meta.total}</div>
          <div><strong>Loaded rows:</strong> {items.length}</div>
          <div><strong>Groups:</strong> {items.length}</div>
          <div><strong>Dataset:</strong> {meta.metadata?.datasetTitle}</div>
          <div className="text-subtext">{meta.metadata?.datasetDesc}</div>
        </div>
      )}

      <ul>
        {items.map((group) => (
          <OrgCard key={group.key} group={group} />
        ))}
      </ul>

      <div className="mt-4 text-center">
        {items.length < (meta?.total || 0) && (
          <button
            onClick={load}
            disabled={loading}
            className="px-4 py-2 rounded-xl border border-outline bg-bg hover:bg-panel text-sm"
          >
            {loading ? "Loading…" : "Load more"}
          </button>
        )}
      </div>
    </section>
  );
}

/**
 * Group rows by (municipality + dept + section + address)
 * Collect all units into an array.
 */
function normalize(rows) {
  const groups = new Map();

  for (const r of rows) {
    const nameJP = r["地方公共団体名"];
    const deptJP = r["部名称"];
    const sectionJP = r["課名称"];
    const address =
      r["所在地_連結表記"] ||
      [r["所在地_都道府県"], r["所在地_市区町村"], r["所在地_町字(半角)"], r["所在地_番地以下"]]
        .filter(Boolean)
        .join("");

    const key = [nameJP, deptJP, sectionJP, address].join("|");
    if (!groups.has(key)) {
      groups.set(key, {
        key,
        nameJP,
        deptJP,
        sectionJP,
        address,
        units: [],
      });
    }
    const g = groups.get(key);
    if (r["係名称"] && !g.units.includes(r["係名称"])) {
      g.units.push(r["係名称"]);
    }
  }

  return Array.from(groups.values());
}
