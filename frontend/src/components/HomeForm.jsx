export const homeFormFields = [
  { name: "houseName", label: "House Name", placeholder: "e.g. Cozy Beach Villa", icon: "fa-house" },
  { name: "price", label: "Price Per Night (₹)", placeholder: "e.g. 2500", icon: "fa-indian-rupee-sign" },
  { name: "location", label: "Location", placeholder: "e.g. Goa, India", icon: "fa-map-marker-alt" },
  { name: "rating", label: "Rating (1–5)", placeholder: "e.g. 4.5", icon: "fa-star" },
  { name: "photoUrl", label: "Photo URL", placeholder: "https://...", icon: "fa-image" },
];

export default function HomeForm({ form, onChange, onSubmit, submitLabel, showPlaceholders = true }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
      {homeFormFields.map((field, i) => (
        <div key={field.name} className={`animate-fade-up delay-${(i + 1) * 100}`}>
          <label
            style={{
              display: "block",
              fontSize: 12,
              fontWeight: 700,
              color: "#64748b",
              marginBottom: 6,
              textTransform: "uppercase",
              letterSpacing: "0.6px",
            }}
          >
            <i className={`fas ${field.icon}`} style={{ marginRight: 6, color: "#6366f1" }} />
            {field.label}
          </label>
          <div style={{ position: "relative" }}>
            <input
              type="text"
              name={field.name}
              value={form[field.name]}
              onChange={onChange}
              placeholder={showPlaceholders ? field.placeholder : ""}
              style={{
                width: "100%",
                border: "2px solid #e2e8f0",
                borderRadius: 12,
                padding: "13px 16px",
                fontSize: 14,
                outline: "none",
                transition: "border-color 0.2s, box-shadow 0.2s",
                background: "#fafafa",
                boxSizing: "border-box",
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = "#6366f1";
                e.currentTarget.style.boxShadow = "0 0 0 4px rgba(99,102,241,0.1)";
                e.currentTarget.style.background = "#fff";
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = "#e2e8f0";
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.background = "#fafafa";
              }}
            />
          </div>
        </div>
      ))}

      {/* Photo preview */}
      {form.photoUrl && (
        <div
          className="animate-scale-in"
          style={{
            borderRadius: 16,
            overflow: "hidden",
            border: "2px solid rgba(99,102,241,0.2)",
            boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
          }}
        >
          <img
            src={form.photoUrl}
            alt="Preview"
            style={{ width: "100%", height: 200, objectFit: "cover", display: "block" }}
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
        </div>
      )}

      <button
        onClick={onSubmit}
        className="btn-press animate-pulse-glow"
        style={{
          width: "100%",
          padding: "15px",
          borderRadius: 14,
          border: "none",
          background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
          color: "#fff",
          fontWeight: 800,
          fontSize: 15,
          cursor: "none",
          boxShadow: "0 8px 24px rgba(99,102,241,0.35)",
          transition: "transform 0.2s, box-shadow 0.2s",
          marginTop: 4,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-2px)";
          e.currentTarget.style.boxShadow = "0 12px 32px rgba(99,102,241,0.45)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 8px 24px rgba(99,102,241,0.35)";
        }}
      >
        <i className="fas fa-check" style={{ marginRight: 8 }} />
        {submitLabel}
      </button>
    </div>
  );
}
