export function PrimaryButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={[
        "w-full rounded-2xl px-4 py-3 text-sm font-semibold transition active:scale-[0.99]",
        props.className ?? "",
      ].join(" ")}
      style={{
        background: "linear-gradient(90deg, var(--gold), var(--rose))",
        color: "white",
        boxShadow: "0 12px 30px rgba(200,162,74,0.20)",
      }}
    />
  );
}

export function GhostButton(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={[
        "w-full rounded-2xl border px-4 py-3 text-sm font-semibold transition hover:brightness-[0.99] active:scale-[0.99]",
        props.className ?? "",
      ].join(" ")}
      style={{
        background: "rgba(255,255,255,0.60)",
        borderColor: "var(--border)",
        color: "var(--fg)",
      }}
    />
  );
}

export function Chip({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="rounded-full border px-3 py-1.5 text-xs font-medium transition hover:brightness-[0.99]"
      style={{
        background: "rgba(255,255,255,0.65)",
        borderColor: "var(--border)",
        color: "var(--fg)",
      }}
    >
      {label}
    </button>
  );
}