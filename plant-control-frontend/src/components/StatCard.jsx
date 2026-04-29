export default function StatCard({ label, value, icon, tone = 'emerald', helper }) {
  const tones = {
    emerald: 'bg-emerald-50 text-emerald-700 ring-emerald-100',
    amber: 'bg-amber-50 text-amber-700 ring-amber-100',
    red: 'bg-red-50 text-red-700 ring-red-100',
    sky: 'bg-sky-50 text-sky-700 ring-sky-100',
    slate: 'bg-slate-50 text-slate-700 ring-slate-100',
  };

  return (
    <article className="rounded-3xl border border-white bg-white p-5 shadow-sm shadow-emerald-950/5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-500">{label}</p>
          <p className="mt-3 text-3xl font-bold tracking-tight text-slate-950">{value ?? 0}</p>
        </div>
        <span className={`inline-flex h-11 w-11 items-center justify-center rounded-2xl text-sm font-bold ring-1 ${tones[tone]}`}>
          {icon}
        </span>
      </div>
      {helper && <p className="mt-4 text-xs font-medium text-slate-400">{helper}</p>}
    </article>
  );
}
