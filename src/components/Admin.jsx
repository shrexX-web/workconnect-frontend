import { useState, useEffect } from 'react';
import axios from 'axios';

const ADMIN_PASSWORD = 'workconnect2026';
const API = 'https://workconnect-backend-i80m.onrender.com';

function Admin() {
  const [authenticated, setAuthenticated] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [jobs, setJobs] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [activeTab, setActiveTab] = useState('jobs');
  const [loading, setLoading] = useState(false);
  const [newWorker, setNewWorker] = useState({ name: '', phone: '', service: '', area: '' });

  function handleLogin(e) {
    e.preventDefault();
    if (passwordInput === ADMIN_PASSWORD) setAuthenticated(true);
    else alert('Incorrect password');
  }

  useEffect(() => {
    if (authenticated) fetchData();
  }, [authenticated]);

  async function fetchData() {
    setLoading(true);
    try {
      const [jobsRes, workersRes] = await Promise.all([
        axios.get(`${API}/api/admin/jobs`),
        axios.get(`${API}/api/admin/workers`),
      ]);
      setJobs(jobsRes.data);
      setWorkers(workersRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddWorker(e) {
    e.preventDefault();
    try {
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
      await axios.delete(`${API}/api/admin/jobs/${jobId}`);
      setJobs(jobs.filter(j => j._id !== jobId));
    } catch (err) {
      alert('Failed to delete job');
    }
  }

  async function handleResetJob(jobId) {
    if (!confirm('Reset this job back to open? This removes the current claim.')) return;
    try {
      const res = await axios.patch(`${API}/api/admin/jobs/${jobId}/reset`);
      setJobs(jobs.map(j => j._id === jobId ? res.data : j));
    } catch (err) {
      alert('Failed to reset job');
    }
  }

  async function handleDeleteWorker(workerId) {
    if (!confirm('Delete this worker permanently?')) return;
    try {
      await axios.delete(`${API}/api/admin/workers/${workerId}`);
      setWorkers(workers.filter(w => w._id !== workerId));
    } catch (err) {
      alert('Failed to delete worker');
    }
  }

  if (!authenticated) {
    return (
      <section className="admin-login">
        <form onSubmit={handleLogin}>
          <h2>Admin Access</h2>
          <input
            type="password"
            placeholder="Enter admin password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
          />
          <button type="submit" className="btn-primary">Enter</button>
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