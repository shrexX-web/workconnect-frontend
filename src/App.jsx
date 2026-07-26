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
      </Routes>
      <Footer />
    </div>
  );
}

export default App;