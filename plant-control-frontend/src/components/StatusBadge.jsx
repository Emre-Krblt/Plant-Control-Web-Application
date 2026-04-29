const statusStyles = {
  NORMAL: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  WARNING: 'bg-amber-50 text-amber-700 ring-amber-200',
  CRITICAL: 'bg-red-50 text-red-700 ring-red-200',
  NO_DATA: 'bg-slate-100 text-slate-700 ring-slate-200',
  INACTIVE: 'bg-slate-100 text-slate-700 ring-slate-200',
  INFO: 'bg-sky-50 text-sky-700 ring-sky-200',
  ACTIVE: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  RESOLVED: 'bg-slate-100 text-slate-700 ring-slate-200',
  IGNORED: 'bg-slate-100 text-slate-700 ring-slate-200',
  CONNECTED: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  DISCONNECTED: 'bg-red-50 text-red-700 ring-red-200',
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
