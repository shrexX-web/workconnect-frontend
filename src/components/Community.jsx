import { useState, useEffect } from 'react';
import axios from 'axios';

function Community() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [claimingId, setClaimingId] = useState(null);
  const [workerName, setWorkerName] = useState('');
  const [workerPhone, setWorkerPhone] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [comments, setComments] = useState({});
  const [commentInput, setCommentInput] = useState('');
  const [commentName, setCommentName] = useState('');

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

  async function toggleComments(jobId) {
    if (expandedId === jobId) {
      setExpandedId(null);
      return;
    }
    setExpandedId(jobId);
    if (!comments[jobId]) {
      try {
        const res = await axios.get(`https://workconnect-backend-i80m.onrender.com/api/comments/${jobId}`);
        setComments({ ...comments, [jobId]: res.data });
      } catch (err) {
        console.error(err);
      }
    }
  }

  async function handlePostComment(jobId) {
    if (!commentName.trim() || !commentInput.trim()) {
      alert('Please enter your name and a comment');
      return;
    }
    try {
      await axios.post('https://workconnect-backend-i80m.onrender.com/api/comments', {
        jobId,
        name: commentName,
        comment: commentInput,
      });
      const res = await axios.get(`https://workconnect-backend-i80m.onrender.com/api/comments/${jobId}`);
      setComments({ ...comments, [jobId]: res.data });
      setCommentInput('');
      setJobs(jobs.map(j => j._id === jobId ? { ...j, commentCount: (j.commentCount || 0) + 1 } : j));
    } catch (err) {
      console.error(err);
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
      alert(err.response?.data?.error || 'Failed to claim job');
      fetchJobs();
    }
  }

  return (
    <section className="community-page">
      <div className="community-header">
        <h6>Community Board</h6>
        <h1>Local Problems, Local Fixes</h1>
        <p>Share an issue in your neighborhood, join the discussion, or volunteer to fix it yourself.</p>
      </div>

      {loading ? (
        <p className="community-loading">Loading community posts...</p>
      ) : jobs.length === 0 ? (
        <p className="community-empty">No public issues right now. Be the first to share one!</p>
      ) : (
        <div className="community-feed">
          {jobs.map((job) => (
            <div className="community-post" key={job._id}>
              <div className="community-post-header">
                <div className="community-avatar">{job.name.charAt(0)}</div>
                <div>
                  <p className="community-post-name">{job.name}</p>
                  <span className="community-service-tag">{job.service}</span>
                </div>
                <span className={`community-status status-${job.status}`}>{job.status}</span>
              </div>

              <p className="community-description">{job.description}</p>

              <div className="community-post-actions">
                <button className="community-action-btn" onClick={() => toggleComments(job._id)}>
                  💬 {job.commentCount || 0} Comments
                </button>
                {job.status === 'open' && (
                  claimingId === job._id ? null : (
                    <button className="community-action-btn claim-btn" onClick={() => setClaimingId(job._id)}>
                      🔧 I Can Fix This
                    </button>
                  )
                )}
                {job.status !== 'open' && (
                  <span className="community-claimed">Being handled by {job.claimedBy}</span>
                )}
              </div>

              {claimingId === job._id && (
                <div className="claim-input-row">
                  <input
                    type="text"
                    placeholder="Your name"
                    value={workerName}
                    onChange={(e) => setWorkerName(e.target.value)}
                  />
                  <input
                    type="tel"
                    placeholder="Your registered phone"
                    value={workerPhone}
                    onChange={(e) => setWorkerPhone(e.target.value)}
                  />
                  <button onClick={() => handleClaim(job._id)} className="btn-primary">Confirm</button>
                </div>
              )}

              {expandedId === job._id && (
                <div className="comments-section">
                  {comments[job._id]?.length > 0 ? (
                    comments[job._id].map((c) => (
                      <div className="comment-item" key={c._id}>
                        <div className="community-avatar small">{c.name.charAt(0)}</div>
                        <div>
                          <p className="comment-name">{c.name}</p>
                          <p className="comment-text">{c.comment}</p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="comment-empty">No comments yet. Start the conversation.</p>
                  )}
                  <div className="comment-form">
                    <input
                      type="text"
                      placeholder="Your name"
                      value={commentName}
                      onChange={(e) => setCommentName(e.target.value)}
                    />
                    <input
                      type="text"
                      placeholder="Add a comment..."
                      value={commentInput}
                      onChange={(e) => setCommentInput(e.target.value)}
                    />
                    <button onClick={() => handlePostComment(job._id)} className="btn-primary">Post</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default Community;