// src/components/SkeletonCard.jsx
export default function SkeletonCard(){
  return (
    <div className="card p-4 animate-pulse">
      <div className="h-5 w-24 bg-white/10 rounded mb-3" />
      <div className="h-4 w-40 bg-white/10 rounded mb-2" />
      <div className="h-8 w-28 bg-white/10 rounded" />
    </div>
  );
}
