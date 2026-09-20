import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ChevronRight } from 'lucide-react';
import './LandingPage.css';

const logos = [
  { src: 'https://svgl.app/library/procure.svg', alt: 'Procure', colors: ['#bfdbfe', '#2563eb'] },
  { src: 'https://svgl.app/library/shopify.svg', alt: 'Shopify', colors: ['#fef08a', '#84cc16'] },
  { src: 'https://svgl.app/library/blender.svg', alt: 'Blender', colors: ['#bfdbfe', '#2563eb'] },
  { src: 'https://svgl.app/library/figma.svg', alt: 'Figma', colors: ['#e9d5ff', '#a855f7'] },
  { src: 'https://svgl.app/library/spotify.svg', alt: 'Spotify', colors: ['#fecdd3', '#f43f5e'] },
  { src: 'https://svgl.app/library/lottielab.svg', alt: 'Lottielab', colors: ['#fef08a', '#65a30d'] },
  { src: 'https://svgl.app/library/google-cloud.svg', alt: 'Google Cloud', colors: ['#dbeafe', '#38bdf8'] },
  { src: 'https://svgl.app/library/bing.svg', alt: 'Bing', colors: ['#cffafe', '#14b8a6'] },
];

const Marquee = () => (
  <div className="landing-marquee" aria-label="Our technology partners">
    <div className="landing-marquee-track">
      {[...logos, ...logos].map((logo, index) => (
        <div className="landing-logo-card group" key={`${logo.alt}-${index}`}>
          <div
            className="landing-logo-glow"
            style={{ background: `linear-gradient(135deg, ${logo.colors[0]}, ${logo.colors[1]})` }}
          />
          <img src={logo.src} alt={logo.alt} className="landing-logo-image" />
        </div>
      ))}
    </div>
  </div>
);

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <main className="landing-shell">
      <section className="landing-hero relative w-full max-w-[1400px] mx-auto rounded-[48px] bg-white border border-slate-200/50 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.03)] overflow-hidden h-[600px] flex flex-col">
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden select-none">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover scale-105 transition-transform duration-1000"
            src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260505_101331_74f9b798-3f00-4e86-8a01-377aa16ffeaa.mp4"
          />
        </div>

        <motion.div
          className="z-20 flex-1 px-8 md:px-16 pt-12 md:pt-16 flex flex-col items-start landing-content"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        >
          <p className="landing-eyebrow">PRESKOOL / DIGITAL CAMPUS</p>
          <h1 className="font-display text-[42px] md:text-[56px] font-medium tracking-tight">
            Foundation of the<br />new digital epoch
          </h1>
          <p className="font-sans text-[14px] md:text-[15px] landing-subheadline">
            Designing products, powering ecosystems and laying the foundation of a decentralized web for enterprises, builders and communities alike.
          </p>
          <motion.button
            className="landing-contact-button"
            onClick={() => navigate('/login')}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.98 }}
          >
            Contact Us
          </motion.button>
        </motion.div>

        <motion.nav
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex items-center bg-white/90 backdrop-blur-2xl px-1.5 py-1.5 rounded-full shadow-[0_12px_40px_rgba(0,0,0,0.08)] border border-slate-200/40 landing-nav"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35, ease: 'easeOut' }}
        >
          <span className="landing-logo-placeholder" aria-label="PreSkool">✦</span>
          <button type="button" className="landing-nav-link">Products</button>
          <button type="button" className="landing-nav-link">Docs</button>
          <button type="button" className="landing-touch-button" onClick={() => navigate('/login')}>
            Get in touch <ChevronRight size={14} strokeWidth={2.5} />
          </button>
        </motion.nav>
      </section>
      <Marquee />
    </main>
  );
};

export default LandingPage;
