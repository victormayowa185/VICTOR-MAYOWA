import React, { useState, useRef, useEffect } from 'react';
import * as maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import {
  FaGithub,
  FaHandshake,
  FaUsers,
  FaEnvelope,
  FaPaperPlane
} from 'react-icons/fa';
import { FiX } from 'react-icons/fi';
import '../styles/contact.css';

const FUTO_LAT = 5.3959;
const FUTO_LNG = 7.0102;

const ContactPage: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<maplibregl.Map | null>(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: 'webdev',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    const map = new maplibregl.Map({
      container: mapContainerRef.current,
      style: 'https://tiles.openfreemap.org/styles/positron',
      center: [FUTO_LNG, FUTO_LAT],
      zoom: 15,
      attributionControl: false,
    });

    mapRef.current = map;

    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right');
    map.addControl(
      new maplibregl.AttributionControl({ compact: true }),
      'bottom-right'
    );

    const markerEl = document.createElement('div');
    markerEl.className = 'custom-marker';
    markerEl.innerHTML = `<div class="marker-pulse"></div><div class="marker-pin"></div>`;

    const popup = new maplibregl.Popup({ offset: 22, closeButton: true }).setHTML(`
      <strong>📍 FUTO – My Base</strong><br />
      Federal University of Technology, Owerri<br />
      <span style="font-size: 0.9rem;">Let's build something amazing.</span>
    `);

    new maplibregl.Marker({ element: markerEl, anchor: 'center' })
      .setLngLat([FUTO_LNG, FUTO_LAT])
      .setPopup(popup)
      .addTo(map);

    return () => {
      map.remove();
      mapRef.current = null;
    };
  }, []);

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
        <div className="map-section">
          <div ref={mapContainerRef} className="maplibre-container" />
        </div>
      </div>

      {/* ===== 4 ACTION BOXES – 2x2 grid ===== */}
      <div className="action-boxes-wrapper">
        <div className="action-boxes-grid">
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

          <div className="action-box box-collab coming-soon" title="Coming soon – stay tuned!">
            <div className="box-icon-wrapper">
              <FaUsers className="box-icon" />
            </div>
            <h3 className="box-title">Let's Collaborate</h3>
            <span className="coming-soon-badge">Soon</span>
          </div>

          <div className="action-box box-quick coming-soon" title="Coming soon – stay tuned!">
            <div className="box-icon-wrapper">
              <FaEnvelope className="box-icon" />
            </div>
            <h3 className="box-title">Send a Quick Message</h3>
            <span className="coming-soon-badge">Soon</span>
          </div>
        </div>
      </div>

      {/* ===== HIRE ME MODAL ===== */}
      {modalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>
                <FaHandshake style={{ marginRight: '8px' }} />
                Hire Me
              </h2>
              <button className="modal-close-btn" onClick={closeModal}>
                <FiX />
              </button>
            </div>

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
                  <select name="projectType" value={formData.projectType} onChange={handleChange}>
                    <option value="webdev">Web Dev</option>
                    <option value="uiux">UI/UX</option>
                    <option value="other">Other</option>
                  </select>
                </div>

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
      )}
    </div>
  );
};

export default ContactPage;