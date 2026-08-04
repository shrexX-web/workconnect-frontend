import { useState } from 'react';

function Partner() {
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <section className="partner-page">
      <div className="partner-hero">
        <h6>WorkConnect Partner</h6>
        <h1>Get Jobs Near You. Get Paid. Build Your Reputation.</h1>
        <p>Join thousands of skilled professionals earning through WorkConnect. No fees to join — just real customers looking for real work.</p>
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
              <input type="text" placeholder="Your Full Name" required />
              <input type="tel" placeholder="Your Phone Number" required />
              <select required defaultValue="">
                <option value="" disabled>What service do you provide?</option>
                <option value="plumbing">Plumbing</option>
                <option value="electrical">Electrical</option>
                <option value="painting">Painting</option>
                <option value="carpentry">Carpentry</option>
                <option value="cleaning">Cleaning</option>
                <option value="ac-repair">AC Repair</option>
              </select>
              <input type="text" placeholder="Your Area / Locality" required />
              <button type="submit" className="btn-primary">Register Now</button>
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