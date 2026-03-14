import type { FC } from 'react'; 
import '../styles/projectCard.css';

interface ProjectCardProps {
  logoUrl?: string;       // optional if you might use it later; otherwise remove entirely
  title: string;
  description: string;
  tags: string[];
  imageUrl: string;
  projectUrl: string;
}

const ProjectCard: FC<ProjectCardProps> = ({ 
  title, 
  description, 
  tags, 
  imageUrl, 
  projectUrl 
}) => {
  const safeTitle = title || 'untitled';
  const cardId = `project-card-${safeTitle.toLowerCase().replace(/\s/g, '-')}`;

  return (
    <div id={cardId} className="project-card">
      <a href={projectUrl} target="_blank" rel="noopener noreferrer" className="card-link">
        <div className="image-container">
          <img 
            src={imageUrl} 
            alt={title || 'project image'} 
            className="post-image animate-image" 
            referrerPolicy="no-referrer" 
          />
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