import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import WhyUs from './components/WhyUs';
import Services from './components/Services';
import PostJob from './components/PostJob';
import Testimonials from './components/Testimonials';
import Footer from './components/Footer';
import About from './components/About';
import ServicesPage from './components/ServicesPage';
import Contact from './components/Contact';
import Partner from './components/Partner';
import Community from './components/Community';
import Admin from './components/Admin';
import Dashboard from './components/Dashboard';
import WorkerList from './components/WorkerList';
import CustomerLogin from './components/CustomerLogin';

function Home() {
  return (
    <>
      <Hero />
      <WhyUs />
      <Services />
      <PostJob />
      <Testimonials />
    </>
  );
}

function App() {
  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/partner" element={<Partner />} />
        <Route path="/community" element={<Community />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/workers/:service" element={<WorkerList />} />
        <Route path="/my-account" element={<CustomerLogin />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;