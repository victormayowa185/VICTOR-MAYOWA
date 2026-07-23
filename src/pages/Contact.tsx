import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  FaGithub,
  FaHandshake,
  FaUsers,
  FaEnvelope,
  FaPaperPlane
} from 'react-icons/fa';
import { FiX } from 'react-icons/fi';
import '../styles/contact.css';

// Custom purple pin marker
const customIcon = L.divIcon({
  className: 'custom-marker',
  html: `<div class="marker-pulse"></div><div class="marker-pin"></div>`,
  iconSize: [26, 26],
  iconAnchor: [13, 13],
  popupAnchor: [0, -16],
});

const ContactPage: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: 'webdev',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

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
          <MapContainer center={[5.3959, 7.0102]} zoom={15} scrollWheelZoom={true}>
            <TileLayer
              attribution='&copy; <a href="https://carto.com/attributions">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            />
            <Marker position={[5.3959, 7.0102]} icon={customIcon}>
              <Popup className="map-popup">
                <strong>📍 FUTO – My Base</strong>
                <br />
                Federal University of Technology, Owerri
                <br />
                <span style={{ fontSize: '0.9rem' }}>Let’s build something amazing.</span>
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>

      {/* ===== 4 ACTION BOXES – 2x2 grid ===== */}
      <div className="action-boxes-wrapper">
        <div className="action-boxes-grid">
          {/* Box 1 – Contribute on GitHub */}
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

          {/* Box 2 – Hire Me (opens modal) */}
          <button className="action-box box-hire" onClick={openModal} aria-label="Hire me">
            <div className="box-icon-wrapper">
              <FaHandshake className="box-icon" />
            </div>
            <h3 className="box-title">Hire Me</h3>
          </button>

          {/* Box 3 – Let's Collaborate (coming soon) */}
          <div className="action-box box-collab coming-soon" title="Coming soon – stay tuned!">
            <div className="box-icon-wrapper">
              <FaUsers className="box-icon" />
            </div>
            <h3 className="box-title">Let's Collaborate</h3>
            <span className="coming-soon-badge">Soon</span>
          </div>

          {/* Box 4 – Send a Quick Message (coming soon) */}
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
              <p className="modal-sub">Fill in your details and I’ll get back to you within 24h.</p>

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
                    ✨ Message sent! I’ll get back to you soon.
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