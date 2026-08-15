import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

function WorkerList() {
  const { service } = useParams();
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorkers();
  }, [service]);

  async function fetchWorkers() {
    setLoading(true);
    try {
      const res = await axios.get(`https://workconnect-backend-i80m.onrender.com/api/workers/by-service/${service}`);
      setWorkers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  const serviceLabel = service ? service.charAt(0).toUpperCase() + service.slice(1) : '';

  return (
    <section className="workerlist-page">
      <div className="workerlist-header">
        <h6>Get a Quote</h6>
        <h1>{serviceLabel} Professionals Near You</h1>
        <p>Browse verified {serviceLabel.toLowerCase()} craftsmen, or post a job and let them come to you.</p>
        <Link to="/#post-job" className="btn-secondary-dark">Post a Job Instead</Link>
      </div>

      {loading ? (
        <p className="workerlist-loading">Loading professionals...</p>
      ) : workers.length === 0 ? (
        <p className="workerlist-empty">No {serviceLabel.toLowerCase()} professionals registered yet. Check back soon, or post a job and we'll notify workers as they join.</p>
      ) : (
        <div className="workerlist-grid">
          {workers.map((worker) => (
            <div className="workerlist-card" key={worker._id}>
              <div className="workerlist-avatar">{worker.name.charAt(0)}</div>
              <h3>{worker.name}</h3>
              <p className="workerlist-area">📍 {worker.area}</p>
              <a href={`tel:${worker.phone}`} className="btn-primary">Call for Quote</a>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default WorkerList;