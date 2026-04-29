export default function SectionCard({ title, subtitle, action, children, className = '' }) {
  return (
    <section className={`rounded-3xl border border-white bg-white p-5 shadow-sm shadow-emerald-950/5 sm:p-6 ${className}`}>
      {(title || subtitle || action) && (
        <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
          <div>
            {title && <h2 className="text-lg font-bold text-slate-950">{title}</h2>}
            {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      {children}
    </section>
  );
}
