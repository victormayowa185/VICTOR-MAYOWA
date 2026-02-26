import { FC } from 'react';
import '../styles/projectCard.css';

interface ProjectCardProps {
  logoUrl: string;
  title: string;
  description: string;
  tags: string[];
  imageUrl: string;
  projectUrl: string; // 👈 new prop
}

const ProjectCard: FC<ProjectCardProps> = ({ logoUrl, title, description, tags, imageUrl, projectUrl }) => {
  const safeTitle = title || 'untitled';
  const cardId = `project-card-${safeTitle.toLowerCase().replace(/\s/g, '-')}`;

  return (
    <div id={cardId} className="project-card">
      <a href={projectUrl} target="_blank" rel="noopener noreferrer" className="card-link">
        <div className="image-container">
          <img 
            src={imageUrl} 
            alt={title || 'project image'} 
            className="project-image" 
            referrerPolicy="no-referrer" 
          />
          <div className="image-overlay">
            <img 
              src={logoUrl} 
              alt={`${title || 'project'} logo`} 
              className="logo-image" 
            />
          </div>
          {/* 👇 Hover overlay with button */}
          <div className="hover-overlay">
            <button className="visit-button">Visit</button>
          </div>
        </div>
        <div className="card-content">
          <h3>{title || 'Untitled Project'}</h3>
          <p>{description || ''}</p>
          <div className="tags-container">
            {tags && tags.map((tag) => (
              <span key={tag} className="tag">{tag}</span>
            ))}
          </div>
        </div>
      </a>
    </div>
  );
};

export default ProjectCard;