// src/components/HeroVideo.jsx
// Fixed, full-viewport video that stays behind all content.

export default function HeroVideo({
  src = "/hero.mp4",
  webm = "/hero.webm",          // optional
  poster = "/hero-poster.jpg",  // optional
}) {
  return (
    <section className="bg-video">
     <video
        className="bg-video-el"
        autoPlay
        loop
        muted
        playsInline
        disablePictureInPicture    // ✅ disables PiP icon
        controls={false}           // ✅ no controls
        controlsList="nodownload nofullscreen noremoteplayback" // ✅ block other UIs
        >
        <source src={src} type="video/mp4" />
        {webm && <source src={webm} type="video/webm" />}
        Your browser does not support the video tag.
       </video>
      <div className="bg-video-fx" />
    </section>
  );
}
