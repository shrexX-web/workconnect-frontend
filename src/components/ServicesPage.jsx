function ServicesPage() {
    const services = [
      { icon: "🔧", name: "Plumbing", desc: "Leaks, installations, pipe repairs, and emergency fixes handled fast by licensed plumbers." },
      { icon: "💡", name: "Electrical", desc: "Wiring, fixture installs, panel upgrades, and safety inspections by certified electricians." },
      { icon: "🎨", name: "Painting", desc: "Interior and exterior painting, touch-ups, and full home makeovers." },
      { icon: "🪚", name: "Carpentry", desc: "Custom furniture, repairs, cabinetry, and structural woodwork." },
      { icon: "🧹", name: "Cleaning", desc: "Deep cleaning, move-in/move-out cleans, and regular home maintenance." },
      { icon: "❄️", name: "AC Repair", desc: "Installation, servicing, gas refills, and emergency AC breakdowns." },
      { icon: "🔨", name: "Masonry", desc: "Brickwork, tiling, flooring, and structural repairs." },
      { icon: "🚪", name: "Home Renovation", desc: "Full or partial renovations, from kitchens to bathrooms." },
    ];
  
    return (
      <section className="services-page">
        <div className="services-page-header">
          <h6>Our Services</h6>
          <h1>Every Home Service, One Platform</h1>
          <p>Browse our full range of verified professionals across every category. Post a job and get quotes within minutes.</p>
        </div>
        <div className="services-page-grid">
          {services.map((service, index) => (
            <div className="service-page-card" key={index}>
              <div className="service-icon">{service.icon}</div>
              <h3>{service.name}</h3>
              <p>{service.desc}</p>
              <a href="/#post-job" className="service-link">Get a Quote →</a>
            </div>
          ))}
        </div>
      </section>
    );
  }
  
  export default ServicesPage;