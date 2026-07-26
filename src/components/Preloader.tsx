import React, { useEffect, useState } from 'react';
import '../styles/preloader.css';

interface PreloaderProps {
  onFinished: () => void;
}

const MIN_DISPLAY_TIME = 500; // ms — avoids a jarring instant flash on fast connections

const Preloader: React.FC<PreloaderProps> = ({ onFinished }) => {
  const [fadingOut, setFadingOut] = useState(false);

  useEffect(() => {
    const startTime = Date.now();
    let settled = false;

    const finish = () => {
      if (settled) return;
      settled = true;

      const elapsed = Date.now() - startTime;
      const remaining = Math.max(MIN_DISPLAY_TIME - elapsed, 0);

      setTimeout(() => {
        setFadingOut(true);
        // Wait for the fade-out CSS transition to finish before unmounting
        setTimeout(onFinished, 400);
      }, remaining);
    };

    const img = new Image();
    img.src = '/pic2.png';
    img.onload = finish;
    img.onerror = finish; // don't hang the site forever on a genuinely broken image

    // Safety net: if something goes wrong and neither event fires, don't trap the user
    const fallbackTimer = setTimeout(finish, 8000);

    return () => clearTimeout(fallbackTimer);
  }, [onFinished]);

  return (
    <div className={`preloader-overlay ${fadingOut ? 'preloader-fade-out' : ''}`}>
      <img src="/logo.png" alt="Loading" className="preloader-logo" />
    </div>
  );
};

export default Preloader;