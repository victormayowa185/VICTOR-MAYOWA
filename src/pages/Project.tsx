import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import ProjectCard from './ProjectCard';
import { client } from '../sanity/client';
import { FiX } from 'react-icons/fi';
import gsap from 'gsap';
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

  const headerTitleRef = useRef<HTMLHeadingElement>(null);
  const headerTextRef = useRef<HTMLParagraphElement>(null);
  const filterWrapperRef = useRef<HTMLDivElement>(null);
  const gridRef = useRef<HTMLDivElement>(null);
  const hasPlayedEntrance = useRef(false);

  const modalOverlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

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

  // Same navbar-swap scroll mechanic as the blog page
  useEffect(() => {
    const handleScroll = () => {
      if (!sentinelRef.current) return;

      const currentY = window.scrollY;
      const delta = currentY - lastScrollY.current;

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

  // NEW
  // ---------- Hide everything BEFORE first paint — prevents the flash ----------
  useLayoutEffect(() => {
    gsap.set([headerTitleRef.current, headerTextRef.current], { opacity: 0, y: 24 });
    gsap.set(filterWrapperRef.current, { opacity: 0, y: 16 });
  }, []);

  // ---------- Header + filter pills entrance, gated on Preloader ----------
  useEffect(() => {
    const playEntrance = () => {
      if (hasPlayedEntrance.current) return;
      hasPlayedEntrance.current = true;

      const tl = gsap.timeline({ delay: 0.15 });
      tl.to(headerTitleRef.current, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' })
        .to(headerTextRef.current, { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' }, '-=0.45')
        .to(filterWrapperRef.current, { opacity: 1, y: 0, duration: 0.5, ease: 'power3.out' }, '-=0.3');
    };

    if ((window as any).__preloaderFinished) {
      playEntrance();
    } else {
      window.addEventListener('preloader-finished', playEntrance);
    }

    return () => window.removeEventListener('preloader-finished', playEntrance);
  }, []);

  const filteredProjects = projects.filter((project) => {
    if (activeFilter === 'All') return true;
    return project.category === activeFilter.toLowerCase();
  });

  // ---------- Card stagger reveal — replays on every filter change ----------
  useEffect(() => {
    if (loading || !gridRef.current) return;
    const cards = gridRef.current.children;
    if (!cards.length) return;

    gsap.fromTo(
      cards,
      { opacity: 0, y: 30, scale: 0.96 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.55,
        ease: 'power3.out',
        stagger: 0.07,
      }
    );
  }, [activeFilter, loading, projects.length]);

  // ---------- Modal open animation ----------
  useEffect(() => {
    if (!selectedProject) return;

    gsap.fromTo(
      modalOverlayRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.25, ease: 'power2.out' }
    );
    gsap.fromTo(
      modalRef.current,
      { opacity: 0, y: 24, scale: 0.96 },
      { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'power3.out', delay: 0.05 }
    );
  }, [selectedProject]);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      setSelectedProject(null);
    }
  };

  return (
    <div className="projects-page">
      <div ref={sentinelRef} className="filter-sentinel" />

      <div className="projects-header">
        <h1 ref={headerTitleRef}>View my Works</h1>
        <p ref={headerTextRef}>Web, mobile, and UI projects — built to solve real problems.</p>
      </div>

      <div
        ref={filterWrapperRef}
        className={`project-filter-buttons ${isPillSticky ? 'pill-mode' : ''}`}
      >
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
        <div>
          <div className="projects-grid" ref={gridRef}>
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
        <div className="project-modal-overlay" ref={modalOverlayRef} onClick={handleOverlayClick}>
          <div className="project-modal" ref={modalRef}>
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