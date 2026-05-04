const tones = {
  success: { bg: "linear-gradient(135deg,#22c55e,#15803d)", icon: "fa-circle-check" },
  danger:  { bg: "linear-gradient(135deg,#ef4444,#b91c1c)", icon: "fa-circle-xmark" },
  info:    { bg: "linear-gradient(135deg,#6366f1,#4f46e5)", icon: "fa-circle-info" },
};

export default function Toast({ message, tone = "success" }) {
  if (!message) return null;
  const t = tones[tone] || tones.success;

  return (
    <div
      className="animate-fade-down"
      style={{
        position: "fixed",
        top: 24,
        left: "50%",
        transform: "translateX(-50%)",
        background: t.bg,
        color: "#fff",
        padding: "14px 28px",
        borderRadius: 999,
        fontWeight: 700,
        fontSize: 14,
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        gap: 10,
        boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
        whiteSpace: "nowrap",
      }}
    >
      <i className={`fas ${t.icon}`} />
      {message}
    </div>
  );
}
