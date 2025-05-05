export default function StatCard({ label, value, color }) {
    return (
      <div className={`bg-${color}-100 p-4 rounded-xl shadow-md border-l-8 border-${color}-500`}>
        <h4 className="text-gray-600 text-sm">{label}</h4>
        <p className="text-2xl font-bold text-${color}-800">{value}</p>
      </div>
    );
  }
  