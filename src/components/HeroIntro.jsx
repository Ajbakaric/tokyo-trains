// src/components/HeroIntro.jsx
// A transparent spacer at the top that shows a title and lets content scroll over the fixed video.

export default function HeroIntro() {
  return (
    <section className="hero-intro">
      <div className="hero-intro-inner">
        <h1 className="font-display text-3xl sm:text-4xl text-neon neon-text tracking-widest">
          東京メトロ
        </h1>
        <p className="text-subtext text-lg sm:text-xl  tracking-wide">
          Live Tokyo transit board • Cyberpunk HUD
        </p>
      </div>
      {/* Optional subtle gradient at the bottom edge for readability transition */}
      <div className="hero-intro-fade" />
    </section>
  );
}
