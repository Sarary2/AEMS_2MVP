import React from 'react';

const statusDetails = {
  "Safe": {
    icon: "✅",
    explanation: "Few incidents, no signs of serious harm.",
    color: "success"
  },
  "Warning": {
    icon: "⚠️",
    explanation: "Moderate issues or signs of injury reported.",
    color: "warning"
  },
  "Critical": {
    icon: "❌",
    explanation: "Critical risks: death or serious failure reported.",
    color: "danger"
  },
  "Total Devices": {
    icon: "📦",
    explanation: "Total devices currently tracked.",
    color: "primary"
  }
};

export default function StatCard({ title, count }) {
  const details = statusDetails[title] || {
    icon: "📊",
    explanation: "Summary of device activity.",
    color: "secondary"
  };

  return (
    <div className="col-md-3 mb-3">
      <div className={`card text-white bg-${details.color}`}>
        <div className="card-body">
          <h5 className="card-title">
            {details.icon} {title}
          </h5>
          <h3 className="card-text">{count}</h3>
          <p className="small">{details.explanation}</p>
        </div>
      </div>
    </div>
  );
}
