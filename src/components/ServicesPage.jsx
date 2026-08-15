import { Link } from 'react-router-dom';

function ServicesPage() {
  const services = [
    { icon: "🔧", name: "Plumbing", slug: "plumbing", desc: "Leaks, installations, pipe repairs, and emergency fixes handled fast by licensed plumbers." },
    { icon: "💡", name: "Electrical", slug: "electrical", desc: "Wiring, fixture installs, panel upgrades, and safety inspections by certified electricians." },
    { icon: "🎨", name: "Painting", slug: "painting", desc: "Interior and exterior painting, touch-ups, and full home makeovers." },
    { icon: "🪚", name: "Carpentry", slug: "carpentry", desc: "Custom furniture, repairs, cabinetry, and structural woodwork." },
    { icon: "🧹", name: "Cleaning", slug: "cleaning", desc: "Deep cleaning, move-in/move-out cleans, and regular home maintenance." },
    { icon: "❄️", name: "AC Repair", slug: "ac-repair", desc: "Installation, servicing, gas refills, and emergency AC breakdowns." },
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
            <Link to={`/workers/${service.slug}`} className="service-link">Get a Quote →</Link>
          </div>
        ))}
      </div>
    </section>
  );
}

export default ServicesPage;