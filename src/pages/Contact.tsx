import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
// 🚀 REMOVED: import * as maplibregl from 'maplibre-gl';
// 🚀 REMOVED: import 'maplibre-gl/dist/maplibre-gl.css';
import {
  FaGithub,
  FaHandshake,
  FaUsers,
  FaEnvelope,
  FaPaperPlane,
  FaWhatsapp,
} from 'react-icons/fa';
import { FiX } from 'react-icons/fi';
import gsap from 'gsap';
import '../styles/contact.css';

const FUTO_LAT = 5.3959;
const FUTO_LNG = 7.0102;

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}

const CustomSelect: React.FC<CustomSelectProps> = ({ value, onChange, options }) => {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const selected = options.find((o) => o.value === value);

  return (
    <div className="custom-select" ref={wrapperRef}>
      <button
        type="button"
        className={`custom-select-trigger ${open ? 'open' : ''}`}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span>{selected?.label}</span>
        <span className="custom-select-arrow" />
      </button>

      {open && (
        <ul className="custom-select-options">
          {options.map((opt) => (
            <li
              key={opt.value}
              className={`custom-select-option ${opt.value === value ? 'selected' : ''}`}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
            >
              {opt.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const ContactPage: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<any>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: 'webdev',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const mapSectionRef = useRef<HTMLDivElement>(null);
  const boxesWrapperRef = useRef<HTMLDivElement>(null);
  const hasPlayedEntrance = useRef(false);

  const modalOverlayRef = useRef<HTMLDivElement>(null);
  const modalContentRef = useRef<HTMLDivElement>(null);

  // ---------- Map Initialization (lazy-loaded) ----------
  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    let isMounted = true;

    const initMap = async () => {
      try {
        // 🚀 DYNAMIC IMPORT: Loads Maplibre ONLY when this component mounts
        const maplibregl = await import('maplibre-gl');
        await import('maplibre-gl/dist/maplibre-gl.css');

        if (!isMounted || !mapContainerRef.current) return;

        // ✅ FIXED: Use maplibregl directly (no .default needed)
        const map = new maplibregl.Map({
          container: mapContainerRef.current,
          style: {
            version: 8,
            sources: {
              'carto-light': {
                type: 'raster',
                tiles: [
                  'https://a.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
                  'https://b.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
                  'https://c.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png',
                ],
                tileSize: 256,
                attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
              },
            },
            layers: [
              {
                id: 'carto-light-layer',
                type: 'raster',
                source: 'carto-light',
                minzoom: 0,
                maxzoom: 20,
              },
            ],
          },
          center: [FUTO_LNG, FUTO_LAT],
          zoom: 15,
          attributionControl: false,
        });

        mapRef.current = map;

        // ✅ FIXED: Use maplibregl directly (no .default needed)
        map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');
        map.addControl(
          new maplibregl.AttributionControl({ compact: true }),
          'bottom-right'
        );

        const markerEl = document.createElement('div');
        markerEl.className = 'custom-marker';
        markerEl.innerHTML = `<div class="marker-pulse"></div><div class="marker-pin"></div>`;

        // ✅ FIXED: Use maplibregl directly (no .default needed)
        const popup = new maplibregl.Popup({ offset: 22, closeButton: true }).setHTML(`
          <strong>📍 FUTO – My Base</strong><br />
          Federal University of Technology, Owerri<br />
          <span style="font-size: 0.9rem;">Let's build something amazing.</span>
        `);

        // ✅ FIXED: Use maplibregl directly (no .default needed)
        new maplibregl.Marker({ element: markerEl, anchor: 'center' })
          .setLngLat([FUTO_LNG, FUTO_LAT])
          .setPopup(popup)
          .addTo(map);

      } catch (error) {
        console.error('Failed to load Maplibre:', error);
      }
    };

    initMap();

    return () => {
      isMounted = false;
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  // ---------- Entrance: map section + action boxes, gated on Preloader ----------
  useLayoutEffect(() => {
    const boxes = boxesWrapperRef.current
      ? Array.from(boxesWrapperRef.current.children)
      : [];

    gsap.set(mapSectionRef.current, { opacity: 0, y: 30, scale: 0.98 });
    gsap.set(boxes, { opacity: 0, y: 30, scale: 0.94 });
  }, []);

  useEffect(() => {
    const playEntrance = () => {
      if (hasPlayedEntrance.current) return;
      hasPlayedEntrance.current = true;

      const boxes = boxesWrapperRef.current
        ? Array.from(boxesWrapperRef.current.children)
        : [];

      const tl = gsap.timeline({ delay: 0.15 });
      tl.to(mapSectionRef.current, { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power3.out' })
        .to(
          boxes,
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.55,
            ease: 'back.out(1.5)',
            stagger: 0.1,
          },
          '-=0.4'
        );
    };

    if ((window as any).__preloaderFinished) {
      playEntrance();
    } else {
      window.addEventListener('preloader-finished', playEntrance);
    }

    return () => window.removeEventListener('preloader-finished', playEntrance);
  }, []);

  // ---------- Modal open animation ----------
  useEffect(() => {
    if (!modalOpen) return;

    gsap.fromTo(
      modalOverlayRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.25, ease: 'power2.out' }
    );
    gsap.fromTo(
      modalContentRef.current,
      { opacity: 0, y: 24, scale: 0.96 },
      { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: 'power3.out', delay: 0.05 }
    );
  }, [modalOpen]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.currentTarget as HTMLFormElement;
    const formDataObj = new FormData(form);
    const name = (formDataObj.get('name') as string)?.trim() || '';
    const email = (formDataObj.get('email') as string)?.trim() || '';
    const projectType = formDataObj.get('projectType') as string || 'webdev';
    const message = formDataObj.get('message') as string || '';

    if (!name || !email) {
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus('idle'), 3000);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('https://formspree.io/f/mqedrynl', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, projectType, message }),
      });

      if (response.ok) {
        setSubmitStatus('success');
        form.reset();
        setFormData({ name: '', email: '', projectType: 'webdev', message: '' });
        setTimeout(() => setSubmitStatus('idle'), 4000);
        setTimeout(() => setModalOpen(false), 3000);
      } else {
        setSubmitStatus('error');
        setTimeout(() => setSubmitStatus('idle'), 4000);
      }
    } catch (error) {
      console.error('Network error:', error);
      setSubmitStatus('error');
      setTimeout(() => setSubmitStatus('idle'), 4000);
    } finally {
      setLoading(false);
    }
  };

  const openModal = () => setModalOpen(true);
  const closeModal = () => {
    setModalOpen(false);
    setSubmitStatus('idle');
  };

  return (
    <div className="contact-page">
      {/* Map Section */}
      <div className="map-section-wrapper">
        <div className="map-section" ref={mapSectionRef}>
          <div ref={mapContainerRef} className="maplibre-container" />
        </div>
      </div>

      {/* ===== 4 ACTION BOXES – 2x2 grid ===== */}
      <div className="action-boxes-wrapper">
        <div className="action-boxes-grid" ref={boxesWrapperRef}>
          <a
            href="https://github.com/victormayowa185"
            target="_blank"
            rel="noopener noreferrer"
            className="action-box box-github"
            aria-label="Contribute on GitHub"
          >
            <div className="box-icon-wrapper">
              <FaGithub className="box-icon" />
            </div>
            <h3 className="box-title">Contribute on GitHub</h3>
          </a>

          <button className="action-box box-hire" onClick={openModal} aria-label="Hire me">
            <div className="box-icon-wrapper">
              <FaHandshake className="box-icon" />
            </div>
            <h3 className="box-title">Hire Me</h3>
          </button>

          <div className="action-box box-quick">
            <div className="box-icon-wrapper">
              <FaEnvelope className="box-icon" />
            </div>
            <h3 className="box-title">Send a Quick Message</h3>

            <div className="quick-contact-links">
              <a
                href="https://wa.me/2348113270110"
                target="_blank"
                rel="noopener noreferrer"
                className="quick-contact-link"
                onClick={(e) => e.stopPropagation()}
              >
                <FaWhatsapp /> WhatsApp
              </a>
            </div>
          </div>

          <div className="action-box box-collab coming-soon" title="Coming soon – stay tuned!">
            <div className="box-icon-wrapper">
              <FaUsers className="box-icon" />
            </div>
            <h3 className="box-title">Let's Collaborate</h3>
            <span className="coming-soon-badge">Soon</span>
          </div>
        </div>
      </div>

      {/* ===== HIRE ME MODAL ===== */}
      {
        modalOpen && (
          <div className="modal-overlay" ref={modalOverlayRef} onClick={closeModal}>
            <div className="modal-content" ref={modalContentRef} onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>
                  <FaHandshake style={{ marginRight: '8px' }} />
                  Hire Me
                </h2>
                <button className="modal-close-btn" onClick={closeModal}>
                  <FiX />
                </button>
              </div>

              <div className="modal-body-scroll">
                <div className="modal-body">
                  <p className="modal-sub">Fill in your details and I'll get back to you within 24h.</p>

                  <form onSubmit={handleSubmit}>
                    <div className="form-group">
                      <label>Full name <span className="required-star">*</span></label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g., Alex M."
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Email <span className="required-star">*</span></label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="xy...@gmail.com"
                        required
                        pattern="[^@\s]+@[^@\s]+\.[^@\s]+"
                      />
                    </div>

                    <div className="form-group">
                      <label>Project type</label>
                      <CustomSelect
                        value={formData.projectType}
                        onChange={(val) => setFormData({ ...formData, projectType: val })}
                        options={[
                          { value: 'webdev', label: 'Web Dev' },
                          { value: 'uiux', label: 'UI/UX' },
                          { value: 'other', label: 'Other' },
                        ]}
                      />
                    </div>
                    <input type="hidden" name="projectType" value={formData.projectType} />

                    <div className="form-group">
                      <label>Message</label>
                      <textarea
                        name="message"
                        rows={4}
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tell me about your idea..."
                      />
                    </div>

                    {submitStatus === 'error' && (
                      <div className="form-message error">
                        ⚠️ Something went wrong. Check your connection and try again.
                      </div>
                    )}

                    {submitStatus === 'success' && (
                      <div className="form-message success">
                        ✨ Message sent! I'll get back to you soon.
                      </div>
                    )}

                    <button type="submit" className="submit-btn" disabled={loading}>
                      {loading ? 'Sending...' : 'Send Message'} <FaPaperPlane />
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        )
      }
    </div >
  );
};

export default ContactPage;