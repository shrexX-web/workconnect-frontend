function PostJob() {
    return (
      <section className="post-job" id="post-job">
        <div className="post-job-text">
          <h6>Get Started</h6>
          <h2>Post Your Job In Seconds</h2>
          <p>Tell us what you need. We'll match you with verified professionals nearby, ready to send you quotes.</p>
        </div>
        <div className="post-job-form">
          <form>
            <div className="form-row">
              <input type="text" placeholder="Your Name" required />
              <input type="email" placeholder="Your Email" required />
            </div>
            <div className="form-row">
              <input type="tel" placeholder="Your Phone" required />
              <select required defaultValue="">
                <option value="" disabled>Select Service</option>
                <option value="plumbing">Plumbing</option>
                <option value="electrical">Electrical</option>
                <option value="painting">Painting</option>
                <option value="carpentry">Carpentry</option>
                <option value="cleaning">Cleaning</option>
                <option value="ac-repair">AC Repair</option>
              </select>
            </div>
            <textarea placeholder="Describe your job..." rows="4"></textarea>
            <button type="submit" className="btn-primary">Post Job</button>
          </form>
        </div>
      </section>
    );
  }
  
  export default PostJob;