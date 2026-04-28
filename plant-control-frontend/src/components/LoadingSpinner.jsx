export default function LoadingSpinner({ label = 'Loading...' }) {
  return (
    <div className="flex items-center gap-3 text-sm font-medium text-emerald-800">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-emerald-200 border-t-emerald-700" />
      <span>{label}</span>
    </div>
  );
}
