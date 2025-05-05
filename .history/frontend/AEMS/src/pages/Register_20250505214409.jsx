<div className="container mt-5" style={{ maxWidth: '500px' }}>
<h3>Register</h3>
{error && <div className="alert alert-danger">{error}</div>}
<form onSubmit={handleRegister}>
  <div className="mb-3">
    <label>Email</label>
    <input
      type="email"
      className="form-control"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      required
    />
  </div>
  <div className="mb-3">
    <label>Password</label>
    <input
      type="password"
      className="form-control"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      required
    />
  </div>
  <button type="submit" className="btn btn-success w-100">
    Register
  </button>
</form>
</div>
);
}
