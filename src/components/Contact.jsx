function Contact() {
    return (
      <section className="contact-page">
        <div className="contact-header">
          <h6>Get In Touch</h6>
          <h1>We're Here To Help</h1>
          <p>Questions, feedback, or need help with a booking? Reach out and we'll get back to you within 24 hours.</p>
        </div>
  
        <div className="contact-grid">
          <div className="contact-info">
            <div className="info-item">
              <h4>📍 Address</h4>
              <p>Pune, Maharashtra, India</p>
            </div>
            <div className="info-item">
              <h4>📞 Phone</h4>
              <p>+91 98765 43210</p>
            </div>
            <div className="info-item">
              <h4>✉️ Email</h4>
              <p>support@workconnect.com</p>
            </div>
            <div className="info-item">
              <h4>🕒 Hours</h4>
              <p>Mon - Sat: 9 AM - 9 PM</p>
            </div>
          </div>
  
          <form className="contact-form">
            <div className="form-row">
              <input type="text" placeholder="Your Name" required />
              <input type="email" placeholder="Your Email" required />
            </div>
            <input type="text" placeholder="Subject" required />
            <textarea placeholder="Your Message" rows="5"></textarea>
            <button type="submit" className="btn-primary">Send Message</button>
          </form>
        </div>
      </section>
    );
  }
  
  export default Contact;