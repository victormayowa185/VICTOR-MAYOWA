import React from 'react';
import '../styles/about.css';

const About: React.FC = () => {
  return (
    <div className="con"> {/* reuse the same wrapper for consistent background */}
      <div className="about-container">
        {/* Left column: image */}

        {/* Right column: bio */}
        <div className="about-bio">
          <h1 className="about-name">Victor Mayowa </h1>
          <p className="about-title">Creative Web Developer & Designer</p>
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
          <div className="about-stats">
            <div className="stat-item">
              <span className="stat-number">2+</span>
              <span className="stat-label">Years Experience</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">10+</span>
              <span className="stat-label">Projects Completed</span>
            </div>

          </div>
          <a href="/contact" className="about-cta">Let's Work Together</a>
        </div>
      </div>

      {/* Skills / Services Section */}
      <div className="skills-section">
        <h2 className="skills-title">What I Do</h2>
        <div className="skills-grid">
          <div className="skill-card">
            <div className="skill-icon">💻</div>
            <h3>Frontend Development</h3>
            <p>React, Vue, TypeScript, responsive design, and interactive interfaces.</p>
          </div>
          <div className="skill-card">
            <div className="skill-icon">⚙️</div>
            <h3>Backend & APIs</h3>
            <p>Node.js, Express, RESTful APIs, and database integration.</p>
          </div>
          <div className="skill-card">
            <div className="skill-icon">🎨</div>
            <h3>UI/UX Design</h3>
            <p>From wireframes to high-fidelity prototypes, focusing on user experience.</p>
          </div>
          <div className="skill-card">
            <div className="skill-icon">📱</div>
            <h3>Mobile-First</h3>
            <p>Building apps that work seamlessly across all devices.</p>
          </div>
        </div>
      </div>

      {/* Experience Timeline (optional) */}

      <div className="experience-section">
        <h2 className="experience-title">Experience</h2>
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
              <h3>Personal & Practice Projects</h3>
              <p>
                Developing hands-on projects that simulate real-world use cases, including
                portfolio websites, landing pages, and interactive interfaces.
              </p>
            </div>
          </div>

        </div>
      </div>





    </div>
  );
};

export default About;