import { useState, useEffect, useRef } from 'react';
import ProjectCard from './ProjectCard';
import { client } from '../sanity/client';
import { FiX } from 'react-icons/fi';
import '../styles/project.css';

interface Project {
  logoUrl: string;
  title: string;
  description: string;
  tags: string[];
  imageUrl: string;
  category: 'website' | 'app' | 'ui' | 'other';
  projectUrl: string;
  createdAt: string;
}

const PROJECTS_QUERY = `*[_type == "project"] | order(_createdAt desc){
  title,
  description,
  tags,
  category,
  "logoUrl": logo.asset->url,
  "imageUrl": image.asset->url,
  projectUrl,
  "createdAt": _createdAt
}`;

const categories = ['All', 'Website', 'App', 'UI'];

// Buffer zone (in px) around the trigger point so tiny scroll jitter near
// the threshold doesn't cause the pill to flicker on/off rapidly.
const SHOW_THRESHOLD = -20;
const HIDE_THRESHOLD = 20;

const ProjectsPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isPillSticky, setIsPillSticky] = useState(false);

  const sentinelRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);
  const pillActiveRef = useRef(false);
  const scrollingDownRef = useRef(false);

  useEffect(() => {
    client.fetch(PROJECTS_QUERY)
      .then(data => {
        setProjects(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Sanity fetch error:', err);
        setLoading(false);
      });
  }, []);

  // Same navbar-swap scroll mechanic as the blog page, but with the sentinel
  // sitting right at the very top of the page (so even a short page with
  // little scroll room can still cross the trigger), plus a buffer zone
  // to prevent rapid on/off flicker right at the boundary.
  useEffect(() => {
    const handleScroll = () => {
      if (!sentinelRef.current) return;

      const currentY = window.scrollY;
      const delta = currentY - lastScrollY.current;

      // Ignore tiny jitter (common with trackpads/inertia scrolling) so
      // direction detection doesn't flip-flop on every 1-2px micro-movement.
      if (Math.abs(delta) > 4) {
        scrollingDownRef.current = delta > 0;
        lastScrollY.current = currentY;
      }

      const sentinelTop = sentinelRef.current.getBoundingClientRect().top;
      const scrollingDown = scrollingDownRef.current;

      let shouldShowPill = pillActiveRef.current;

      if (!pillActiveRef.current && sentinelTop <= SHOW_THRESHOLD && scrollingDown) {
        shouldShowPill = true;
      } else if (pillActiveRef.current && (sentinelTop >= HIDE_THRESHOLD || !scrollingDown)) {
        shouldShowPill = false;
      }

      if (shouldShowPill !== pillActiveRef.current) {
        pillActiveRef.current = shouldShowPill;
        setIsPillSticky(shouldShowPill);
        window.dispatchEvent(
          new CustomEvent('navbar-visibility', { detail: { hidden: shouldShowPill } })
        );
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const filteredProjects = projects.filter((project) => {
    if (activeFilter === 'All') return true;
    return project.category === activeFilter.toLowerCase();
  });

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setSelectedProject(null);
    }
  };

  const getCategoryLabel = (category: string) => {
    const map: Record<string, string> = {
      website: 'Website',
      app: 'App',
      ui: 'UI',
      other: 'Other'
    };
    return map[category] || category;
  };

  const getCategoryColor = (category: string) => {
    const map: Record<string, string> = {
      website: '#7C3EFF',
      app: '#059669',
      ui: '#2563EB',
      other: '#D97706'
    };
    return map[category] || '#7C3EFF';
  };

  return (
    <div className="projects-page">
      {/* Sentinel sits at the very top of the page, right under the
          navbar, so even a short page with little scroll room still
          crosses it easily. */}
      <div ref={sentinelRef} className="filter-sentinel" />

      {/* Fade-in animation lives on this wrapper instead of the page root —
          a `transform`/`animation` on an ancestor breaks `position: fixed`
          for any descendant, which was making the sticky pill scroll away
          with the page instead of staying glued to the screen. The filter
          buttons below sit OUTSIDE this wrapper for that exact reason. */}
      <div className="page-fade-in">
        <div className="projects-header">
          <h1>View my Works</h1>
         <p>Web, mobile, and UI projects — built to solve real problems.</p>
        </div>
      </div>

      <div className={`project-filter-buttons ${isPillSticky ? 'pill-mode' : ''}`}>
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveFilter(cat)}
            className={activeFilter === cat ? 'active' : ''}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading && <p className="loading-message">Loading projects...</p>}

      {!loading && (
        <div className="page-fade-in">
          <div className="projects-grid">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.title}
                title={project.title}
                imageUrl={project.imageUrl}
                createdAt={project.createdAt}
                onClick={() => setSelectedProject(project)}
              />
            ))}
          </div>
          {filteredProjects.length === 0 && (
            <p className="no-projects-message">Project in this category is yet to be deployed.</p>
          )}
        </div>
      )}

      {selectedProject && (
        <div className="project-modal-overlay" onClick={handleOverlayClick}>
          <div className="project-modal">
            <div className="project-modal-header">
              <h2>{selectedProject.title}</h2>
              <button
                className="project-modal-close"
                onClick={() => setSelectedProject(null)}
              >
                <FiX />
              </button>
            </div>
            <div className="project-modal-body">
              <p className="project-modal-description">{selectedProject.description}</p>
              {selectedProject.tags && selectedProject.tags.length > 0 && (
                <div className="project-modal-tags">
                  {selectedProject.tags.map((tag) => (
                    <span key={tag} className="project-modal-tag">{tag}</span>
                  ))}
                </div>
              )}
              <a
                href={selectedProject.projectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="project-modal-link"
              >
                Visit Site
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;