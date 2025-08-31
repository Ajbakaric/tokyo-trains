// Robust ambient audio singleton with autoplay + user-gesture fallback
const KEY = "tb_audio_enabled";

function once(el, ev, fn) {
  const h = (...args) => { el.removeEventListener(ev, h, true); fn(...args); };
  el.addEventListener(ev, h, true);
  return () => el.removeEventListener(ev, h, true);
}

class AudioManager {
  constructor() {
    // default ON unless user explicitly disabled
    this.wantEnabled = true;
    try {
      const saved = localStorage.getItem(KEY);
      if (saved === "0") this.wantEnabled = false;
    } catch {}
    this.el = null;
    this._onState = new Set(); // listeners
  }

  ensure() {
    if (this.el) return this.el;

    const a = document.createElement("audio");

    // Multiple sources for compatibility
    const s1 = document.createElement("source");
    s1.src = "/audio/ambient.mp3"; s1.type = "audio/mpeg";
    const s2 = document.createElement("source");
    s2.src = "/audio/ambient.ogg"; s2.type = "audio/ogg";
    a.appendChild(s1); a.appendChild(s2);

    a.loop = true;
    a.autoplay = true;        // hint browsers
    a.playsInline = true;     // iOS inline
    a.preload = "auto";
    a.muted = false;
    a.volume = 0.18;

    a.addEventListener("playing", () => this._emit(true));
    a.addEventListener("pause",   () => this._emit(false));
    a.addEventListener("ended",   () => this._emit(false));

    document.body.appendChild(a);
    this.el = a;
    return a;
  }

  _emit(isOn) { this._onState.forEach(fn => fn(isOn)); }

  onChange(fn) { this._onState.add(fn); return () => this._onState.delete(fn); }

  isActuallyPlaying() {
    const a = this.ensure();
    return !a.paused && !a.ended && a.currentTime > 0;
  }

  async play() {
    const a = this.ensure();
    try {
      await a.play();
      this.wantEnabled = true;
      try { localStorage.setItem(KEY, "1"); } catch {}
      this._emit(true);
      return true;
    } catch {
      // Autoplay blocked; leave wantEnabled as-is (true),
      // listeners will unlock on first user gesture.
      this._emit(false);
      return false;
    }
  }

  pause() {
    const a = this.ensure();
    a.pause();
    this.wantEnabled = false;
    try { localStorage.setItem(KEY, "0"); } catch {}
    this._emit(false);
  }

  toggle() { return this.isActuallyPlaying() ? (this.pause(), false) : this.play(); }

  setVolume(v) {
    const a = this.ensure();
    a.volume = Math.min(1, Math.max(0, v));
  }

  /**
   * Boot: try autoplay now; if blocked, arm a one-time gesture
   * (click/touchstart/keydown) to start immediately without user
   * needing to press the toggle.
   */
  async boot() {
    if (!this.wantEnabled) { this.pause(); return; }
    const ok = await this.play();
    if (ok) return;

    // Arm a one-time unlock on first gesture
    const unlock = async () => { await this.play(); };
    const off1 = once(window, "pointerdown", unlock);
    const off2 = once(window, "keydown",     unlock);
    const off3 = once(window, "touchstart",  unlock);
    // Clean up after we succeed
    const cancelOnPlaying = () => {
      if (this.isActuallyPlaying()) { off1(); off2(); off3(); window.removeEventListener("playing", cancelOnPlaying, true); }
    };
    window.addEventListener("playing", cancelOnPlaying, true);
  }
}

export const audio = new AudioManager();
