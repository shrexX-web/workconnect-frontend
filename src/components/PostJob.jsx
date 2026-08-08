import { useState } from 'react';
import axios from 'axios';

function PostJob() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    description: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    try {
      await axios.post('https://workconnect-backend-i80m.onrender.com/api/jobs', formData);
      setSubmitted(true);
      setError(false);
    } catch (err) {
      console.error(err);
      setError(true);
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
            <button type="submit" className="btn-primary">Post Job</button>
            {error && <p className="form-error">Something went wrong. Please try again.</p>}
          </form>
        )}
      </div>
    </section>
  );
}

export default PostJob;