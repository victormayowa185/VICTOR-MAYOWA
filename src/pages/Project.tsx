import { useState, useEffect } from 'react';
import ProjectCard from './ProjectCard';
import { client } from '../sanity/client';
import '../styles/project.css';

interface Project {
  logoUrl: string;
  title: string;
  description: string;
  tags: string[];
  imageUrl: string;
  category: 'website' | 'app' | 'ui' | 'other';
  projectUrl: string; // 👈 new field
}

const PROJECTS_QUERY = `*[_type == "project"]{
  title,
  description,
  tags,
  category,
  "logoUrl": logo.asset->url,
  "imageUrl": image.asset->url,
  projectUrl               // 👈 include in query
}`;

const categories = ['All', 'Website', 'App', 'UI'];

const ProjectsPage = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('All');

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

  return (
    <div className="projects-page">
      <div className="projects-header">
        <h1>Projects</h1>
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
                logoUrl={project.logoUrl}
                title={project.title}
                description={project.description}
                tags={project.tags}
                imageUrl={project.imageUrl}
                projectUrl={project.projectUrl} // 👈 pass new prop
              />
            ))}
          </div>
          {filteredProjects.length === 0 && (
            <p className="no-projects-message">Project in this category is yet to be deployed.</p>
          )}
        </>
      )}
    </div>
  );
};

export default ProjectsPage;