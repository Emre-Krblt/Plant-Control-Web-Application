export default function EmptyState({ title, message, action }) {
  return (
    <div className="rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/50 p-6 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-lg font-bold text-emerald-700 shadow-sm shadow-emerald-950/5">
        PC
      </div>
      <h3 className="mt-4 text-base font-bold text-slate-950">{title}</h3>
      {message && <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">{message}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
