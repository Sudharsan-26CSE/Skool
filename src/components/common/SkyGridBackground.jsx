import React from 'react';
import './SkyGridBackground.css';

/**
 * SkyGridBackground
 * 
 * Renders a futuristic 3D perspective curved neon grid with an ambient sky-blue
 * atmospheric glow, active in Dark Theme across all pages and user roles.
 */
const SkyGridBackground = () => {
  // Generate horizontal arched grid lines with perspective spacing
  const horizontalSteps = [12, 24, 38, 55, 76, 102, 136, 180, 235, 305, 390, 490];
  
  // Generate vertical perspective curved lines radiating from the horizon
  const verticalOffsets = [
    -650, -540, -440, -350, -270, -200, -140, -90, -45,
    0,
    45, 90, 140, 200, 270, 350, 440, 540, 650
  ];

  return (
    <div className="sky-grid-background-root" aria-hidden="true">
      {/* 1. Deep space midnight atmosphere */}
      <div className="sky-grid-base-gradient" />

      {/* 2. Top Celestial Sky-Blue Ambient Radiant Blooms */}
      <div className="sky-grid-ambient-glow" />
      <div className="sky-grid-horizon-streak" />
      <div className="sky-grid-center-bloom" />

      {/* 3. The 3D Curved Perspective Canopy Grid (SVG) */}
      <div className="sky-grid-svg-container">
        <svg
          viewBox="0 0 1600 520"
          preserveAspectRatio="none"
          className="sky-grid-svg"
        >
          <defs>
            {/* Main Sky-Blue Neon Line Gradient */}
            <linearGradient id="skyGridNeonGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.85" />
              <stop offset="25%" stopColor="#0ea5e9" stopOpacity="0.65" />
              <stop offset="55%" stopColor="#0284c7" stopOpacity="0.35" />
              <stop offset="85%" stopColor="#0369a1" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0.0" />
            </linearGradient>

            {/* Subtle Outer Grid Line Gradient */}
            <linearGradient id="skyGridSubtleGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#7dd3fc" stopOpacity="0.5" />
              <stop offset="30%" stopColor="#38bdf8" stopOpacity="0.35" />
              <stop offset="70%" stopColor="#0ea5e9" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0.0" />
            </linearGradient>

            {/* Horizontal Line Radial Fade Mask */}
            <radialGradient id="skyHorizontalFade" cx="50%" cy="0%" r="70%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="50%" stopColor="#ffffff" stopOpacity="0.75" />
              <stop offset="80%" stopColor="#ffffff" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </radialGradient>

            <mask id="hLineMask">
              <rect x="-300" y="0" width="2200" height="520" fill="url(#skyHorizontalFade)" />
            </mask>

            {/* Neon Glow Filter */}
            <filter id="skyNeonGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2.5" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Arched Horizontal Perspective Grid Lines */}
          <g mask="url(#hLineMask)" className="sky-grid-h-lines">
            {horizontalSteps.map((y, idx) => {
              const archElevation = Math.max(8, 26 - idx * 1.5);
              const strokeOpacity = Math.max(0.15, 0.7 - idx * 0.045);
              const strokeWidth = idx < 3 ? 1.5 : 1.1;
              return (
                <path
                  key={`h-${idx}`}
                  d={`M -250,${y} Q 800,${y - archElevation} 1850,${y}`}
                  fill="none"
                  stroke="url(#skyGridNeonGrad)"
                  strokeWidth={strokeWidth}
                  opacity={strokeOpacity}
                />
              );
            })}
          </g>

          {/* Curved Vertical Perspective Rays Radiating Downward & Outward */}
          <g className="sky-grid-v-lines">
            {verticalOffsets.map((dx, idx) => {
              const xTop = 800 + dx;
              const xMid1 = xTop + dx * 0.18;
              const xMid2 = xTop + dx * 0.65;
              const xBottom = xTop + dx * 1.28;
              const isCenter = Math.abs(dx) <= 90;
              const strokeGrad = isCenter ? 'url(#skyGridNeonGrad)' : 'url(#skyGridSubtleGrad)';
              const strokeWidth = isCenter ? 1.4 : 1.1;
              const glowFilter = isCenter && Math.abs(dx) === 0 ? 'url(#skyNeonGlow)' : undefined;

              return (
                <path
                  key={`v-${idx}`}
                  d={`M ${xTop},5 C ${xMid1},130 ${xMid2},320 ${xBottom},520`}
                  fill="none"
                  stroke={strokeGrad}
                  strokeWidth={strokeWidth}
                  filter={glowFilter}
                />
              );
            })}
          </g>

          {/* Top Horizon Arch Highlight Beam */}
          <path
            d="M -100,16 Q 800,-8 1700,16"
            fill="none"
            stroke="#bae6fd"
            strokeWidth="2.2"
            opacity="0.85"
            filter="url(#skyNeonGlow)"
          />
          <path
            d="M 300,10 Q 800,-4 1300,10"
            fill="none"
            stroke="#ffffff"
            strokeWidth="1.6"
            opacity="0.95"
            filter="url(#skyNeonGlow)"
          />
        </svg>
      </div>

      {/* 4. Bottom Smooth Fade Mask into Content */}
      <div className="sky-grid-bottom-fade" />
    </div>
  );
};

export default SkyGridBackground;
