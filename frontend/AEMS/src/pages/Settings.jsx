export default function Settings() {
    return (
      <div>
        <h2 className="mb-4">⚙️ Settings</h2>
        <form>
          <div className="mb-3">
            <label className="form-label">Notification Email</label>
            <input type="email" className="form-control" placeholder="you@example.com" />
          </div>
          <div className="mb-3">
            <label className="form-label">Notify me about</label>
            <select className="form-select">
              <option>All events</option>
              <option>Critical events only</option>
              <option>Recalls only</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary">Save Preferences</button>
        </form>
      </div>
    );
  }
  