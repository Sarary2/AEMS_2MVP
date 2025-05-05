export default function StatCard({ title, count, color }) {
  return (
    <div className="col-md-3 mb-3">
      <div className={`card text-white bg-${color}`}>
        <div className="card-body">
          <h5 className="card-title">{title}</h5>
          <h3>{count}</h3>
        </div>
      </div>
    </div>
  );
}
