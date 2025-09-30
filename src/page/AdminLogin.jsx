import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@example.com'); // Default pre-filled for dev
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const apiUrl = "http://localhost:5000";
      const response = await axios.post(`${apiUrl}/api/admin/login`, {
        email,
        password
      });

      if (response.data.token) {
        const tokenData = {
          token: response.data.token,
          loginTime: Date.now()
        };
        localStorage.setItem('adminToken', JSON.stringify(tokenData));
        navigate('/admin-dashboard');
      }
    } catch (err) {
      if (err.response) {
        setError(err.response.data?.message || 'Login failed');
      } else if (err.request) {
        setError('Network error: Unable to reach backend. Is it running?');
      } else {
        setError('Login failed');
      }
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5" style={{ maxWidth: '400px' }}>
      <h2 className="mb-4 text-center">Admin Login</h2>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label className="form-label">Email address</label>
          <input
            type="email"
            className="form-control"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@example.com"
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="admin123"
            autoComplete="current-password"
          />
        </div>

        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
          {loading ? "Logging In..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default AdminLogin;
