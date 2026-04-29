export default function LoadingSpinner({ label = 'Loading...' }) {
  return (
    <div className="flex min-h-48 items-center justify-center rounded-3xl border border-white bg-white/80 p-8 shadow-sm shadow-emerald-950/5">
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-100 border-t-emerald-700" />
      <span className="ml-3 text-sm font-semibold text-emerald-800">{label}</span>
    </div>
  );
}
