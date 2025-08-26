import Spline from "@splinetool/react-spline";

export default function HeroSpline() {
  return (
    <>
      {/* Spline sits behind the top band */}
      <div className="hero-spline fixed top-0 left-0 right-0 -z-10 pointer-events-none">
        <Spline scene="/spline/scene.splinecode" />
      </div>

      {/* Spacer reserves layout height so content starts below the hero */}
      <div className="hero-spacer" />
    </>
  );
}
