function Testimonials() {
    return (
      <section className="testimonials">
        <div className="testimonials-header">
          <h6>Testimonials</h6>
          <h2>What Our Customers Say</h2>
        </div>
        <div className="testimonials-grid">
          <div className="testimonial-card">
            <p>"Found a plumber in 20 minutes flat. No calling around, no waiting. Genuinely fixed my problem the same day."</p>
            <div className="testimonial-author">
              <h4>Aarav Mehta</h4>
              <span>Homeowner</span>
            </div>
          </div>
          <div className="testimonial-card">
            <p>"The rating system actually means something here. Hired an electrician with 50+ reviews and it showed."</p>
            <div className="testimonial-author">
              <h4>Priya Nair</h4>
              <span>Working Professional</span>
            </div>
          </div>
          <div className="testimonial-card">
            <p>"As a painter, this app brings me way more local jobs than I used to get through word of mouth."</p>
            <div className="testimonial-author">
              <h4>Rohan Deshmukh</h4>
              <span>Painter, Fixado Pro</span>
            </div>
          </div>
        </div>
      </section>
    );
  }
  
  export default Testimonials;