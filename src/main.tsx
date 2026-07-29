import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import Preloader from './components/Preloader';

const Root: React.FC = () => {
  const [loading, setLoading] = useState(true);

  const handlePreloaderFinished = () => {
    setLoading(false);
    // Let any component (like Navbar) know it's safe to play entrance animations
    (window as any).__preloaderFinished = true;
    window.dispatchEvent(new Event('preloader-finished'));
  };

  return (
    <>
      {loading && <Preloader onFinished={handlePreloaderFinished} />}
      <App />
    </>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);