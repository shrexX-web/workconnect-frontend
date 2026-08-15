import { useState } from 'react';
import axios from 'axios';

function Dashboard() {
  const [step, setStep] = useState('phone');
  const [phone, setPhone] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [simulatedOtp, setSimulatedOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [worker, setWorker] = useState(null);
  const [availableJobs, setAvailableJobs] = useState([]);
  const [claimedJobs, setClaimedJobs] = useState([]);
  const [activeTab, setActiveTab] = useState('available');

  async function handleSendOtp(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axios.post('https://workconnect-backend-i80m.onrender.com/api/otp/send', { phone });
      setSimulatedOtp(res.data.otp);
      setStep('otp');
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOtp(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await axios.post('https://workconnect-backend-i80m.onrender.com/api/otp/verify', { phone, otp: otpInput });
      const workerRes = await axios.get(`https://workconnect-backend-i80m.onrender.com/api/workers/phone/${phone}`);
      setWorker(workerRes.data);
      await loadJobs(workerRes.data.service);
      setStep('dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Incorrect OTP');
    } finally {
      setLoading(false);
    }
  }

  async function loadJobs(service) {
    try {
      const [availableRes, claimedRes] = await Promise.all([
        axios.get(`https://workconnect-backend-i80m.onrender.com/api/jobs/available/${service}`),
        axios.get(`https://workconnect-backend-i80m.onrender.com/api/jobs/claimed/${phone}`),
      ]);
      setAvailableJobs(availableRes.data);
      setClaimedJobs(claimedRes.data);
    } catch (err) {
      console.error(err);
    }
  }

  async function handleClaim(jobId) {
    try {
      await axios.patch(`https://workconnect-backend-i80m.onrender.com/api/jobs/${jobId}/claim`, {
        workerName: worker.name,
        workerPhone: phone,
      });
      await loadJobs(worker.service);
      setActiveTab('claimed');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to claim job');
      loadJobs(worker.service);
    }
  }

  async function markComplete(jobId) {
    try {
      await axios.patch(`https://workconnect-backend-i80m.onrender.com/api/jobs/${jobId}/complete`);
      setClaimedJobs(claimedJobs.map(j => j._id === jobId ? { ...j, status: 'completed' } : j));
    } catch (err) {
      console.error(err);
    }
  }

  if (step === 'phone') {
    return (
      <section className="dashboard-page">
        <div className="dashboard-header">
          <h6>Worker Login</h6>
          <h1>Enter Your Phone Number</h1>
          <p>We'll send a one-time code to verify it's you.</p>
        </div>
        <form onSubmit={handleSendOtp} className="dashboard-search">
          <input
            type="tel"
            placeholder="Your registered phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Sending...' : 'Send OTP'}
          </button>
        </form>
        {error && <p className="form-error">{error}</p>}
      </section>
    );
  }

  if (step === 'otp') {
    return (
      <section className="dashboard-page">
        <div className="dashboard-header">
          <h6>Verify OTP</h6>
          <h1>Enter the Code</h1>
          <p className="otp-demo-note">Demo mode — no real SMS sent. Your code is: <strong>{simulatedOtp}</strong></p>
        </div>
        <form onSubmit={handleVerifyOtp} className="dashboard-search">
          <input
            type="text"
            placeholder="6-digit code"
            value={otpInput}
            onChange={(e) => setOtpInput(e.target.value)}
            maxLength="6"
            required
          />
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? 'Verifying...' : 'Verify'}
          </button>
        </form>
        {error && <p className="form-error">{error}</p>}
      </section>
    );
  }

  return (
    <section className="dashboard-page">
      <div className="dashboard-header">
        <h6>Welcome, {worker.name}</h6>
        <h1>{worker.service.charAt(0).toUpperCase() + worker.service.slice(1)} Jobs</h1>
      </div>

      <div className="admin-tabs" style={{ justifyContent: 'center' }}>
        <button className={activeTab === 'available' ? 'active' : ''} onClick={() => setActiveTab('available')}>
          Available ({availableJobs.length})
        </button>
        <button className={activeTab === 'claimed' ? 'active' : ''} onClick={() => setActiveTab('claimed')}>
          Your Jobs ({claimedJobs.length})
        </button>
      </div>

      {activeTab === 'available' ? (
        availableJobs.length === 0 ? (
          <p className="dashboard-empty">No open {worker.service} jobs right now. Check back soon.</p>
        ) : (
          <div className="dashboard-grid">
            {availableJobs.map((job) => (
              <div className="dashboard-card" key={job._id}>
                <div className="dashboard-card-top">
                  <span className="community-service-tag">{job.service}</span>
                  <span className="admin-tag tag-open">open</span>
                </div>
                <p className="community-description">{job.description}</p>
                <p className="community-poster">Posted by {job.name}</p>
                <button onClick={() => handleClaim(job._id)} className="btn-primary">Claim This Job</button>
              </div>
            ))}
          </div>
        )
      ) : (
        claimedJobs.length === 0 ? (
          <p className="dashboard-empty">You haven't claimed any jobs yet.</p>
        ) : (
          <div className="dashboard-grid">
            {claimedJobs.map((job) => (
              <div className="dashboard-card" key={job._id}>
                <div className="dashboard-card-top">
                  <span className="community-service-tag">{job.service}</span>
                  <span className={`admin-tag tag-${job.status}`}>{job.status}</span>
                </div>
                <p className="community-description">{job.description}</p>
                <p className="community-poster">Customer: {job.name} · {job.phone}</p>
                {job.status === 'claimed' && (
                  <button onClick={() => markComplete(job._id)} className="btn-primary">Mark Complete</button>
                )}
              </div>
            ))}
          </div>
        )
      )}
    </section>
  );
}

export default Dashboard;