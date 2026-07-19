import type { FC } from 'react'; 
import '../styles/projectCard.css';

interface ProjectCardProps {
  title: string;
  imageUrl: string;
  onClick: () => void;  // 👈 this is what you were missing!
}

const ProjectCard: FC<ProjectCardProps> = ({ 
  title, 
  imageUrl,
  onClick 
}) => {
  const safeTitle = title || 'untitled';
  const cardId = `project-card-${safeTitle.toLowerCase().replace(/\s/g, '-')}`;

  return (
    <div 
      id={cardId} 
      className="project-card" 
      onClick={onClick}  // 👈 this triggers the modal
      style={{ cursor: 'pointer' }}
    >
      <div className="image-container">
        <img 
          src={imageUrl} 
          alt={title || 'project image'} 
          className="project-image" 
          referrerPolicy="no-referrer" 
        />
      </div>
      <div className="card-content">
        <h3>{title || 'Untitled Project'}</h3>
      </div>
    </div>
  );
};

export default ProjectCard;