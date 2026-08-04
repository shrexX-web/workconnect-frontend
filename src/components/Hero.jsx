import { Link } from 'react-router-dom';

function Hero() {
  return (
    <section className="hero">
      <div className="hero-content">
        <h5>Welcome to WorkConnect</h5>
        <h1>Find Trusted Local Service Professionals, Instantly</h1>
        <p>Post a job, get quotes from verified workers nearby, and hire with confidence.</p>
        <div className="hero-buttons">
          <a href="#post-job" className="btn-primary">I Need a Service</a>
          <Link to="/partner" className="btn-secondary">I'm a Craftsman — Join Free</Link>
        </div>
      </div>
    </section>
  );
}

export default Hero;