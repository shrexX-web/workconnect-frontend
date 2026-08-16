import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API = 'https://workconnect-backend-i80m.onrender.com';
const TOKEN_KEY = 'workconnect_admin_token';

function Admin() {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY) || '');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loggingIn, setLoggingIn] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [activeTab, setActiveTab] = useState('jobs');
  const [loading, setLoading] = useState(false);
  const [newWorker, setNewWorker] = useState({ name: '', phone: '', service: '', area: '' });

  const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

  function logout() {
    localStorage.removeItem(TOKEN_KEY);
    setToken('');
  }

  // Wraps admin API calls: on 401/403 (bad/expired token) it logs the admin out
  // instead of leaving them stuck on a broken screen.
  const withAuth = useCallback(async (fn) => {
    try {
      return await fn();
    } catch (err) {
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        logout();
        alert('Your session expired. Please log in again.');
      }
      throw err;
    }
  }, []);

  async function handleLogin(e) {
    e.preventDefault();
    setLoginError('');
    setLoggingIn(true);
    try {
      const res = await axios.post(`${API}/api/auth/admin-login`, { email, password });
      localStorage.setItem(TOKEN_KEY, res.data.token);
      setToken(res.data.token);
      setPassword('');
    } catch (err) {
      setLoginError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoggingIn(false);
    }
  }

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      await withAuth(async () => {
        const [jobsRes, workersRes] = await Promise.all([
          axios.get(`${API}/api/admin/jobs`, authHeaders),
          axios.get(`${API}/api/admin/workers`, authHeaders),
        ]);
        setJobs(jobsRes.data);
        setWorkers(workersRes.data);
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [token, withAuth]);

  useEffect(() => {
    if (token) fetchData();
  }, [token, fetchData]);

  async function handleAddWorker(e) {
    e.preventDefault();
    try {
      // Worker creation isn't an admin-only route on the backend (workers self-register
      // too), so this call doesn't need the admin token.
      await axios.post(`${API}/api/workers`, newWorker);
      setNewWorker({ name: '', phone: '', service: '', area: '' });
      fetchData();
    } catch (err) {
      alert('Failed to add worker');
    }
  }

  async function handleDeleteJob(jobId) {
    if (!confirm('Delete this job permanently?')) return;
    try {
      await withAuth(() => axios.delete(`${API}/api/admin/jobs/${jobId}`, authHeaders));
      setJobs(jobs.filter(j => j._id !== jobId));
    } catch (err) {
      alert('Failed to delete job');
    }
  }

  async function handleResetJob(jobId) {
    if (!confirm('Reset this job back to open? This removes the current claim.')) return;
    try {
      const res = await withAuth(() => axios.patch(`${API}/api/admin/jobs/${jobId}/reset`, {}, authHeaders));
      setJobs(jobs.map(j => j._id === jobId ? res.data : j));
    } catch (err) {
      alert('Failed to reset job');
    }
  }

  async function handleDeleteWorker(workerId) {
    if (!confirm('Delete this worker permanently?')) return;
    try {
      await withAuth(() => axios.delete(`${API}/api/admin/workers/${workerId}`, authHeaders));
      setWorkers(workers.filter(w => w._id !== workerId));
    } catch (err) {
      alert('Failed to delete worker');
    }
  }

  if (!token) {
    return (
      <section className="admin-login">
        <form onSubmit={handleLogin}>
          <h2>Admin Access</h2>
          <input
            type="email"
            placeholder="Admin email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="username"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
          {loginError && <p className="admin-login-error">{loginError}</p>}
          <button type="submit" className="btn-primary" disabled={loggingIn}>
            {loggingIn ? 'Logging in...' : 'Enter'}
          </button>
        </form>
      </section>
    );
  }

  return (
    <section className="admin-page">
      <div className="admin-header">
        <h1>Admin Dashboard</h1>
        <div className="admin-stats">
          <div className="admin-stat-box">
            <h2>{jobs.length}</h2>
            <p>Total Jobs</p>
          </div>
          <div className="admin-stat-box">
            <h2>{jobs.filter(j => j.visibility === 'public').length}</h2>
            <p>Public Jobs</p>
          </div>
          <div className="admin-stat-box">
            <h2>{workers.length}</h2>
            <p>Registered Workers</p>
          </div>
        </div>
        <button className="admin-logout" onClick={logout}>Log out</button>
      </div>

      <div className="admin-tabs">
        <button className={activeTab === 'jobs' ? 'active' : ''} onClick={() => setActiveTab('jobs')}>Jobs</button>
        <button className={activeTab === 'workers' ? 'active' : ''} onClick={() => setActiveTab('workers')}>Workers</button>
      </div>

      {loading ? (
        <p className="admin-loading">Loading...</p>
      ) : activeTab === 'jobs' ? (
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Service</th>
                <th>Description</th>
                <th>Visibility</th>
                <th>Status</th>
                <th>Claimed By</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job._id}>
                  <td>{job.name}</td>
                  <td>{job.service}</td>
                  <td>{job.description}</td>
                  <td><span className={`admin-tag tag-${job.visibility}`}>{job.visibility}</span></td>
                  <td><span className={`admin-tag tag-${job.status}`}>{job.status}</span></td>
                  <td>{job.claimedBy || '—'}</td>
                  <td className="admin-actions">
                    {job.status !== 'open' && (
                      <button className="admin-action-link" onClick={() => handleResetJob(job._id)}>Reset</button>
                    )}
                    <button className="admin-action-link danger" onClick={() => handleDeleteJob(job._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="admin-table-wrap">
          <form onSubmit={handleAddWorker} className="admin-add-worker">
            <input type="text" placeholder="Name" value={newWorker.name} onChange={(e) => setNewWorker({ ...newWorker, name: e.target.value })} required />
            <input type="tel" placeholder="Phone" value={newWorker.phone} onChange={(e) => setNewWorker({ ...newWorker, phone: e.target.value })} required />
            <input type="text" placeholder="Service (e.g. plumbing)" value={newWorker.service} onChange={(e) => setNewWorker({ ...newWorker, service: e.target.value })} required />
            <input type="text" placeholder="Area" value={newWorker.area} onChange={(e) => setNewWorker({ ...newWorker, area: e.target.value })} required />
            <button type="submit" className="btn-primary">Add Worker</button>
          </form>
          <table className="admin-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Service</th>
                <th>Area</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {workers.map((worker) => (
                <tr key={worker._id}>
                  <td>{worker.name}</td>
                  <td>{worker.phone}</td>
                  <td>{worker.service}</td>
                  <td>{worker.area}</td>
                  <td className="admin-actions">
                    <button className="admin-action-link danger" onClick={() => handleDeleteWorker(worker._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default Admin;