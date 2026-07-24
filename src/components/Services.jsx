function Services() {
    return (
      <section className="services">
        <div className="services-header">
          <h6>Our Services</h6>
          <h2>What Are You Looking For?</h2>
        </div>
        <div className="services-grid">
          <div className="service-card">
            <div className="service-icon">🔧</div>
            <h3>Plumbing</h3>
            <p>Leaks, installations, and repairs handled fast.</p>
          </div>
          <div className="service-card">
            <div className="service-icon">💡</div>
            <h3>Electrical</h3>
            <p>Wiring, fixtures, and safety checks by pros.</p>
          </div>
          <div className="service-card">
            <div className="service-icon">🎨</div>
            <h3>Painting</h3>
            <p>Interior and exterior painting, done right.</p>
          </div>
          <div className="service-card">
            <div className="service-icon">🪚</div>
            <h3>Carpentry</h3>
            <p>Custom furniture, repairs, and installations.</p>
          </div>
          <div className="service-card">
            <div className="service-icon">🧹</div>
            <h3>Cleaning</h3>
            <p>Deep cleaning for homes and offices.</p>
          </div>
          <div className="service-card">
            <div className="service-icon">❄️</div>
            <h3>AC Repair</h3>
            <p>Installation, servicing, and gas refills.</p>
          </div>
        </div>
      </section>
    );
  }
  
  export default Services;