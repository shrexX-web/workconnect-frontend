import { useState } from 'react';
import axios from 'axios';

function Partner() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    service: '',
    area: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await axios.post('https://workconnect-backend-i80m.onrender.com/api/workers', formData);
      setSubmitted(true);
      setError(false);
    } catch (err) {
      console.error(err);
      setError(true);
    }
  }

  return (
    <section className="partner-page">
      <div className="partner-hero">
        <h6>Fixado Partner</h6>
        <h1>Get Jobs Near You. Get Paid. Build Your Reputation.</h1>
        <p>Join thousands of skilled professionals earning through Fixado. No fees to join — just real customers looking for real work.</p>
      </div>

      <div className="partner-benefits">
        <div className="benefit-box">
          <div className="benefit-icon">📍</div>
          <h3>Jobs Near You</h3>
          <p>Get notified about jobs in your area, in your skill category.</p>
        </div>
        <div className="benefit-box">
          <div className="benefit-icon">💰</div>
          <h3>Get Paid Fairly</h3>
          <p>Set your own quotes. No hidden cuts, no surprises.</p>
        </div>
        <div className="benefit-box">
          <div className="benefit-icon">⭐</div>
          <h3>Build Your Rating</h3>
          <p>Every completed job builds your public reputation and gets you more work.</p>
        </div>
      </div>

      <div className="partner-signup">
        {!submitted ? (
          <>
            <h2>Register in 30 Seconds</h2>
            <form onSubmit={handleSubmit}>
              <input type="text" name="name" placeholder="Your Full Name" value={formData.name} onChange={handleChange} required />
              <input type="tel" name="phone" placeholder="Your Phone Number" value={formData.phone} onChange={handleChange} required />
              <select name="service" value={formData.service} onChange={handleChange} required>
                <option value="" disabled>What service do you provide?</option>
                <option value="plumbing">Plumbing</option>
                <option value="electrical">Electrical</option>
                <option value="painting">Painting</option>
                <option value="carpentry">Carpentry</option>
                <option value="cleaning">Cleaning</option>
                <option value="ac-repair">AC Repair</option>
              </select>
              <input type="text" name="area" placeholder="Your Area / Locality" value={formData.area} onChange={handleChange} required />
              <button type="submit" className="btn-primary">Register Now</button>
              {error && <p className="form-error">Something went wrong. Please try again.</p>}
            </form>
          </>
        ) : (
          <div className="partner-success">
            <h2>You're In! 🎉</h2>
            <p>We'll notify you as soon as jobs open up near you.</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default Partner;