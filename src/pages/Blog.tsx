import React, { useRef, useState, useEffect } from 'react';
import { FaLaptopCode } from "react-icons/fa6";
import { FiMousePointer } from "react-icons/fi";
import { IoGitMergeOutline } from "react-icons/io5";
import TypewriterText from '../components/TypewriterText';
import { TbNetwork } from "react-icons/tb";
import { TbLocationStar } from "react-icons/tb";
import BlogFeed from '../components/BlogFeed';
import '../styles/blog.css';


const Hero: React.FC = () => {
    const heroRef = useRef<HTMLDivElement>(null);
    const [side, setSide] = useState<'left' | 'right' | null>(null);

    useEffect(() => {
        const hero = heroRef.current;
        if (!hero) return;

        const handleMouseMove = (e: MouseEvent) => {
            const viewportWidth = window.innerWidth;
            const mouseX = e.clientX;
            setSide(mouseX < viewportWidth / 2 ? 'left' : 'right');
        };

        const handleMouseLeave = () => {
            setSide(null);
        };

        hero.addEventListener('mousemove', handleMouseMove);
        hero.addEventListener('mouseleave', handleMouseLeave);

        return () => {
            hero.removeEventListener('mousemove', handleMouseMove);
            hero.removeEventListener('mouseleave', handleMouseLeave);
        };
    }, []);

    const topWords = ['Creative', 'Innovative', 'Passionate', 'Detail-Oriented'];
    const bottomWords = ['5+ years', '10+ projects', '3 startups', '20+ repos'];

    return (
        <div>

            <div ref={heroRef} className="hero">
                <div className="hero-grid">
                    {/* Left column – artistic name */}
                    <div className={`left-column ${side === 'right' ? 'blur' : ''}`}>
                        <div className='hero-name-art'>
                            <img src="VIC.png" alt="" />
                        </div>
                        <button className="hero-button">View work</button>
                    </div>

                    {/* Right column – unchanged */}
                    <div className={`right-column ${side === 'left' ? 'blur' : ''}`}>
                        <div className="right-content">
                            <div className="image-wrapper">
                                <div className="image-circle">
                                    <img src="/pic2.png" alt="Profile" className="profile-image" />
                                </div>
                                <div className="rect rect-top-right">
                                    <TbLocationStar /> <TypewriterText words={topWords} />
                                </div>
                                <div className="rect rect-bottom-left">
                                    <TbNetwork /> <TypewriterText words={bottomWords} />
                                </div>
                            </div>
                            <div className="icon-circles-vertical">
                                <FiMousePointer className="icon-circle" />
                                <FaLaptopCode className="icon-circle" />
                                <IoGitMergeOutline className="icon-circle" />
                            </div>
                        </div>


                    </div>

                </div>

            </div>




            <BlogFeed />


        </div>




    );
};

export default Hero;