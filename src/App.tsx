import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { TourProvider } from './components/TourContext';
import TourOverlay from './components/TourOverlay';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Project from './pages/Project';
import Contact from './pages/Contact';
import Blog from './pages/Blog';
import PostDetail from './pages/PostDetail';

function App() {
  return (
    <BrowserRouter>
      <TourProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Project />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/post/:slug" element={<PostDetail />} />
        </Routes>
        <Footer />
        <TourOverlay />
      </TourProvider>
    </BrowserRouter>
  );
}

export default App;