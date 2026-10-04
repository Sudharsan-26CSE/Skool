import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';

/**
 * ============================================================================
 * GSAP ANIMATION ENGINE — SKOOL PORTAL
 * Theme: Sky-Blue & Crisp White Frosted Glass Aesthetics
 * ============================================================================
 */

// Global configuration
gsap.config({
  autoSleep: 60,
  force3D: true,
});

/**
 * 1. Animate Page Entrance (Staggered fade, slide-up, and scale for cards and headers)
 */
export const animatePageEntrance = (container = document) => {
  if (typeof window === 'undefined') return;

  const ctx = gsap.context(() => {
    // 1. Page Header and Titles
    const headers = container.querySelectorAll('.page-header, .page-title, .page-subtitle, .badge.info, .auth-logo');
    if (headers.length > 0) {
      gsap.fromTo(
        headers,
        { opacity: 0, y: -16, filter: 'blur(4px)' },
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.55,
          stagger: 0.05,
          ease: 'power2.out',
          clearProps: 'transform,filter',
        }
      );
    }

    // 2. Stat Cards & Top Metrics
    const statCards = container.querySelectorAll('.stat-card, .dynamic-stat-card');
    if (statCards.length > 0) {
      gsap.fromTo(
        statCards,
        { opacity: 0, y: 28, scale: 0.94 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.65,
          stagger: 0.08,
          ease: 'back.out(1.2)',
          clearProps: 'transform',
        }
      );
    }

    // 3. Main Content Cards, Tables, Forms, Grids
    const mainCards = container.querySelectorAll(
      '.dashboard-card, .data-table-container, .form-section, .card, .detail-card, .teacher-grid-card, .student-grid-card, .auth-card, .role-card, .calendar-container'
    );
    if (mainCards.length > 0) {
      gsap.fromTo(
        mainCards,
        { opacity: 0, y: 32, scale: 0.97 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.7,
          stagger: 0.1,
          ease: 'power3.out',
          clearProps: 'transform',
        }
      );
    }

    // 4. Action Buttons and Quick Action Capsule Bar
    const actionBtns = container.querySelectorAll(
      '.dashboard-quick-actions button, .page-header button, .btn-primary, .btn-secondary'
    );
    if (actionBtns.length > 0) {
      gsap.fromTo(
        actionBtns,
        { opacity: 0, scale: 0.9 },
        {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          stagger: 0.04,
          ease: 'power2.out',
          clearProps: 'transform',
        }
      );
    }
  }, container);

  return () => ctx.revert();
};

/**
 * 2. Interactive 3D Perspective Glass Tilt & Specular Shine Reflection
 */
