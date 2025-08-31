import { useEffect, useState } from "react";
import { audio } from "../lib/audio";

export default function AudioToggle() {
  const [on, setOn] = useState(audio.isActuallyPlaying());
  const [vol, setVol] = useState(0.18);

  // Boot on mount: attempt autoplay now; if blocked, arms one-time unlock on first gesture.
  useEffect(() => {
    audio.boot();
    const off = audio.onChange(setOn);
    return off;
  }, []);

  useEffect(() => { audio.setVolume(vol); }, [vol]);

  async function handleToggle() {
    const nowOn = await audio.toggle();
    setOn(nowOn);
  }

  return (
    <div className="flex items-center gap-2">
      <button
        onClick={handleToggle}
        className={`px-2 py-1 rounded border transition
          ${on
            ? "bg-[var(--color-neon)] text-black border-transparent"
            : "bg-[var(--color-panel)] text-subtext border border-outline"}`}
        title={on ? "Mute" : "Enable audio"}
      >
        {on ? "🔊 Audio" : "🔇 Audio"}
      </button>

      {on && (
        <input
          type="range" min="0" max="1" step="0.01"
          value={vol}
          onChange={e => {
            const v = parseFloat(e.target.value);
            setVol(v);
            audio.setVolume(v);
          }}
          className="w-24 accent-[var(--color-neon)]"
          aria-label="Volume"
        />
      )}
    </div>
  );
}
