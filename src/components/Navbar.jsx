import { Link } from 'react-router-dom';

function Navbar() {
  return (
    <nav>
      <div className="logo">WorkConnect</div>
      <ul className="nav-links">
        <li><Link to="/">Home</Link></li>
        <li><Link to="/about">About</Link></li>
        <li><Link to="/services">Services</Link></li>
        <li><Link to="/community">Community</Link></li>
        <li><Link to="/contact">Contact</Link></li>
        <li><Link to="/my-account">My Jobs</Link></li>
        <li><Link to="/dashboard">Worker Login</Link></li>
      </ul>
    </nav>
  );
}

export default Navbar;