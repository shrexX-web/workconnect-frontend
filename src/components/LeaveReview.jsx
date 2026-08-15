import { useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function LeaveReview() {
  const { jobId } = useParams();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [workerName, setWorkerName] = useState('');
  const [workerPhone, setWorkerPhone] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await axios.post('https://workconnect-backend-i80m.onrender.com/api/reviews', {
        jobId,
        workerPhone,
        workerName,
        customerName,
        rating,
        comment,
      });
      setSubmitted(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit review');
    }
  }

  if (submitted) {
    return (
      <section className="dashboard-page">
        <div className="dashboard-header">
          <h1>Thanks for the feedback! 🙌</h1>
          <p>Your review helps other customers find great craftsmen.</p>
        </div>
      </section>
    );
  }

  return (
    <section className="dashboard-page">
      <div className="dashboard-header">
        <h6>Rate Your Experience</h6>
        <h1>How Did It Go?</h1>
      </div>
      <form onSubmit={handleSubmit} className="review-form">
        <input type="text" placeholder="Your name" value={customerName} onChange={(e) => setCustomerName(e.target.value)} required />
        <input type="text" placeholder="Worker's name" value={workerName} onChange={(e) => setWorkerName(e.target.value)} required />
        <input type="tel" placeholder="Worker's phone number" value={workerPhone} onChange={(e) => setWorkerPhone(e.target.value)} required />
        <div className="star-select">
          {[1, 2, 3, 4, 5].map((n) => (
            <span
              key={n}
              className={n <= rating ? 'star active' : 'star'}
              onClick={() => setRating(n)}
            >★</span>
          ))}
        </div>
        <textarea placeholder="How was the work? (optional)" value={comment} onChange={(e) => setComment(e.target.value)} rows="4"></textarea>
        <button type="submit" className="btn-primary">Submit Review</button>
        {error && <p className="form-error">{error}</p>}
      </form>
    </section>
  );
}

export default LeaveReview;