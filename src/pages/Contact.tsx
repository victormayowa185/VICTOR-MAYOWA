import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
    FaEnvelope, FaPhoneAlt, FaPaperPlane, FaCalendarCheck
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
    const [loading, setLoading] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Get fresh values directly from the form (browser autofill included)
        const form = e.currentTarget as HTMLFormElement;
        const formDataObj = new FormData(form);
        const name = (formDataObj.get('name') as string)?.trim() || '';
        const email = (formDataObj.get('email') as string)?.trim() || '';
        const projectType = formDataObj.get('projectType') as string || 'webdev';
        const message = formDataObj.get('message') as string || '';

        // Validate using the actual input values
        if (!name || !email) {
            setSubmitStatus('error');
            setTimeout(() => setSubmitStatus('idle'), 3000);
            return;
        }

        setLoading(true);

        try {
            // Use relative URL – works on Vercel and with local proxy
            const backendUrl = '/api/contact';

            const response = await fetch(backendUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, projectType, message }),
            });

            const data = await response.json();

            if (response.ok) {
                setSubmitStatus('success');
                // Clear form (both React state and DOM)
                form.reset();
                setFormData({ name: '', email: '', projectType: 'webdev', message: '' });
                setTimeout(() => setSubmitStatus('idle'), 4000);
            } else {
                console.error('Backend error:', data.error);
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

    return (
        <div className="contact-page">
            {/* Full‑width map at the very top */}
            <div className="map-section">
                <MapContainer center={[5.3959, 7.0102]} zoom={15} scrollWheelZoom={true}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker position={[5.3959, 7.0102]}>
                        <Popup>
                            <strong>📍 FUTO – My Base</strong>
                            <br />
                            Federal University of Technology, Owerri
                            <br />
                            <span style={{ fontSize: '0.9rem' }}>Let’s build something amazing.</span>
                        </Popup>
                    </Marker>
                </MapContainer>
            </div>

            {/* Hero section */}
            <section className="heroc">
                <h1>Let's Build Something Amazing Together</h1>
                <p>Whether it’s a website, app, or UX project, I’m just a message away.</p>
            </section>

            {/* Two‑column: form left, video right */}
            <div className="contact-grid">
                <div className="form-card">
                    <h2>👋 Drop a line</h2>
                    <p className="sub">I’ll get back to you within 24h.</p>

                    {/* Status messages */}
                    {submitStatus === 'error' && (
                        <div className="form-message error">
                            ⚠️ {loading ? 'Sending failed. Please try again.' : 'Please fill in your name and email.'}
                        </div>
                    )}

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
                                placeholder="victormayowa185@gmail.com"
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

                <div className="image-side">
                    <video
                        src="/video.mp4"   // replace with your video file path
                        className="contact-video"
                        autoPlay
                        loop
                        muted
                        playsInline
                    />
                </div>
            </div>

            {/* Direct contact row */}
            <div className="direct-contact">
                <div className="contact-item">
                    <FaEnvelope />
                    <a href="mailto:victormayowa185@gmail.com">victormayowa185@gmail.com</a>
                </div>
                <div className="contact-item">
                    <FaPhoneAlt />
                    <a href="tel:+2348113270110">+234 811 327 0110</a>
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