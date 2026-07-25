// src/pages/Project.tsx
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

const ProjectsPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isPillSticky, setIsPillSticky] = useState(false);

  const sentinelRef = useRef<HTMLDivElement>(null);
  const lastScrollY = useRef(0);
  const pillActiveRef = useRef(false);

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

  // Same navbar-swap scroll mechanic as the blog page's search bar
  useEffect(() => {
    const handleScroll = () => {
      if (!sentinelRef.current) return;

      const sentinelTop = sentinelRef.current.getBoundingClientRect().top;
      const pastThreshold = sentinelTop <= 0;
      const currentY = window.scrollY;
      const scrollingDown = currentY > lastScrollY.current;
      lastScrollY.current = currentY;

      const shouldShowPill = pastThreshold ? scrollingDown : false;

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

  // Helper to get category label for display
  const getCategoryLabel = (category: string) => {
    const map: Record<string, string> = {
      website: 'Website',
      app: 'App',
      ui: 'UI',
      other: 'Other'
    };
    return map[category] || category;
  };

  // Helper to get category color
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
      <div className="projects-header">
        <h1>View my Works</h1>
        <p>
          A selection of my recent work across web, mobile, and user interfaces.
          Each project reflects a unique challenge and solution.
        </p>
      </div>

      <div ref={sentinelRef} className="filter-sentinel" />

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
        <>
          <div className="projects-grid">
            {filteredProjects.map((project) => (
              <ProjectCard
                key={project.title}
                title={project.title}
                imageUrl={project.imageUrl}
                createdAt={project.createdAt}
                category={project.category}
                onClick={() => setSelectedProject(project)}
              />
            ))}
          </div>
          {filteredProjects.length === 0 && (
            <p className="no-projects-message">No projects in this category yet.</p>
          )}
        </>
      )}

      {selectedProject && (
        <div className="project-modal-overlay" onClick={handleOverlayClick}>
          <div className="project-modal">
            <div className="project-modal-header">
              <div className="project-modal-title-wrapper">
                <h2>{selectedProject.title}</h2>
                <span 
                  className="project-modal-category"
                  style={{ backgroundColor: getCategoryColor(selectedProject.category) }}
                >
                  {getCategoryLabel(selectedProject.category)}
                </span>
              </div>
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
              {selectedProject.projectUrl && (
                <a
                  href={selectedProject.projectUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="project-modal-link"
                >
                  Visit Site →
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;