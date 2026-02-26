import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
    FaEnvelope, FaPhoneAlt, FaLinkedin, FaGithub,
    FaBriefcase, FaPaperPlane, FaRocket, FaCode,
    FaPaintBrush, FaMobileAlt, FaCalendarCheck
} from 'react-icons/fa';
import '../styles/contact.css';

// Fix for default marker icons in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const ContactPage: React.FC = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        projectType: 'webdev',
        message: '',
    });

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.email) {
            alert('Please fill required fields (name and email)');
            return;
        }
        alert('✨ Message sent (demo). I’ll get back to you soon!');
        setFormData({ name: '', email: '', projectType: 'webdev', message: '' });
    };

    return (
        <div className="contact-page">
            {/* Full‑width map at the very top */}
            <div className="map-section">
                <MapContainer center={[6.5244, 3.3792]} zoom={13} scrollWheelZoom={true}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={[6.5244, 3.3792]}>
                        <Popup>
                            <strong>📍 Here’s me! 😎</strong>
                            <br />
                            VM – Portfolio HQ
                            <br />
                            <span style={{ fontSize: '0.9rem' }}>Let’s build something amazing.</span>
                        </Popup>
                    </Marker>
                </MapContainer>
            </div>

            {/* Hero section */}

            {/* I gave this heroc for to avoid styling conflict since am not using css module */}
            <section className="heroc">
                <h1>Let's Build Something Amazing Together</h1>
                <p>Whether it’s a website, app, or UX project, I’m just a message away.</p>
            </section>

            {/* Two‑column: form left, image right */}
            <div className="contact-grid">
                <div className="form-card">
                    <h2>👋 Drop a line</h2>
                    <p className="sub">I’ll get back to you within 24h.</p>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label>
                                Full name <span className="required-star">*</span>
                            </label>
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
                            <label>
                                Email <span className="required-star">*</span>
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="hello@yourdomain.com"
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
                        <button type="submit" className="submit-btn">
                            <span>Send Message</span> <FaPaperPlane />
                        </button>
                    </form>
                </div>




                <div className="image-side">
                    <img
                        src="/cont.png"  // replace with your actual image path
                        alt="Contact visual"
                        className="contact-image"
                    />
                </div>




            </div>

            {/* Direct contact row */}
            <div className="direct-contact">
                <div className="contact-item">
                    <FaEnvelope />
                    <a href="mailto:hello@yourdomain.com">hello@yourdomain.com</a>
                </div>
                <div className="contact-item">
                    <FaPhoneAlt />
                    <a href="tel:+2348001234567">+234 800 123 4567</a>
                </div>
                <div className="contact-item">
                    <FaLinkedin />
                    <a href="#">LinkedIn</a>
                </div>
                <div className="contact-item">
                    <FaGithub />
                    <a href="#">GitHub</a>
                </div>
                <div className="contact-item">
                    <FaBriefcase />
                    <a href="#">Portfolio</a>
                </div>
            </div>

            {/* CTA Footer */}
            <footer className="cta-footer">
                <h2>Got a project? Don’t wait. Let’s make it happen.</h2>
                <a href="#" className="cta-button">
                    Schedule a call <FaCalendarCheck />
                </a>
                <p className="footnote">— remote & worldwide —</p>
            </footer>
        </div>
    );
};

export default ContactPage;