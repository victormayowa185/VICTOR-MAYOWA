import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import Preloader from './components/Preloader';

const Root: React.FC = () => {
  const [loading, setLoading] = useState(true);

  return (
    <>
      {loading && <Preloader onFinished={() => setLoading(false)} />}
      <App />
    </>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);