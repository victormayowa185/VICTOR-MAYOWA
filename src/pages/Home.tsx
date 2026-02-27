import { useRef, useState, useEffect } from 'react';
import '../styles/home.css';

const Home: React.FC = () => {
  const heroRef = useRef<HTMLDivElement>(null);
  const [side, setSide] = useState<'left' | 'right' | null>(null);

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const handleMouseMove = (e: MouseEvent) => {
      const viewportWidth = window.innerWidth;
      const mouseX = e.clientX;
      setSide(mouseX < viewportWidth / 2 ? 'left' : 'right');
    };

    const handleMouseLeave = () => {
      setSide(null);
    };

    hero.addEventListener('mousemove', handleMouseMove);
    hero.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      hero.removeEventListener('mousemove', handleMouseMove);
      hero.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <>
      {/* Hero Section – only the grid, no extra content inside */}
      <div ref={heroRef} className="hero">
        <div className="grid">
          {/* Left column – text */}
          <div className={`leftColumn ${side === 'right' ? 'blur' : ''}`}>
            <h1 className="name">WEB DEVELOPER</h1>
            <p className="title">Creative Developer & Designer</p>
            <a href="/projects" className="about-ctaa">View work</a>
          </div>

          {/* Center column – image with overlays */}
          <div className="imageContainer">
            <img
              src="/see.png"
              alt="Professional web designer"
              className="image"
            />
            <div
              className={`imageOverlay leftOverlay ${side === 'left' ? 'active' : ''}`}
            />
            <div
              className={`imageOverlay rightOverlay ${side === 'right' ? 'active' : ''}`}
            />
          </div>

          {/* Right spacer – always visible, blurs when left side is hovered */}
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

      {/* WRAPPER for continuous background across intro and content */}
      <div className="background-wrapper">
        {/* 🔺 TRIANGLE SHAPE – decorative element */}
        <div className="shape-triangle"></div>

        {/* Section Intro */}
        <div className="section-intro">
          <h2>Selected Work & Skills</h2>
          <p>
            A glimpse of what I do – from responsive design to interactive
            projects.
          </p>
        </div>

        {/* Content Below Hero – Two separate sections */}
        <div className="content-below-hero">
          {/* Row 1: Two cards filling the full width (flex) */}
          <div className="top-row">
            {/* Card A – Featured */}
            <div className="card card-a">
              <div>
                <h3>Responsive Design</h3>
                <h2>Build websites that look perfect on any device</h2>
                <p>
                  From mobile to desktop, I craft fluid, adaptable layouts that
                  ensure a seamless user experience across all screen sizes.
                </p>
                <a href="/projects" className="card-link">
                  See my work
                </a>
              </div>
              <div className="image-div">
                <img src="/picc.png" alt="Responsive design example" />
              </div>
            </div>

            <article className="card card-b">
              <p className="card-role">A Web Developer</p>
              <p className="card-desc">
                I create modern web experiences that combine clean design,
                thoughtful interactions, and efficient code.
              </p>
            </article>
          </div>

          {/* Rows 2 & 3: 3‑column grid with tall card */}
          <div className="grid-layout">
            {/* Card C – Portfolio */}
            <div className="card card-c">
              <div>
                <img src="key.png" alt="Portfolio project" />
              </div>
              <div>
                <h3>My Developer Portfolio</h3>
                <p className="card-desc">
                  A modern, responsive portfolio built with React – showcases my
                  projects, skills, and experience.
                </p>
                <div className="card-tech">React · CSS · TypeScript</div>
                <a href="#" className="card-link">
                  View Live
                </a>
              </div>
            </div>

            {/* Card D – UI Experiments */}
            <div className="card card-d">
              <span className="card-badge">PROJECT</span>
              <h3 className="card-title">Tailoring Website</h3>
              <p className="card-desc">
                Responsive business website for a fashion brand – modern design,
                fast and mobile‑friendly.
              </p>
            </div>

            {/* Card E – Tall CTA (spans two rows) */}
            <div className="card card-e">
              <h3 className="cta-title">Let's build something together</h3>
              <a href="#" className="cta-button">
                Hire Me / Contact
              </a>
            </div>

            {/* Card F – GitHub */}
            <div className="card card-f card-utility">
              <span className="card-emoji">💻</span>
              <h4>MAYO CodeSpace</h4>
              <p style={{ fontSize: '0.8rem', margin: '0.3rem 0' }}>
                Browser‑based coding environment
              </p>
              <a href="www.mayocode.vercel.app" className="card-link a">
                Try IDE
              </a>
            </div>

            {/* Card G – LinkedIn */}
            <div className="card card-g card-utility">
              <span className="card-emoji">🔗</span>
              <h4>LinkedIn</h4>
              <a href="#" className="card-link">
                Connect
              </a>
            </div>



          </div>
        </div>
      </div>
    </>
  );
};

export default Home;