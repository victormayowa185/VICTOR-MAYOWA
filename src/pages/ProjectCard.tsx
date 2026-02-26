/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { FC } from 'react';
import '../styles/projectCard.css'; 

interface ProjectCardProps {
  logoUrl: string;
  title: string;
  description: string;
  tags: string[];
  imageUrl: string;
}

const ProjectCard: FC<ProjectCardProps> = ({ logoUrl, title, description, tags, imageUrl }) => {
  // Safely generate an ID even if title is missing (fallback to 'untitled')
  const safeTitle = title || 'untitled';
  const cardId = `project-card-${safeTitle.toLowerCase().replace(/\s/g, '-')}`;

  return (
    <div id={cardId} className="project-card">
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
      </div>
      <div className="card-content">
        <h3>{title || 'Untitled Project'}</h3>
        <p>{description || ''}</p>
        <div className="tags-container">
          {tags && tags.map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;