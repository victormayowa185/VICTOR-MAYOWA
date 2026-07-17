import React from 'react';
import { Helmet } from 'react-helmet-async';
import { MdOutlineLaptopMac } from "react-icons/md";
import { IoSettingsOutline } from "react-icons/io5";
import { IoColorPalette } from "react-icons/io5";
import { LuTabletSmartphone } from "react-icons/lu";
import { FaGithub, FaUsers, FaRocket } from "react-icons/fa";
import { SiFramework } from "react-icons/si";
import '../styles/about.css';

const About: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>About Victor Mayowa – Web Developer & Designer</title>
        <meta
          name="description"
          content="Learn about Victor Mayowa, a creative web developer with 2+ years experience in React, TypeScript, and modern CSS. Based in Nigeria, focused on building practical projects."
        />
      </Helmet>

      <div className="about-page">
        <div className="about-wrapper">
          {/* ===== SIDEBAR (New - specific to About) ===== */}
          <div className="about-sidebar">
            <span className="about-sidebar-text">2026</span>
            <div className="about-sidebar-divider"></div>
            <span className="about-sidebar-text">Founder of MAYO X</span>
          </div>

          {/* ===== ABOUT CONTENT ===== */}
          <div className="about-content">
            {/* ROW 1: Profile Image + Bio */}
            <div className="about-row about-row-top">
              {/* Left Column – Image */}
              <div className="about-col about-col-left">
                <div className="profile-image-wrapper">
                  <img 
                    src="/pic2.png" 
                    alt="Victor Mayowa – Web Developer" 
                    className="profile-image"
                  />
                </div>
              </div>

              {/* Right Column – Bio + Main Stats */}
              <div className="about-col about-col-right">
                <div className="bio-content">
                  <h1 className="about-name">Victor Mayowa</h1>
                  <div className="about-divider"></div>
                  <p className="about-text">
                    I'm a web developer with a passion for crafting beautiful, functional digital experiences.
                    With over 2 years of experience in front-end and full-stack development, I specialize in
                    React, TypeScript, and modern CSS. I believe in writing clean, maintainable code and designing
                    interfaces that users love.
                  </p>
                  <p className="about-text">
                    Based in Nigeria, I focus on building practical projects that simulate real startup and business needs.
                    When I'm not coding, you'll find me dancing, or experimenting with new technologies.
                  </p>
                  <a href="/contact" className="about-cta">Let's Work Together</a>
                </div>
              </div>
            </div>

            {/* ROW 2: What I Do + Additional Stats */}
            <div className="about-row about-row-bottom">
              {/* Left Column – Skills */}
              <div className="about-col about-col-left">
                <div className="skills-section">
                  <h2 className="skills-title">What I Do</h2>
                  <div className="skills-grid">
                    <div className="skill-card">
                      <MdOutlineLaptopMac className='skill-icon' />
                      <h3>Frontend Development</h3>
                      <p>React, Vue, TypeScript, responsive design, and interactive interfaces.</p>
                    </div>
                    <div className="skill-card">
                      <IoSettingsOutline className='skill-icon' />
                      <h3>Backend &amp; APIs</h3>
                      <p>Node.js, Express, RESTful APIs, and database integration.</p>
                    </div>
                    <div className="skill-card">
                      <IoColorPalette className='skill-icon' />
                      <h3>UI/UX Design</h3>
                      <p>From wireframes to high-fidelity prototypes, focusing on user experience.</p>
                    </div>
                    <div className="skill-card">
                      <LuTabletSmartphone className='skill-icon' />
                      <h3>Mobile-First</h3>
                      <p>Building apps that work seamlessly across all devices.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column – Additional Stats */}
              <div className="about-col about-col-right">
                <div className="extra-stats-section">
                  <h2 className="extra-stats-title">More Highlights</h2>
                  <div className="stats-grid stats-grid-extra">
                    <div className="stat-item stat-item-extra">
                      <SiFramework className="stat-extra-icon" />
                      <span className="stat-number">5+</span>
                      <span className="stat-label">Frameworks</span>
                    </div>
                    <div className="stat-item stat-item-extra">
                      <FaGithub className="stat-extra-icon" />
                      <span className="stat-number">20+</span>
                      <span className="stat-label">GitHub Repos</span>
                    </div>
                    <div className="stat-item stat-item-extra">
                      <FaRocket className="stat-extra-icon" />
                      <span className="stat-number">3+</span>
                      <span className="stat-label">Startups</span>
                    </div>
                    <div className="stat-item stat-item-extra">
                      <FaUsers className="stat-extra-icon" />
                      <span className="stat-number">50+</span>
                      <span className="stat-label">Happy Clients</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ROW 3: Experience Timeline */}
            <div className="experience-section">
              <h2 className="experience-title">Experience &amp; Achievements</h2>
              <div className="timeline">

                <div className="timeline-item">
                  <div className="timeline-left">
                    <span className="timeline-year">2024 – Present</span>
                  </div>
                  <div className="timeline-right">
                    <h3>Frontend Web Developer (Projects)</h3>
                    <p>
                      Actively building modern, responsive web projects using HTML, CSS, JavaScript,
                      and React. Focused on clean UI, performance, and maintainable code.
                    </p>
                  </div>
                </div>

                <div className="timeline-item">
                  <div className="timeline-left">
                    <span className="timeline-year">2024 – Present</span>
                  </div>
                  <div className="timeline-right">
                    <h3>Personal &amp; Practice Projects</h3>
                    <p>
                      Developing hands-on projects that simulate real-world use cases, including
                      portfolio websites, landing pages, and interactive interfaces.
                    </p>
                  </div>
                </div>

                <div className="timeline-item">
                  <div className="timeline-left">
                    <span className="timeline-year">Aug 2025</span>
                  </div>
                  <div className="timeline-right">
                    <h3>Google Developer Program</h3>
                    <p>Joined the Google Developer Program – an official recognition of engagement with Google’s developer ecosystem.</p>
                    <a href="https://developers.google.com/profile/u/victormayowa185" target="_blank" rel="noopener noreferrer">
                      <img
                        src="/badge1.png"
                        alt="Google Developer Program badge"
                        className="badge-img"
                        loading="lazy"
                      />
                    </a>
                    <p className="badge-note">Click the badge to view it on my Google Developer profile.</p>
                  </div>
                </div>

                <div className="timeline-item">
                  <div className="timeline-left">
                    <span className="timeline-year">Nov 2025</span>
                  </div>
                  <div className="timeline-right">
                    <h3>Google Developer Group Discovery</h3>
                    <p>
                      Discovered and joined a Google Developer Group (GDG) account – connecting with local
                      developer communities and staying updated on tech events and initiatives.
                    </p>
                    <a href="https://developers.google.com/profile/u/victormayowa185" target="_blank" rel="noopener noreferrer">
                      <img
                        src="/badge2.png"
                        alt="Google Developer Group badge"
                        className="badge-img"
                        loading="lazy"
                      />
                    </a>
                    <p className="badge-note">Click the badge to view it on my Google Developer profile.</p>
                  </div>
                </div>

                <div className="timeline-item">
                  <div className="timeline-left">
                    <span className="timeline-year">Mar 2026</span>
                  </div>
                  <div className="timeline-right">
                    <h3>Chrome DevTools User</h3>
                    <p>
                      Earned the Chrome DevTools User badge by opening Chrome DevTools and inspecting a website.
                      This badge reflects hands‑on familiarity with the browser’s developer tools – essential for
                      debugging and performance optimisation.
                    </p>
                    <a href="https://developers.google.com/profile/u/victormayowa185" target="_blank" rel="noopener noreferrer">
                      <img
                        src="/badge3.png"
                        alt="Chrome DevTools badge"
                        className="badge-img"
                        loading="lazy"
                      />
                    </a>
                    <p className="badge-note">Click the badge to view it on my Google Developer profile.</p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;