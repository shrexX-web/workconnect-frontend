import { useNavigate } from 'react-router-dom';

function Services() {
  const navigate = useNavigate();

  const services = [
    { icon: "🔧", name: "Plumbing", slug: "plumbing", desc: "Leaks, installations, and repairs handled fast." },
    { icon: "💡", name: "Electrical", slug: "electrical", desc: "Wiring, fixtures, and safety checks by pros." },
    { icon: "🎨", name: "Painting", slug: "painting", desc: "Interior and exterior painting, done right." },
    { icon: "🪚", name: "Carpentry", slug: "carpentry", desc: "Custom furniture, repairs, and installations." },
    { icon: "🧹", name: "Cleaning", slug: "cleaning", desc: "Deep cleaning for homes and offices." },
    { icon: "❄️", name: "AC Repair", slug: "ac-repair", desc: "Installation, servicing, and gas refills." },
  ];

  return (
    <section className="services">
      <div className="services-header">
        <h6>Our Services</h6>
        <h2>What Are You Looking For?</h2>
      </div>
      <div className="services-grid">
        {services.map((service, index) => (
          <div
            className="service-card"
            key={index}
            role="button"
            tabIndex={0}
            onClick={() => navigate(`/workers/${service.slug}`)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') navigate(`/workers/${service.slug}`);
            }}
          >
            <div className="service-icon">{service.icon}</div>
            <h3>{service.name}</h3>
            <p>{service.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Services;