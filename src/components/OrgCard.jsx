import { translate } from "../utils/jpToEn";

export default function OrgCard({ group }) {
  const { nameJP, deptJP, sectionJP, address, units } = group;

  return (
    <li className="card p-4 sm:p-5 mb-4">
      {/* Municipality */}
      <div className="font-semibold text-lg">
        {nameJP}
        <div className="text-xs text-subtext/80">{translate(nameJP)}</div>
      </div>

      {/* Dept */}
      {deptJP && (
        <div className="mt-2 text-base">
          {deptJP}
          <div className="text-xs text-subtext/80">{translate(deptJP)}</div>
        </div>
      )}

      {/* Section */}
      {sectionJP && (
        <div className="mt-1 text-sm">
          {sectionJP}
          <div className="text-xs text-subtext/80">{translate(sectionJP)}</div>
        </div>
      )}

      {/* Divider */}
      <div className="connector my-3" />

      {/* Address */}
      <div className="text-xs sm:text-sm text-subtext mb-2">
        <span className="uppercase tracking-wide text-[10px] sm:text-xs text-subtext/70 block mb-1">
          所在地 / Address
        </span>
        <div>{address || "—"}</div>
      </div>

      {/* Units */}
      {units?.length > 0 && (
        <div className="text-xs sm:text-sm text-subtext">
          <div className="uppercase tracking-wide text-[10px] sm:text-xs text-subtext/70 mb-1">
            係 / Units
          </div>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {units.map((u) => (
              <li key={u}>
                <div>{u}</div>
                <div className="text-[10px] text-subtext/70">{translate(u)}</div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </li>
  );
}
