import { useState } from 'react';
import axios from 'axios';

// Rough demo price bands per service, just for showing something plausible
// on the success screen. Not connected to any real pricing/quote engine.
const DEMO_PRICE_RANGES = {
  plumbing: [300, 900],
  electrical: [250, 800],
  painting: [3000, 9000],
  carpentry: [500, 1800],
  cleaning: [800, 2200],
  'ac-repair': [400, 1400],
};

// Deterministic pseudo-random number from a string, so a given worker
// always shows the same demo quote instead of it jumping around on re-render.
function seededRandom(seed) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash % 1000) / 1000;
}

function getDemoQuote(service, workerId) {
  const [min, max] = DEMO_PRICE_RANGES[service] || [300, 1000];
  const rand = seededRandom(workerId + service);
  const price = Math.round((min + rand * (max - min)) / 50) * 50;
  return price;
}

function PostJob() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    description: '',
    visibility: 'private',
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);
  const [quotes, setQuotes] = useState([]);
  const [quotesLoading, setQuotesLoading] = useState(false);

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await axios.post('https://workconnect-backend-i80m.onrender.com/api/jobs', formData);
      setSubmitted(true);
      setError(false);
      fetchInstantQuotes();
    } catch (err) {
      console.error(err);
      setError(true);
    }
  }

  async function fetchInstantQuotes() {
    setQuotesLoading(true);
    try {
      const res = await axios.get(
        `https://workconnect-backend-i80m.onrender.com/api/workers/by-service/${formData.service}`
      );
      const withQuotes = res.data
        .slice(0, 3)
        .map((worker) => ({
          ...worker,
          demoQuote: getDemoQuote(formData.service, worker._id),
        }));
      setQuotes(withQuotes);
    } catch (err) {
      console.error(err);
    } finally {
      setQuotesLoading(false);
    }
  }

  return (
    <section className="post-job" id="post-job">
      <div className="post-job-text">
        <h6>Get Started</h6>
        <h2>Post Your Job In Seconds</h2>
        <p>Tell us what you need. We'll match you with verified professionals nearby, ready to send you quotes.</p>
      </div>
      <div className="post-job-form">
        {submitted ? (
          <div className="job-success">
            <h3>Job Posted! ✅</h3>
            <p>We'll match you with verified professionals shortly.</p>

            <div className="instant-quotes">
              <p className="instant-quotes-label">⚡ Instant Quotes <span>(Demo)</span></p>

              {quotesLoading ? (
                <p className="instant-quotes-loading">Finding nearby workers...</p>
              ) : quotes.length === 0 ? (
                <p className="instant-quotes-empty">No {formData.service} professionals registered nearby yet.</p>
              ) : (
                <div className="instant-quotes-list">
                  {quotes.map((worker) => (
                    <div className="quote-card" key={worker._id}>
                      <div className="quote-card-avatar">{worker.name.charAt(0)}</div>
                      <div className="quote-card-info">
                        <p className="quote-card-name">{worker.name}</p>
                        <p className="quote-card-area">📍 {worker.area}</p>
                        {worker.avgRating ? (
                          <p className="quote-card-rating">⭐ {worker.avgRating} ({worker.reviewCount})</p>
                        ) : (
                          <p className="quote-card-rating-none">New</p>
                        )}
                      </div>
                      <div className="quote-card-price">
                        <span>₹{worker.demoQuote}</span>
                        <a href={`tel:${worker.phone}`} className="quote-card-call">Call</a>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <input type="text" name="name" placeholder="Your Name" value={formData.name} onChange={handleChange} required />
              <input type="email" name="email" placeholder="Your Email" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="form-row">
              <input type="tel" name="phone" placeholder="Your Phone" value={formData.phone} onChange={handleChange} required />
              <select name="service" value={formData.service} onChange={handleChange} required>
                <option value="" disabled>Select Service</option>
                <option value="plumbing">Plumbing</option>
                <option value="electrical">Electrical</option>
                <option value="painting">Painting</option>
                <option value="carpentry">Carpentry</option>
                <option value="cleaning">Cleaning</option>
                <option value="ac-repair">AC Repair</option>
              </select>
            </div>
            <textarea name="description" placeholder="Describe your job..." rows="4" value={formData.description} onChange={handleChange}></textarea>
            <div className="visibility-toggle">
              <label className={formData.visibility === 'private' ? 'active' : ''}>
                <input
                  type="radio"
                  name="visibility"
                  value="private"
                  checked={formData.visibility === 'private'}
                  onChange={handleChange}
                />
                Keep Private
              </label>
              <label className={formData.visibility === 'public' ? 'active' : ''}>
                <input
                  type="radio"
                  name="visibility"
                  value="public"
                  checked={formData.visibility === 'public'}
                  onChange={handleChange}
                />
                Share with Community
              </label>
            </div>
            <button type="submit" className="btn-primary">Post Job</button>
            {error && <p className="form-error">Something went wrong. Please try again.</p>}
          </form>
        )}
      </div>
    </section>
  );
}

export default PostJob;