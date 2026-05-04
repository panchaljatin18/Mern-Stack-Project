export default function SuccessBar({ message }) {
  if (!message) return null;

  return (
    <div
      className="animate-fade-down"
      style={{
        position: "fixed",
        top: 24,
        left: "50%",
        transform: "translateX(-50%)",
        background: "linear-gradient(135deg,#22c55e,#15803d)",
        color: "#fff",
        padding: "14px 28px",
        borderRadius: 999,
        fontWeight: 700,
        fontSize: 14,
        zIndex: 99999,
        display: "flex",
        alignItems: "center",
        gap: 10,
        boxShadow: "0 8px 32px rgba(34,197,94,0.35)",
        whiteSpace: "nowrap",
      }}
    >
      <i className="fas fa-circle-check" />
      {message}
    </div>
  );
}