export const initGlassTilt = (selector = '.glass-card, .stat-card, .dashboard-card, .auth-card, .role-card') => {
  if (typeof window === 'undefined') return () => {};

  const cards = document.querySelectorAll(selector);
  const cleanups = [];

  cards.forEach((card) => {
    // Avoid double-binding
    if (card.dataset.gsapTiltInitialized === 'true') return;
    card.dataset.gsapTiltInitialized = 'true';

    // Set 3D transform style
    card.style.transformStyle = 'preserve-3d';

    const onMouseMove = (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Subtle 3D tilt: max 5 degrees
      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;

      gsap.to(card, {
        rotateX,
        rotateY,
        transformPerspective: 1000,
        duration: 0.3,
        ease: 'power1.out',
        overwrite: 'auto',
      });
    };

    const onMouseLeave = () => {
      gsap.to(card, {
        rotateX: 0,
        rotateY: 0,
        scale: 1,
        duration: 0.55,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    };

    const onMouseEnter = () => {
      gsap.to(card, {
        scale: 1.015,
        duration: 0.35,
        ease: 'power2.out',
        overwrite: 'auto',
      });
    };

    card.addEventListener('mousemove', onMouseMove);
    card.addEventListener('mouseleave', onMouseLeave);
    card.addEventListener('mouseenter', onMouseEnter);

    cleanups.push(() => {
      card.removeEventListener('mousemove', onMouseMove);
      card.removeEventListener('mouseleave', onMouseLeave);
      card.removeEventListener('mouseenter', onMouseEnter);
      delete card.dataset.gsapTiltInitialized;
    });
  });

  return () => cleanups.forEach((fn) => fn());
};

/**
 * 3. Animate Ambient Sky-Blue & White Floating Glass Orbs / Aurora
 */
export const initFloatingGlassOrbs = () => {
  if (typeof window === 'undefined') return () => {};

  const blobs = document.querySelectorAll('.aurora-blob');
  if (blobs.length === 0) return () => {};

  const tweens = [];

  blobs.forEach((blob, index) => {
    const isBlob1 = blob.classList.contains('blob-1');
    const isBlob2 = blob.classList.contains('blob-2');
    const isBlob3 = blob.classList.contains('blob-3');

    const duration = isBlob1 ? 16 : isBlob2 ? 20 : isBlob3 ? 24 : 18;
    const xDist = (index % 2 === 0 ? 1 : -1) * (40 + index * 12);
    const yDist = (index % 2 === 0 ? -1 : 1) * (30 + index * 10);

    const tween = gsap.to(blob, {
      x: xDist,
      y: yDist,
      scale: 1.08,
      duration,
      repeat: -1,
      yoyo: true,
      ease: 'sine.inOut',
    });

    tweens.push(tween);
  });

  return () => tweens.forEach((t) => t.kill());
};

/**
 * 4. Magnetic Button Ripple and Hover Effect
 */
export const initMagneticButtons = (selector = '.btn-primary, .btn-secondary, .glass-btn, .glass-btn-primary') => {
  if (typeof window === 'undefined') return () => {};

  const buttons = document.querySelectorAll(selector);
  const cleanups = [];

  buttons.forEach((btn) => {
    if (btn.dataset.gsapMagnetic === 'true') return;
    btn.dataset.gsapMagnetic = 'true';

    const onMouseMove = (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;

      // Magnetic pull: max 4px
      gsap.to(btn, {
        x: x * 0.15,
        y: y * 0.15,
        duration: 0.25,
        ease: 'power1.out',
        overwrite: 'auto',
      });
    };

    const onMouseLeave = () => {
      gsap.to(btn, {
        x: 0,
        y: 0,
        duration: 0.45,
        ease: 'elastic.out(1, 0.4)',
        overwrite: 'auto',
      });
    };

    btn.addEventListener('mousemove', onMouseMove);
    btn.addEventListener('mouseleave', onMouseLeave);

    cleanups.push(() => {
      btn.removeEventListener('mousemove', onMouseMove);
      btn.removeEventListener('mouseleave', onMouseLeave);
      delete btn.dataset.gsapMagnetic;
    });
  });

  return () => cleanups.forEach((fn) => fn());
};

/**
 * 5. React Hook: Attach GSAP Page Animations on Mount & Updates
 */
export const useGsapPage = (deps = []) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      animatePageEntrance();
      initGlassTilt();
      initMagneticButtons();
      initFloatingGlassOrbs();
    }, 40);

    return () => clearTimeout(timer);
  }, deps);
};

/**
 * 6. Global GSAP Route Controller
 * Mount this once in App.jsx to automatically drive GSAP animations across ALL pages in the app!
 */
export const GsapRouteManager = () => {
  const location = useLocation();

  useEffect(() => {
    // Scroll window smoothly to top on route change
    window.scrollTo({ top: 0, behavior: 'instant' });

    const timer = setTimeout(() => {
      animatePageEntrance(document);
      initGlassTilt();
      initMagneticButtons();
      initFloatingGlassOrbs();
    }, 50);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return null;
};

export default {
  animatePageEntrance,
  initGlassTilt,
  initFloatingGlassOrbs,
  initMagneticButtons,
  useGsapPage,
  GsapRouteManager,
};
