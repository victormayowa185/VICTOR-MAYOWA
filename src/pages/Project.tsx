import { useState, useEffect } from 'react';
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
}

const PROJECTS_QUERY = `*[_type == "project"]{
  title,
  description,
  tags,
  category,
  "logoUrl": logo.asset->url,
  "imageUrl": image.asset->url,
  projectUrl            
}`;

const categories = ['All', 'Website', 'App', 'UI'];

const ProjectsPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

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

  const filteredProjects = projects.filter((project) => {
    if (activeFilter === 'All') return true;
    return project.category === activeFilter.toLowerCase();
  });

  // Close modal when clicking overlay
  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setSelectedProject(null);
    }
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

      <div className="filter-buttons">
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
                onClick={() => setSelectedProject(project)}
              />
            ))}
          </div>
          {filteredProjects.length === 0 && (
            <p className="no-projects-message">Project in this category is yet to be deployed.</p>
          )}
        </>
      )}

      {/* ===== PROJECT DETAIL MODAL ===== */}
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
                Visit Site →
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectsPage;