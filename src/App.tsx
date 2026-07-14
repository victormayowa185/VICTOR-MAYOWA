import { RouterProvider, createBrowserRouter, Outlet } from 'react-router-dom';
import { HelmetProvider, Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';
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

// Layout component that wraps every page
function RootLayout() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <>
      <Navbar />
      <Outlet />
      {!isHome && <Footer />}
      <TourOverlay />
    </>
  );
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'about', element: <About /> },
      { path: 'projects', element: <Project /> },
      { path: 'contact', element: <Contact /> },
      { path: 'blog', element: <Blog /> },
      { path: 'post/:slug', element: <PostDetail /> },
    ],
  },
]);

function App() {
  return (
    <HelmetProvider>
      <TourProvider>
        <Helmet>
          <title>Victor Mayowa – Web Developer & Designer</title>
          <meta name="description" content="Portfolio and blog of Victor Mayowa, a creative web developer sharing coding news, tutorials, and resources." />
          <meta property="og:title" content="Victor Mayowa" />
          <meta property="og:description" content="Portfolio and blog of Victor Mayowa, a creative web developer." />
          <meta property="og:image" content="https://yourdomain.com/default-og-image.png" />
          <meta property="og:url" content="https://yourdomain.com" />
          <meta name="twitter:card" content="summary_large_image" />
        </Helmet>
        <RouterProvider router={router} />
      </TourProvider>
    </HelmetProvider>
  );
}

export default App;