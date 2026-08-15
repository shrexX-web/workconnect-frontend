import { useState } from 'react';
import axios from 'axios';

function CustomerLogin() {
  const [step, setStep] = useState('phone');
  const [phone, setPhone] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [simulatedOtp, setSimulatedOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [reviewedIds, setReviewedIds] = useState([]);
  const [reviewingId, setReviewingId] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  async function handleSendOtp(e) {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await axios.post('https://workconnect-backend-i80m.onrender.com/api/otp/send-customer', { phone });
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
      await fetchJobs();
      setStep('dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Incorrect OTP');
    } finally {
      setLoading(false);
    }
  }

  async function fetchJobs() {
    try {
      const res = await axios.get(`https://workconnect-backend-i80m.onrender.com/api/jobs/customer/${phone}`);
      setJobs(res.data);

      const completedIds = res.data.filter(j => j.status === 'completed').map(j => j._id);
      if (completedIds.length > 0) {
        const reviewedRes = await axios.post('https://workconnect-backend-i80m.onrender.com/api/reviews/check', { jobIds: completedIds });
        setReviewedIds(reviewedRes.data);
      }
    } catch (err) {
      console.error(err);
    }
  }

  async function handleSubmitReview(jobId) {
    try {
      await axios.post('https://workconnect-backend-i80m.onrender.com/api/reviews', {
        jobId,
        rating,
        comment,
      });
      setReviewedIds([...reviewedIds, jobId]);
      setReviewingId(null);
      setRating(5);
      setComment('');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to submit review');
    }
  }

  if (step === 'phone') {
    return (
      <section className="dashboard-page">
        <div className="dashboard-header">
          <h6>Customer Login</h6>
          <h1>Enter Your Phone Number</h1>
          <p>The number you used when posting a job.</p>
        </div>
        <form onSubmit={handleSendOtp} className="dashboard-search">
          <input
            type="tel"
            placeholder="Your phone number"
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
        <h6>Your Account</h6>
        <h1>Your Job History</h1>
      </div>

      {jobs.length === 0 ? (
        <p className="dashboard-empty">No jobs found for this number.</p>
      ) : (
        <div className="dashboard-grid">
          {jobs.map((job) => (
            <div className="dashboard-card" key={job._id}>
              <div className="dashboard-card-top">
                <span className="community-service-tag">{job.service}</span>
                <span className={`admin-tag tag-${job.status}`}>{job.status}</span>
              </div>
              <p className="community-description">{job.description}</p>
              {job.claimedBy && <p className="community-poster">Worker: {job.claimedBy}</p>}

              {job.status === 'completed' && (
                reviewedIds.includes(job._id) ? (
                  <p className="community-claimed">✓ You reviewed this job</p>
                ) : reviewingId === job._id ? (
                  <div className="inline-review">
                    <div className="star-select">
                      {[1, 2, 3, 4, 5].map((n) => (
                        <span
                          key={n}
                          className={n <= rating ? 'star active' : 'star'}
                          onClick={() => setRating(n)}
                        >★</span>
                      ))}
                    </div>
                    <textarea
                      placeholder="How was the work? (optional)"
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows="2"
                    ></textarea>
                    <button onClick={() => handleSubmitReview(job._id)} className="btn-primary">Submit Review</button>
                  </div>
                ) : (
                  <button onClick={() => setReviewingId(job._id)} className="btn-primary">Leave a Review</button>
                )
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default CustomerLogin;