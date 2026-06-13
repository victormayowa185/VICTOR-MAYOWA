import { useRef, useState, useEffect } from 'react';
import { GiLinkedRings } from "react-icons/gi";
import gsap from 'gsap';
import { FaLaptopCode, FaReact } from "react-icons/fa6";
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import '../styles/home.css';

gsap.registerPlugin(ScrollTrigger);

const Home: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const [side, setSide] = useState<'left' | 'right' | null>(null);
  const circleRef = useRef<SVGCircleElement>(null);
  const cardsWrapperRef = useRef<HTMLDivElement>(null);
  const cardBRef = useRef<HTMLElement>(null);
  const flowerRef = useRef<HTMLDivElement>(null);
  const floatCircleRef = useRef<HTMLDivElement>(null);
  const bgWrapperRef = useRef<HTMLDivElement>(null);
  const shapeTriangleRef = useRef<HTMLDivElement>(null);
  const arcRef = useRef<HTMLDivElement>(null);
  const tiltIconRef = useRef<HTMLDivElement>(null);
  const typingTextRef = useRef<HTMLSpanElement>(null);
  const cursorRef = useRef<HTMLSpanElement>(null);

  // Hero mouse tracking (unchanged)
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const handleMouseMove = (e: MouseEvent) => {
      const rect = hero.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      setSide(mouseX < rect.width / 2 ? 'left' : 'right');
    };
    const handleMouseLeave = () => setSide(null);
    hero.addEventListener('mousemove', handleMouseMove);
    hero.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      hero.removeEventListener('mousemove', handleMouseMove);
      hero.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  // GSAP arc draw/erase loop (unchanged)
  useEffect(() => {
    const circle = circleRef.current;
    if (!circle) return;
    const radius = 150;
    const circumference = 2 * Math.PI * radius;
    gsap.set(circle, {
      strokeDasharray: circumference,
      strokeDashoffset: circumference,
      rotation: -90,
      transformOrigin: 'center center',
    });
    const tl = gsap.timeline({ repeat: -1 });
    tl.to(circle, { strokeDashoffset: 0, duration: 2, ease: 'power2.inOut' })
      .to({}, { duration: 0.5 })
      .to(circle, { strokeDashoffset: circumference, duration: 2, ease: 'power2.inOut' });
    return () => tl.kill();
  }, []);

  // Card-B underline draw/erase animation (unchanged)
  useEffect(() => {
    const cardB = cardBRef.current;
    if (!cardB) return;
    const line = cardB.querySelector<HTMLElement>('.underline-draw');
    if (!line) return;
    gsap.set(line, { scaleX: 0, transformOrigin: 'center center' });
    const tl = gsap.timeline({ repeat: -1, delay: 0.8 });
    tl.to(line, { scaleX: 1, duration: 0.9, ease: 'power2.out' })
      .to({}, { duration: 1.4 })
      .to(line, { scaleX: 0, duration: 0.7, ease: 'power2.in' })
      .to({}, { duration: 0.6 });
    return () => tl.kill();
  }, []);

  // Flower: anticlockwise jerk then full clockwise spin, repeat (unchanged)
  useEffect(() => {
    const flower = flowerRef.current;
    if (!flower) return;
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 2.8 });
    tl.to(flower, { rotation: -20, duration: 0.45, ease: 'power2.out' })
      .to(flower, { rotation: 360, duration: 1.5, ease: 'power3.inOut' })
      .set(flower, { rotation: 0 });
    return () => tl.kill();
  }, []);

  // Float circle: subtle float drift (unchanged)
  useEffect(() => {
    const el = floatCircleRef.current;
    if (!el) return;
    gsap.to(el, {
      y: -20,
      x: 14,
      duration: 3.8,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    });
    return () => gsap.killTweensOf(el);
  }, []);

  // Background shapes entrance on scroll (unchanged)
  useEffect(() => {
    const arc = arcRef.current;
    const triangle = shapeTriangleRef.current;
    const floatCircle = floatCircleRef.current;
    const flower = flowerRef.current;
    const wrapper = bgWrapperRef.current;
    if (!wrapper || !arc || !triangle || !floatCircle || !flower) return;

    gsap.set([arc, triangle, floatCircle, flower], { opacity: 0, scale: 0.5 });

    ScrollTrigger.create({
      trigger: wrapper,
      start: 'top 92%',
      onEnter: () => {
        gsap.to(arc, { opacity: 1, scale: 1, duration: 1.1, ease: 'back.out(1.5)' });
        gsap.to(triangle, { opacity: 1, scale: 1, duration: 1.0, ease: 'back.out(1.5)', delay: 0.15 });
        gsap.to(floatCircle, { opacity: 1, scale: 1, duration: 1.1, ease: 'back.out(1.2)', delay: 0.3 });
        gsap.to(flower, { opacity: 1, scale: 1, duration: 1.2, ease: 'back.out(1.8)', delay: 0.45 });
      },
    });
  }, []);

  // 🆕 PER‑CARD entrance on scroll – each card triggers individually
  useEffect(() => {
    const wrapper = cardsWrapperRef.current;
    if (!wrapper) return;

    // Get all cards
    const cards = Array.from(wrapper.querySelectorAll<HTMLElement>('.card'));
    if (!cards.length) return;

    // Initially hide all cards
    gsap.set(cards, { opacity: 0, y: 80 });

    // Store ScrollTriggers for cleanup
    const triggers: ScrollTrigger[] = [];

    // For each card, create its own ScrollTrigger
    cards.forEach((card) => {
      const trigger = ScrollTrigger.create({
        trigger: card,
        start: 'top 85%',
        onEnter: () => {
          gsap.to(card, {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: 'power2.out',
          });
        },
        once: true,
      });
      triggers.push(trigger);
    });

    // Hover scale effect (unchanged)
    const cleanups: (() => void)[] = [];
    cards.forEach((card) => {
      const onEnter = () => gsap.to(card, { scale: 1.02, duration: 0.25, ease: 'power2.out' });
      const onLeave = () => gsap.to(card, { scale: 1, duration: 0.25, ease: 'power2.out' });
      card.addEventListener('mouseenter', onEnter);
      card.addEventListener('mouseleave', onLeave);
      cleanups.push(() => {
        card.removeEventListener('mouseenter', onEnter);
        card.removeEventListener('mouseleave', onLeave);
      });
    });

    return () => {
      // Kill all ScrollTriggers
      triggers.forEach(trigger => trigger.kill());
      // Reset GSAP properties
      gsap.set(cards, { clearProps: 'all' });
      // Remove hover listeners
      cleanups.forEach(fn => fn());
    };
  }, []);

  // Standalone tilt icon (unchanged)
  useEffect(() => {
    const icon = tiltIconRef.current;
    if (!icon) return;

    let xRotation = 0;
    let yRotation = 0;
    let targetXRot = 0;
    let targetYRot = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = icon.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const maxRotate = 20;
      targetYRot = (dx / (rect.width / 2)) * maxRotate;
      targetXRot = (dy / (rect.height / 2)) * maxRotate;
      targetXRot = Math.min(maxRotate, Math.max(-maxRotate, targetXRot));
      targetYRot = Math.min(maxRotate, Math.max(-maxRotate, targetYRot));
    };

    const animate = () => {
      xRotation += (targetXRot - xRotation) * 0.1;
      yRotation += (targetYRot - yRotation) * 0.1;
      gsap.set(icon, { rotationX: -xRotation, rotationY: yRotation, transformPerspective: 600 });
      requestAnimationFrame(animate);
    };

    window.addEventListener('mousemove', handleMouseMove);
    const anim = requestAnimationFrame(animate);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(anim);
    };
  }, []);

  // Typing animation for Card E (unchanged)
  useEffect(() => {
    const textEl = typingTextRef.current;
    const cursorEl = cursorRef.current;
    if (!textEl || !cursorEl) return;

    const phrases = ["Hire Me", "Contact Me", "Let's Talk"];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    const type = () => {
      const currentPhrase = phrases[phraseIndex];
      if (!isDeleting && charIndex <= currentPhrase.length) {
        textEl.textContent = currentPhrase.substring(0, charIndex);
        charIndex++;
        if (charIndex > currentPhrase.length) {
          isDeleting = true;
          setTimeout(type, 1500);
          return;
        }
      } else if (isDeleting && charIndex >= 0) {
        textEl.textContent = currentPhrase.substring(0, charIndex);
        charIndex--;
        if (charIndex < 0) {
          isDeleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          setTimeout(type, 300);
          return;
        }
      }
      setTimeout(type, isDeleting ? 60 : 120);
    };

    const interval = setTimeout(type, 500);
    return () => clearTimeout(interval);
  }, []);

  // Refresh ScrollTrigger after images load (unchanged)
  useEffect(() => {
    ScrollTrigger.refresh();
  }, []);
  useEffect(() => {
    setTimeout(() => window.dispatchEvent(new Event('resize')), 1000)
  }, [])

  return (
    <>
      <div ref={heroRef} className="hero">
        <div className="grid">
          <div className={`leftColumn ${side === 'right' ? 'blur' : ''}`}>
            <h1 className="name">WEB DEVELOPER</h1>
            <p className="title">Creative Developer & Designer</p>
            <a href="/projects" className="about-ctaa">View work</a>
          </div>
          <div className="imageContainer">
            <img src="/see.png" alt="Professional web designer" className="image" />
          </div>
          <div className={`rightSpacer ${side === 'left' ? 'blur' : ''}`}>
            <div className="spacer-content">
              <h1 className="name2">&lt;CODER&gt;</h1>
              <p className="spacer-subtitle">Crafting code with soul</p>
              <div className="spacer-divider"></div>
              <ul className="spacer-skills">
                <li>React</li>
                <li>TypeScript</li>
                <li>Node.js</li>
              </ul>
              <p className="spacer-note">
                Currently building personal projects and refining my
                development workflow through hands-on practice.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="background-wrapper" ref={bgWrapperRef}>
        {/* Arc — top left */}
        <div className="animated-arc" ref={arcRef}>
          <svg viewBox="0 0 480 480" preserveAspectRatio="xMidYMid meet">
            <circle
              ref={circleRef}
              cx="240" cy="240" r="150"
              fill="none"
              stroke="rgba(78, 205, 196, 0.4)"
              strokeWidth="80"
              strokeLinecap="round"
            />
          </svg>
        </div>

        {/* Triangle — top right */}
        <div className="shape-triangle" ref={shapeTriangleRef}></div>

        {/* Floating circle — bottom right */}
        <div className="float-circle" ref={floatCircleRef}></div>

        {/* Flower — bottom left */}
        <div className="flower-shape" ref={flowerRef}>
          <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
              <ellipse
                key={i}
                cx="50" cy="34"
                rx="12" ry="22"
                fill="rgba(255, 182, 193, 0.65)"
                transform={`rotate(${angle} 50 50)`}
              />
            ))}
            <circle cx="50" cy="50" r="14" fill="rgba(255, 140, 170, 0.85)" />
            <circle cx="50" cy="50" r="6" fill="rgba(255,255,255,0.8)" />
          </svg>
        </div>

        <div className="section-intro">
          <h2>Selected Work & Skills</h2>
          <p>A glimpse of what I do – from responsive design to interactive projects.</p>
        </div>

        <div className="content-below-hero" ref={cardsWrapperRef}>
          <div className="top-row">
            {/* Card A */}
            <div className="card card-a">
              <div>
                <h3>Responsive Design</h3>
                <h2>Build websites that look perfect on any device</h2>
                <p>From mobile to desktop, I craft fluid, adaptable layouts that ensure a seamless user experience across all screen sizes.</p>
                <a href="/projects" className="card-link">See my work</a>
              </div>
              <div className="image-div">
                <img src="/picc.png" alt="Responsive design example" />
              </div>
            </div>

            {/* Card B — underline draw animation */}
            <article className="card card-b" ref={cardBRef}>
              <p className="card-role">
                <span className="underline-wrap">
                  A Web Developer
                  <span className="underline-draw"></span>
                </span>
              </p>
              <p className="card-desc">
                I create modern web experiences that combine clean design,
                thoughtful interactions, and efficient code.
              </p>
            </article>
          </div>

          <div className="grid-layout">

            {/* Card C */}

            <div className="card card-c">
              <div className="card-c-image">
                <iframe
                  src="https://my.spline.design/pixeltextsetcopycopy-E7YTanEkEBFIt2V5YdGzIzoN-S8V/"
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  allow="fullscreen; accelerometer; gyroscope; magnetometer; xr-spatial-tracking;"
                  allowFullScreen
                  title="3D Pixel Text"
                  loading="eager" // Changed from lazy for better entrance
                />
              </div>
              <div className="card-c-text">
                <h3>My Developer Portfolio</h3>
                <p className="card-desc">
                  A modern, responsive portfolio built with React – showcases my projects,
                  skills, and experience.
                </p>
                <div className="card-tech">React · CSS · TypeScript</div>
                <a href="https://victormayowa.vercel.app" className="card-linkC">
                  View Live
                </a>
              </div>
            </div>

            {/* Card D */}
            <div className="card card-d">
              <span className="card-badge">RECENT PROJECT</span>
              <h3 className="card-title">Tailoring Website</h3>
              <p className="card-desc">Responsive business website for a fashion brand – modern design, fast and mobile‑friendly.</p>
            </div>

            {/* Card E */}
            <div className="card card-e">
              <h3 className="cta-title">
                <span ref={typingTextRef} className="typed-text"></span>
                <span ref={cursorRef} className="typed-cursor">|</span>
              </h3>
              <div className="typing-scene">
                <svg className="typing-loop-svg" viewBox="0 0 140 120" xmlns="http://www.w3.org/2000/svg">
                  <g className="head-bob-e">
                    <ellipse cx="70" cy="24" rx="16" ry="18" fill="rgba(255,255,255,0.88)" />
                    <ellipse cx="70" cy="12" rx="16" ry="9" fill="rgba(200,200,200,0.4)" />
                    <circle cx="63" cy="22" r="2.5" fill="#444" />
                    <circle cx="77" cy="22" r="2.5" fill="#444" />
                    <circle cx="64" cy="21" r="0.9" fill="white" />
                    <circle cx="78" cy="21" r="0.9" fill="white" />
                    <path d="M65 30 Q70 34 75 30" stroke="rgba(180,180,180,0.8)" strokeWidth="1.2" fill="none" strokeLinecap="round" />
                  </g>
                  <rect x="65" y="41" width="10" height="8" fill="rgba(255,255,255,0.5)" />
                  <path d="M46 49 Q58 43 70 46 Q82 43 94 49 L98 88 L42 88 Z" fill="rgba(255,255,255,0.18)" />
                  <path className="arm-l" d="M46 57 Q34 72 40 90" stroke="rgba(255,255,255,0.45)" strokeWidth="8" fill="none" strokeLinecap="round" />
                  <path className="arm-r" d="M94 57 Q106 72 100 90" stroke="rgba(255,255,255,0.45)" strokeWidth="8" fill="none" strokeLinecap="round" />
                  <ellipse cx="40" cy="93" rx="7" ry="5" fill="rgba(255,255,255,0.4)" />
                  <ellipse cx="100" cy="93" rx="7" ry="5" fill="rgba(255,255,255,0.4)" />
                  <rect x="32" y="68" width="76" height="26" rx="3" fill="rgba(0,0,0,0.45)" />
                  <rect x="35" y="71" width="70" height="20" rx="2" fill="rgba(30,100,255,0.4)" />
                  <rect className="tl1" x="39" y="75" width="0" height="2.2" rx="1" fill="rgba(255,255,255,0.85)" />
                  <rect className="tl2" x="39" y="80" width="0" height="2.2" rx="1" fill="rgba(255,255,255,0.6)" />
                  <rect className="tl3" x="39" y="85" width="0" height="2.2" rx="1" fill="rgba(255,255,255,0.45)" />
                  <rect x="24" y="94" width="92" height="6" rx="2" fill="rgba(255,255,255,0.2)" />
                </svg>
              </div>
              <a href="/contact" className="cta-button">Get in touch</a>
            </div>

            {/* Card F */}
            <div className="card card-f card-utility">
              <FaLaptopCode className='card-emoji' />
              <h4>MAYO CodeSpace</h4>
              <p style={{ fontSize: '0.8rem', margin: '0.3rem 0' }}>Browser‑based coding environment</p>
              <a href="https://www.mayocode.vercel.app" className="card-link">Try IDE</a>
            </div>

            {/* Card G */}
            <div className="card card-g card-utility">
              <GiLinkedRings className='card-emoji' />
              <h4>LinkedIn</h4>
              <a href="https://www.linkedin.com/in/victor-mayowa-%F0%9F%A4%93-131704336/" className="card-link">Connect</a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;