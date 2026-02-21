export default function Screen({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-md px-4 pb-28 pt-6">
      <header className="mb-4">
        <h1 className="text-xl font-semibold tracking-tight">{title}</h1>
        {subtitle ? (
          <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
            {subtitle}
          </p>
        ) : null}
      </header>

      <div
        className="rounded-3xl border p-4 backdrop-blur-xl"
        style={{
          background: "var(--card)",
          borderColor: "var(--border)",
          boxShadow: "var(--shadow)",
        }}
      >
        {children}
      </div>
    </div>
  );
}