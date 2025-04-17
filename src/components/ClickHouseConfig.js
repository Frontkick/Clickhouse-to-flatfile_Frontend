import React from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const ClickHouseConfig = ({ setConnection, setTables }) => {
  const [host, setHost] = React.useState('');
  const [user, setUser] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [secure, setSecure] = React.useState(false);
  const [error, setError] = React.useState('');
  const [loading, setLoading] = React.useState(false); // Track loading state

  const handleConnect = async () => {
    setLoading(true); // Set loading state to true when the connection starts

    try {
      const response = await axios.post('https://test-pg5s.onrender.com/list_tables', {
        host,
        user,
        password,
        secure,
      });
      setConnection({ host, user, password, secure });
      setTables(response.data.tables);
      setError('');
    } catch (err) {
      setError('Failed to connect to ClickHouse');
    } finally {
      setLoading(false); // Set loading state to false once the request completes
    }
  };

  return (
    <div className="card p-4 mb-4 shadow-sm">
      <h2 className="card-title mb-3">ClickHouse Connection</h2>
      <div className="mb-3">
        <label htmlFor="host" className="form-label">Host</label>
        <input
          type="text"
          id="host"
          placeholder="Enter host"
          value={host}
          onChange={(e) => setHost(e.target.value)}
          className="form-control"
        />
      </div>
      <div className="mb-3">
        <label htmlFor="user" className="form-label">User</label>
        <input
          type="text"
          id="user"
          placeholder="Enter user"
          value={user}
          onChange={(e) => setUser(e.target.value)}
          className="form-control"
        />
      </div>
      <div className="mb-3">
        <label htmlFor="password" className="form-label">Password</label>
        <input
          type="password"
          id="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="form-control"
        />
      </div>
      <div className="form-check mb-3">
        <input
          type="checkbox"
          id="secure"
          checked={true}
          disabled
          className="form-check-input"
        />
        <label htmlFor="secure" className="form-check-label">Secure Connection</label>
      </div>

      <button
        onClick={handleConnect}
        className="btn btn-primary w-100"
        disabled={loading} // Disable the button while loading
      >
        {loading ? (
          <div className="spinner-border spinner-border-sm text-light" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        ) : (
          'Connect'
        )}
      </button>
      {error && <div className="alert alert-danger mt-3">{error}</div>}
    </div>
  );
};

export default ClickHouseConfig;
