import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HelmetProvider, Helmet } from 'react-helmet-async';
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
    <HelmetProvider>                  
      <BrowserRouter>
        <TourProvider>
          <Navbar />
          {/* Default meta tags for the whole site */}
          <Helmet>
            <title>Victor Mayowa – Web Developer & Designer</title>
            <meta name="description" content="Portfolio and blog of Victor Mayowa, a creative web developer sharing coding news, tutorials, and resources." />
            <meta property="og:title" content="Victor Mayowa" />
            <meta property="og:description" content="Portfolio and blog of Victor Mayowa, a creative web developer." />
            <meta property="og:image" content="https://yourdomain.com/default-og-image.png" /> {/* replace with your actual image URL */}
            <meta property="og:url" content="https://yourdomain.com" />
            <meta name="twitter:card" content="summary_large_image" />
          </Helmet>
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
    </HelmetProvider>
  );
}

export default App;