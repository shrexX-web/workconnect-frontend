import { useState, useEffect } from 'react';
import axios from 'axios';

function Community() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [claimingId, setClaimingId] = useState(null);
  const [workerName, setWorkerName] = useState('');
  const [workerPhone, setWorkerPhone] = useState('');

  useEffect(() => {
    fetchJobs();
  }, []);

  async function fetchJobs() {
    try {
      const res = await axios.get('https://workconnect-backend-i80m.onrender.com/api/jobs/public');
      setJobs(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function handleClaim(jobId) {
    if (!workerName.trim() || !workerPhone.trim()) {
      alert('Please enter your name and phone number');
      return;
    }
    try {
      await axios.patch(`https://workconnect-backend-i80m.onrender.com/api/jobs/${jobId}/claim`, {
        workerName: workerName,
        workerPhone: workerPhone,
      });
      fetchJobs();
      setClaimingId(null);
    } catch (err) {
      console.error(err);
      alert('This job may already be claimed. Refreshing...');
      fetchJobs();
    }
  }

  return (
    <section className="community-page">
      <div className="community-header">
        <h6>Community Board</h6>
        <h1>Local Problems, Local Fixes</h1>
        <p>See issues shared by people nearby — plumbing, electrical, potholes, anything. Volunteer to fix it and get paid.</p>
      </div>

      {loading ? (
        <p className="community-loading">Loading community jobs...</p>
      ) : jobs.length === 0 ? (
        <p className="community-empty">No public issues right now. Check back soon!</p>
      ) : (
        <div className="community-grid">
          {jobs.map((job) => (
            <div className="community-card" key={job._id}>
              <div className="community-card-top">
                <span className="community-service-tag">{job.service}</span>
                <span className={`community-status status-${job.status}`}>{job.status}</span>
              </div>
              <p className="community-description">{job.description}</p>
              <p className="community-poster">Posted by {job.name}</p>

              {job.status === 'open' ? (
                claimingId === job._id ? (
                  <div className="claim-input-row">
                    <input
                      type="text"
                      placeholder="Your name"
                      value={workerName}
                      onChange={(e) => setWorkerName(e.target.value)}
                    />
                    <input
                      type="tel"
                      placeholder="Your phone"
                      value={workerPhone}
                      onChange={(e) => setWorkerPhone(e.target.value)}
                    />
                    <button onClick={() => handleClaim(job._id)} className="btn-primary">Confirm</button>
                  </div>
                ) : (
                  <button onClick={() => setClaimingId(job._id)} className="btn-primary">I'll Fix This</button>
                )
              ) : (
                <p className="community-claimed">Claimed by {job.claimedBy}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default Community;