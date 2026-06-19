export function MetricCard({ icon: Icon, label, value, body }: { icon: React.ElementType; label: string; value: string; body: string }) {
  return (
    <section className="border border-slate-200 bg-white p-5 shadow-sm">
      <Icon className="size-6 text-teal-700" aria-hidden="true" />
      <p className="mt-5 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="mt-2 font-display text-4xl font-black tracking-[-0.04em]">{value}</p>
      <p className="mt-2 text-sm text-slate-600">{body}</p>
    </section>
  );
}

export function AdminPanel({ id, title, icon: Icon, children }: { id?: string; title: string; icon: React.ElementType; children: React.ReactNode }) {
  return (
    <section id={id} className="border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-center gap-3 border-b border-slate-200 pb-4">
        <Icon className="size-5 text-teal-700" aria-hidden="true" />
        <h2 className="font-semibold">{title}</h2>
      </div>
      {children}
    </section>
  );
}

export function AdminPageHeader({ eyebrow, title, body }: { eyebrow: string; title: string; body: string }) {
  return (
    <div className="mb-8 border border-slate-200 bg-white p-6 shadow-sm">
      <p className="text-sm font-semibold uppercase tracking-[0.2em] text-teal-700">{eyebrow}</p>
      <h1 className="mt-3 font-display text-4xl font-black tracking-[-0.04em]">{title}</h1>
      <p className="mt-2 max-w-2xl text-slate-600">{body}</p>
    </div>
  );
}
