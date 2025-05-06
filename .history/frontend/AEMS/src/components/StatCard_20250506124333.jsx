import { Card } from "@/components/ui/card";

const statusDetails = {
  "Safe": {
    icon: "✅",
    text: "🟢 Low-risk: few reports, no signs of harm.",
    explanation: "Typically fewer than 15 reports, no mention of death or serious injury.",
    color: "text-success"
  },
  "Warning": {
    icon: "⚠️",
    text: "🟡 Medium-risk: recurring issues or injuries.",
    explanation: "Either more than 15 reports or contains words like 'injury', 'hospitalization', or 'intervention'.",
    color: "text-warning"
  },
  "Critical": {
    icon: "❌",
    text: "🔴 High-risk: critical failures or deaths.",
    explanation: "Includes terms like 'death' or 'cardiac arrest', or exceeds 40 risk points.",
    color: "text-danger"
  },
  "Total Devices": {
    icon: "📦",
    text: "Overview of all devices tracked.",
    explanation: "Total number of devices uploaded and classified.",
    color: "text-primary"
  }
};

export default function StatCard({ title, count }) {
  const details = statusDetails[title] || {
    icon: "📊",
    text: "",
    explanation: "",
    color: "text-muted"
  };

  return (
    <div className="col-md-3">
      <Card className="p-3 shadow-sm border rounded">
        <h5 className={`mb-1 ${details.color}`}>
          {details.icon} {title}
        </h5>
        <h2 className="fw-bold">{count}</h2>
        <p className="text-muted small mb-1">{details.text}</p>
        <p className="text-muted small fst-italic">{details.explanation}</p>
      </Card>
    </div>
  );
}
