import { useState } from 'react';
import axios from 'axios';

function Dashboard() {
  const [step, setStep] = useState('phone');
  const [phone, setPhone] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [simulatedOtp, setSimulatedOtp] = useState('');
  const [error, setError] = useState('');
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

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
      fetchJobs();
      setStep('dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Incorrect OTP');
    } finally {
      setLoading(false);
    }
  }

  async function fetchJobs() {
    try {
      const res = await axios.get(`https://workconnect-backend-i80m.onrender.com/api/jobs/claimed/${phone}`);
      setJobs(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  async function markComplete(jobId) {
    try {
      await axios.patch(`https://workconnect-backend-i80m.onrender.com/api/jobs/${jobId}/complete`);
      setJobs(jobs.map(j => j._id === jobId ? { ...j, status: 'completed' } : j));
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
        <h6>Worker Dashboard</h6>
        <h1>Your Claimed Jobs</h1>
      </div>

      {jobs.length === 0 ? (
        <p className="dashboard-empty">No claimed jobs yet. Check the Community board to volunteer for one.</p>
      ) : (
        <div className="dashboard-grid">
          {jobs.map((job) => (
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
      )}
    </section>
  );
}

export default Dashboard;