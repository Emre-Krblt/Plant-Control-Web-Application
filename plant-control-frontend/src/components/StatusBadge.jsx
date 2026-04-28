const statusStyles = {
  NORMAL: 'bg-emerald-100 text-emerald-800 ring-emerald-200',
  WARNING: 'bg-amber-100 text-amber-800 ring-amber-200',
  CRITICAL: 'bg-red-100 text-red-800 ring-red-200',
  NO_DATA: 'bg-slate-100 text-slate-700 ring-slate-200',
  INACTIVE: 'bg-slate-100 text-slate-700 ring-slate-200',
  INFO: 'bg-sky-100 text-sky-800 ring-sky-200',
  ACTIVE: 'bg-emerald-100 text-emerald-800 ring-emerald-200',
  RESOLVED: 'bg-slate-100 text-slate-700 ring-slate-200',
  IGNORED: 'bg-slate-100 text-slate-700 ring-slate-200',
};

export default function StatusBadge({ value }) {
  const label = value || 'NO_DATA';
  const classes = statusStyles[label] || statusStyles.NO_DATA;

  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${classes}`}>
      {label.replaceAll('_', ' ')}
    </span>
  );
}
