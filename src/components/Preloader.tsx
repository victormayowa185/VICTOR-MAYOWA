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

    const safetyTimer = setTimeout(finish, 3000);

    // Start the countdown immediately
    const startTimer = setTimeout(finish, 0);

    return () => {
      clearTimeout(safetyTimer);
      clearTimeout(startTimer);
    };
  }, [onFinished]);

  return (
    <div className={`preloader-overlay ${fadingOut ? 'preloader-fade-out' : ''}`}>
      <img src="/logo.webp" alt="Loading" className="preloader-logo" />
    </div>
  );
};

export default Preloader;