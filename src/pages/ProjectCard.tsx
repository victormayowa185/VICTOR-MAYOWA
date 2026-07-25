import type { FC } from 'react';
import { timeAgo } from '../components/dateFormatter';
import '../styles/projectCard.css';

interface ProjectCardProps {
  title: string;
  imageUrl: string;
  createdAt: string;
  onClick: () => void;
}

const ProjectCard: FC<ProjectCardProps> = ({
  title,
  imageUrl,
  createdAt,
  onClick
}) => {
  const safeTitle = title || 'untitled';
  const cardId = `project-card-${safeTitle.toLowerCase().replace(/\s/g, '-')}`;

  return (
    <div
      id={cardId}
      className="project-card"
      onClick={onClick}
      style={{ cursor: 'pointer' }}
    >
      <div className="image-container">
        <img
          src={imageUrl}
          alt={title || 'project image'}
          className="project-image"
          referrerPolicy="no-referrer"
          loading="lazy"
        />
      </div>
      <div className="card-content">
        <h3>{title || 'Untitled Project'}</h3>
        {createdAt && <span className="project-timestamp">{timeAgo(createdAt)}</span>}
      </div>
    </div>
  );
};

export default ProjectCard;