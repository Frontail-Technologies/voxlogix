const FIELDS = [
  { label: "Equipment", value: "Compressor C-201" },
  { label: "Issue", value: "Abnormal bearing noise" },
  { label: "Root Cause", value: "Bearing wear" },
  { label: "Action Taken", value: "Bearing replaced" },
  { label: "Downtime", value: "32 min" },
];

export function StructuredLogVisual() {
  return (
    <div className="landing-log-card">
      <div className="landing-log-card-header">
        <span className="landing-log-card-title">
          <span className="landing-log-card-dot" aria-hidden="true" />
          Structured Log
        </span>
        <span className="landing-log-card-tag">LOG-0192 &middot; C-201</span>
      </div>

      <div className="landing-log-fields">
        {FIELDS.map((field) => (
          <div key={field.label}>
            <p className="landing-log-field-label">{field.label}</p>
            <p className="landing-log-field-value">{field.value}</p>
          </div>
        ))}

        <div>
          <p className="landing-log-field-label">Status</p>
          <p className="landing-log-status">
            <span className="landing-log-status-dot" aria-hidden="true" />
            Resolved
          </p>
        </div>
      </div>

      <div className="landing-log-card-footer">
        <span>Shift B &middot; Plant 04</span>
        <span>14:22 IST</span>
      </div>
    </div>
  );
}
