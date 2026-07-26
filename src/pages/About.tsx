import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { MdOutlineLaptopMac } from "react-icons/md";
import { IoSettingsOutline } from "react-icons/io5";
import { IoColorPalette } from "react-icons/io5";
import { LuTabletSmartphone } from "react-icons/lu";
import { FaGithub, FaUsers, FaRocket, FaCode, FaLaptopCode } from "react-icons/fa";
import { SiFramework } from "react-icons/si";
import { FiChevronLeft, FiChevronRight, FiX } from "react-icons/fi";
import TypewriterText from '../components/TypewriterText';
import '../styles/about.css';

const About: React.FC = () => {
  const [showTimeline, setShowTimeline] = useState(false);

  // Achievement data with verify links for Google badges
  const achievements = [
    {
      id: 1,
      title: 'I/O 2026 - Registered',
      date: 'Apr 15, 2026',
      description: 'Registered for Google I/O 2026 – the annual developer conference featuring the latest in Google technology, AI, and developer tools.',
      badgeImage: '/Certificate/badge-io2026.png',
      type: 'badge',
      verifyLink: 'https://developers.google.com/profile/badges/events/io/2026/registered?u=victormayowa185',
    },
    {
      id: 2,
      title: 'Google Developer Group on Campus member',
      date: 'Apr 13, 2026',
      description: 'Member of Google Developer Group on Campus – connecting with fellow developers and participating in community events.',
      badgeImage: '/Certificate/badge-gdg-campus.png',
      type: 'badge',
      verifyLink: 'https://developers.google.com/profile/badges/community/gdg/GDGoC/member?u=victormayowa185',
    },
    {
      id: 3,
      title: 'GDG on Campus Federal University of Technology - Owerri, Nigeria Member',
      date: 'Apr 13, 2026',
      description: 'Member of GDG on Campus at FUTO, Owerri, Nigeria – building a local developer community and sharing knowledge.',
      badgeImage: '/Certificate/badge-gdg-futo.png',
      type: 'badge',
      verifyLink: 'https://developers.google.com/profile/badges/community/gdg/chapter/member/gdg-on-campus-federal-university-of-technology-owerri-nigeria?u=victormayowa185',
    },
    {
      id: 4,
      title: 'Learning',
      date: 'Mar 22, 2026',
      description: 'Google Developer Profile badge for learning activities – demonstrating commitment to continuous learning and skill development.',
      badgeImage: '/Certificate/badge-learning.png',
      type: 'badge',
      verifyLink: 'https://developers.google.com/profile/badges/recognitions/learnings?u=victormayowa185',
    },
    {
      id: 5,
      title: 'Identity',
      date: 'Mar 22, 2026',
      description: 'Google Developer Profile badge for identity verification – confirming the authenticity of your developer profile.',
      badgeImage: '/Certificate/badge-identity.png',
      type: 'badge',
      verifyLink: 'https://developers.google.com/profile/badges/playlists/identity?u=victormayowa185',
    },
    {
      id: 6,
      title: 'Chrome DevTools User',
      date: 'Mar 21, 2026',
      description: 'Earned the Chrome DevTools User badge by opening Chrome DevTools and inspecting a website. This badge reflects hands‑on familiarity with the browser\'s developer tools – essential for debugging and performance optimisation.',
      badgeImage: '/Certificate/badge-chrome-devtools.png',
      type: 'badge',
      verifyLink: 'https://developers.google.com/profile/badges/activity/chrome-devtools/chrome-devtools-user?u=victormayowa185',
    },
    {
      id: 7,
      title: 'Google Developer Group discovery',
      date: 'Nov 14, 2025',
      description: 'Discovered and joined a Google Developer Group (GDG) account – connecting with local developer communities and staying updated on tech events and initiatives.',
      badgeImage: '/Certificate/badge-gdg-discovery.png',
      type: 'badge',
      verifyLink: 'https://developers.google.com/profile/badges/community/gdg/discovery?u=victormayowa185',
    },
    {
      id: 8,
      title: 'Joined the Google Developer Program',
      date: 'Nov 14, 2025',
      description: 'Joined the official Google Developer Program – an official recognition of engagement with Google\'s developer ecosystem.',
      badgeImage: '/Certificate/badge-google-dev-program.png',
      type: 'badge',
      verifyLink: 'https://developers.google.com/profile/badges/profile/created-profile?u=victormayowa185',
    },
    {
      id: 9,
      title: 'Frontend Web Developer',
      date: '2024 – Present',
      description: 'Actively building modern, responsive web projects using HTML, CSS, JavaScript, and React. Focused on clean UI, performance, and maintainable code.',
      badgeImage: null,
      type: 'project',
      icon: <FaCode size={48} />,
    },
    {
      id: 10,
      title: 'Personal Practice Projects',
      date: '2024 – Present',
      description: 'Developing hands-on projects that simulate real-world use cases, including portfolio websites, landing pages, and interactive interfaces.',
      badgeImage: null,
      type: 'project',
      icon: <FaLaptopCode size={48} />,
    },
  ];

  // Duplicate array for seamless marquee
  const carouselItems = [...achievements, ...achievements];

  const toggleTimeline = () => {
    setShowTimeline(!showTimeline);
  };

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
          {/* ===== SIDEBAR ===== */}
          <div className="about-sidebar">
            <span className="about-sidebar-text">2026</span>
            <div className="about-sidebar-divider"></div>
            <span className="about-sidebar-text">Founder of MAYO X</span>
          </div>

          {/* ===== ABOUT CONTENT ===== */}
          <div className="about-content">
            {/* ROW 1: Profile Image + Bio */}
            <div className="about-row about-row-top">
              <div className="about-col about-col-left">
                <div className="profile-image-wrapper">
                  <img
                    src="/pic2.png"
                    alt="Victor Mayowa – Web Developer"
                    className="profile-image"
                  />
                </div>
              </div>

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

              <div className="about-col about-col-right">
                <div className="extra-stats-section">
                  <h2 className="extra-stats-title">More Highlights</h2>
                  <div className="stats-grid stats-grid-extra">
                    <div className="stat-item stat-item-extra">
                      <SiFramework className="stat-extra-icon" />
                      <span className="stat-number">
                        <TypewriterText
                          words={['5+', '8+', '10+', '12+', '15+']}
                          typingSpeed={80}
                          deletingSpeed={40}
                          pauseDuration={2000}
                        />
                      </span>
                      <span className="stat-label">Frameworks</span>
                    </div>
                    <div className="stat-item stat-item-extra">
                      <FaGithub className="stat-extra-icon" />
                      <span className="stat-number">
                        <TypewriterText
                          words={['20+', '25+', '30+', '35+', '40+']}
                          typingSpeed={80}
                          deletingSpeed={40}
                          pauseDuration={2000}
                        />
                      </span>
                      <span className="stat-label">GitHub Repos</span>
                    </div>
                    <div className="stat-item stat-item-extra">
                      <FaRocket className="stat-extra-icon" />
                      <span className="stat-number">
                        <TypewriterText
                          words={['3+', '5+', '7+', '10+', '12+']}
                          typingSpeed={80}
                          deletingSpeed={40}
                          pauseDuration={2000}
                        />
                      </span>
                      <span className="stat-label">Startups</span>
                    </div>
                    <div className="stat-item stat-item-extra">
                      <FaUsers className="stat-extra-icon" />
                      <span className="stat-number">
                        <TypewriterText
                          words={['50+', '60+', '75+', '100+', '120+']}
                          typingSpeed={80}
                          deletingSpeed={40}
                          pauseDuration={2000}
                        />
                      </span>
                      <span className="stat-label">Happy Clients</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ===== ROW 3: Certificates & Achievements (auto‑scrolling marquee) ===== */}
            <div className="certificates-section">
              <h2 className="certificates-title">Certificates &amp; Achievements</h2>

              {/* Horizontal Carousel – infinite scroll */}
              <div className="carousel-container">
                <div className="carousel-track">
                  {carouselItems.map((item, index) => (
                    <div key={`${item.id}-${index}`} className="achievement-card">
                      <div className="achievement-image-wrapper">
                        {item.type === 'badge' && item.badgeImage ? (
                          <img
                            src={item.badgeImage}
                            alt={item.title}
                            className="achievement-badge"
                          />
                        ) : (
                          <div className="achievement-icon-wrapper">
                            {item.icon}
                          </div>
                        )}
                      </div>
                      <h3 className="achievement-title">{item.title}</h3>
                      <span className="achievement-date">{item.date}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* View Timeline Button */}
              <div className="timeline-button-wrapper">
                <button
                  className="view-timeline-btn"
                  onClick={toggleTimeline}
                >
                  {showTimeline ? 'Hide Timeline' : 'View Timeline'}
                </button>
              </div>

              {/* Timeline Popup */}
             {showTimeline && (
                <div
                  className="timeline-overlay"
                  onClick={(e) => {
                    if (e.target === e.currentTarget) toggleTimeline();
                  }}
                >
                  <div className="timeline-popup" onClick={(e) => e.stopPropagation()}>
                    <div className="timeline-popup-scroll">
                      <div className="timeline-popup-header">
                        <h3>Certificates &amp; Achievements</h3>
                        <button className="timeline-close-btn" onClick={toggleTimeline}>
                          <FiX />
                        </button>
                      </div>
                      <div className="timeline-popup-content">
                        {achievements.map((item, index) => (
                          <div key={item.id} className="timeline-item">
                            <div className="timeline-item-left">
                              <span className="timeline-year">{item.date}</span>
                              {index < achievements.length - 1 && (
                                <div className="timeline-connector"></div>
                              )}
                            </div>
                            <div className="timeline-item-right">
                              <h3>{item.title}</h3>
                              <p>{item.description}</p>
                           
                            
                              {item.verifyLink && (
                                <a
                                  href={item.verifyLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="timeline-verify-link"
                                >
                                  Verify on Google →
                                </a>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;