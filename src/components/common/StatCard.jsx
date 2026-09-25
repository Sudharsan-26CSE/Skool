import React, { useState, useEffect, useRef, useId } from 'react';
import { ArrowUpRight, ArrowDownRight, Minus } from 'lucide-react';

/**
 * Parses raw values (numbers, formatted strings like "₹450,000", "94.2%", "6 Subjects", "A+")
 * into numerical components for animation and visual rendering.
 */
export const parseMetricValue = (rawVal) => {
  if (rawVal === undefined || rawVal === null) {
    return { num: 0, prefix: '', suffix: '', isGrade: false, display: '0', decimals: 0 };
  }
  const str = String(rawVal).trim();

  // Letter grades: A+, A*, A, B+, B, C, etc.
  if (/^[A-DF][+*]?$/i.test(str)) {
    const grade = str.toUpperCase();
    let num = 85;
    if (grade === 'A+' || grade === 'A*') num = 98;
    else if (grade === 'A') num = 92;
    else if (grade === 'B+' || grade === 'B') num = 82;
    else if (grade === 'C') num = 72;
    return { num, prefix: '', suffix: '', isGrade: true, display: grade, decimals: 0 };
  }

  // Currency or prefix check
  let prefix = '';
  if (str.startsWith('₹') || str.startsWith('$') || str.startsWith('€') || str.startsWith('£')) {
    prefix = str[0];
  }

  // Match the numeric part (including commas and decimal points)
  const cleanStr = prefix ? str.slice(prefix.length).trim() : str;
  const numMatch = cleanStr.replace(/,/g, '').match(/[-+]?[0-9]*\.?[0-9]+/);
  const num = numMatch ? parseFloat(numMatch[0]) : 0;

  // Determine decimal places in original string
  let decimals = 0;
  if (numMatch && numMatch[0].includes('.')) {
    decimals = numMatch[0].split('.')[1].length;
  }

  // Extract suffix (e.g., "%", " Classes", " Subjects", " Published", " Active", " Periods")
  let suffix = '';
  if (numMatch) {
    const rawNumStr = numMatch[0];
    const indexInClean = cleanStr.replace(/,/g, '').indexOf(rawNumStr);
    if (indexInClean !== -1) {
      // Find where numeric portion ends in original string
      const remainder = cleanStr.replace(/^[0-9,.]+/, '').trim();
      suffix = remainder ? (cleanStr.includes('%') && !remainder.startsWith(' ') ? remainder : ` ${remainder}`) : '';
      if (cleanStr.includes('%') && !suffix.includes('%')) {
        suffix = '%' + suffix;
      }
    }
  }

  return { num, prefix, suffix, isGrade: false, display: str, decimals };
};

/**
 * Smooth Animated Counter for Numbers with prefix, commas, and suffix
 */
export const AnimatedCounter = ({ value, duration = 1200 }) => {
  const parsed = parseMetricValue(value);
  const [displayVal, setDisplayVal] = useState(0);
  const startTimeRef = useRef(null);
  const prevTargetRef = useRef(0);

  useEffect(() => {
    if (parsed.isGrade) {
      return;
    }
    const target = parsed.num;
    const startVal = prevTargetRef.current;
    let animFrame;

    const animate = (timestamp) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const progress = Math.min(elapsed / duration, 1);
      // Cubic ease-out curve
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const current = startVal + (target - startVal) * easeOut;

      setDisplayVal(current);

      if (progress < 1) {
        animFrame = requestAnimationFrame(animate);
      } else {
        setDisplayVal(target);
        prevTargetRef.current = target;
      }
    };

    startTimeRef.current = null;
    animFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animFrame);
  }, [parsed.num, parsed.isGrade, duration]);

  if (parsed.isGrade) {
    return <span>{parsed.display}</span>;
  }

  const formattedNum = parsed.decimals > 0
    ? displayVal.toLocaleString('en-IN', { minimumFractionDigits: parsed.decimals, maximumFractionDigits: parsed.decimals })
    : Math.round(displayVal).toLocaleString('en-IN');

  return (
    <span>
      {parsed.prefix}{formattedNum}{parsed.suffix}
    </span>
  );
};

/* ──────────────────────────────────────────────────────────────────────────
   1. VALUE FLUID WAVE (Scales wave height, amplitude, and fluid area with value)
   ────────────────────────────────────────────────────────────────────────── */
export const ValueFluidWave = ({ value, color = '#38bdf8', height = 55 }) => {
  const uid = useId().replace(/:/g, '');
  const parsed = parseMetricValue(value);
  // Normalize value for wave height: 0 to 1
  let norm = 0.5;
  if (parsed.prefix === '₹' || parsed.num > 1000) {
    norm = Math.min(1, Math.max(0.2, Math.log10(Math.max(1, parsed.num)) / 6));
  } else if (parsed.suffix.includes('%') || parsed.num <= 100) {
    norm = Math.min(1, Math.max(0.2, parsed.num / 100));
  } else {
    norm = Math.min(1, Math.max(0.25, parsed.num / 500));
  }

  // Baseline Y: higher normalized value = higher wave (smaller Y in SVG)
  const baseY = 52 - norm * 26; // between 26 and 48
  const crest1 = Math.max(8, baseY - 16 - norm * 6);
  const trough1 = Math.min(54, baseY + 8);
  const crest2 = Math.max(10, baseY - 12 - norm * 8);

  const mainPath = `M0,${baseY + 4} Q45,${crest1} 95,${baseY} T190,${crest2} T270,${trough1} T300,${crest1} L300,60 L0,60 Z`;
  const strokePath = `M0,${baseY + 4} Q45,${crest1} 95,${baseY} T190,${crest2} T270,${trough1} T300,${crest1}`;
  const ribbonPath = `M0,${baseY + 8} Q50,${crest1 + 6} 100,${baseY + 4} T195,${crest2 + 6} T275,${trough1 - 4} T300,${crest1 + 8}`;

  return (
    <div className="glass-chart-wrapper" style={{ width: '100%', height, overflow: 'hidden', position: 'relative' }}>
      <svg viewBox="0 0 300 60" preserveAspectRatio="none" style={{ width: '100%', height: '100%', display: 'block' }}>
        <defs>
          <linearGradient id={`fluidGrad_${uid}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={color} stopOpacity="0.85" />
            <stop offset="50%" stopColor={color} stopOpacity="1" />
            <stop offset="100%" stopColor="#818cf8" stopOpacity="0.9" />
          </linearGradient>
          <linearGradient id={`areaGrad_${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity={0.45 * norm + 0.15} />
            <stop offset="60%" stopColor={color} stopOpacity={0.15 * norm + 0.05} />
            <stop offset="100%" stopColor={color} stopOpacity="0.0" />
          </linearGradient>
          <filter id={`glow_${uid}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Shaded Area that rises/falls with value */}
        <path d={mainPath} fill={`url(#areaGrad_${uid})`} className="chart-area-anim" />

        {/* Animated Main Wave */}
        <path
          d={strokePath}
          fill="none"
          stroke={`url(#fluidGrad_${uid})`}
          strokeWidth="2.8"
          strokeLinecap="round"
          filter={`url(#glow_${uid})`}
          className="chart-line-anim"
        />

        {/* Harmonic Ribbon Wave */}
        <path
          d={ribbonPath}
          fill="none"
          stroke="#ffffff"
          strokeOpacity="0.45"
          strokeWidth="1.5"
          strokeDasharray="4 3"
          className="chart-dash-anim"
        />

        {/* Floating Value Energy Particles */}
        <circle cx={70} cy={crest1 + 4} r={norm > 0.6 ? 2.5 : 1.8} fill={color} opacity="0.8" className="matrix-dot" />
        <circle cx={190} cy={crest2 + 3} r={norm > 0.4 ? 2.8 : 2} fill="#ffffff" opacity="0.9" className="matrix-dot" />
        <circle cx={260} cy={trough1 - 4} r="2" fill={color} opacity="0.75" className="matrix-dot" />
      </svg>
    </div>
  );
};

/* ──────────────────────────────────────────────────────────────────────────
   2. VALUE EQUALIZER MATRIX (Columns & Nodes scale dynamically with value)
   ────────────────────────────────────────────────────────────────────────── */
export const ValueEqualizerMatrix = ({ value, color = '#6366f1', height = 55, columns = 15 }) => {
  const uid = useId().replace(/:/g, '');
  const parsed = parseMetricValue(value);
  const seed = parsed.num || 42;
  const norm = Math.min(1, Math.max(0.2, (seed % 100) / 100));

  // Generate dynamic frequency bars with heights tied to the card's value
  const bars = [];
  for (let c = 0; c < columns; c++) {
    // Trigonometric variation combined with the value seed
    const harmonic = Math.sin(c * 0.55 + seed * 0.1) * 0.35 + Math.cos(c * 0.3) * 0.25;
    const barHeight = Math.max(10, Math.min(46, (harmonic + 0.65) * 24 * (0.6 + norm * 0.6)));
    const delay = (c * 0.07).toFixed(2);
    const opacity = 0.4 + 0.6 * (barHeight / 46);
    bars.push({ c, barHeight, delay, opacity });
  }

  return (
    <div className="glass-chart-wrapper" style={{ width: '100%', height, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}>
      <svg viewBox="0 0 300 55" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
        <defs>
          <linearGradient id={`barGrad_${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="30%" stopColor={color} stopOpacity="1" />
            <stop offset="100%" stopColor={color} stopOpacity="0.3" />
          </linearGradient>
          <radialGradient id={`nodeDot_${uid}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="70%" stopColor={color} />
          </radialGradient>
        </defs>

        {bars.map((b) => {
          const x = 12 + b.c * 19;
          const y = 52 - b.barHeight;
          return (
            <g key={b.c} className="equalizer-column" style={{ animationDelay: `${b.delay}s` }}>
              {/* Vertical Frequency Bar */}
              <rect
                x={x}
                y={y}
                width="6.5"
                height={b.barHeight}
                rx="3.25"
                fill={`url(#barGrad_${uid})`}
                opacity={b.opacity}
                className="chart-area-anim"
              />
              {/* Glowing Apex Node */}
              <circle
                cx={x + 3.25}
                cy={y + 1}
                r="3"
                fill={`url(#nodeDot_${uid})`}
                className="matrix-dot"
                style={{
                  animationDelay: `${b.delay}s`,
                  filter: `drop-shadow(0 0 4px ${color})`,
                }}
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
};

/* ──────────────────────────────────────────────────────────────────────────
   3. VALUE SPARKLINE BEACON (Trajectory & Beacon pulse vary with value)
   ────────────────────────────────────────────────────────────────────────── */
export const ValueSparklineBeacon = ({ value, color = '#f59e0b', height = 55 }) => {
  const uid = useId().replace(/:/g, '');
  const parsed = parseMetricValue(value);
  const norm = Math.min(1, Math.max(0.15, (parsed.num % 50) / 50));

  // Compute 7 points with dynamic heights based on value
  const basePoints = [
    { x: 12, y: 44 },
    { x: 55, y: 38 - norm * 6 },
    { x: 100, y: 42 - norm * 10 },
    { x: 145, y: 32 - norm * 12 },
    { x: 195, y: 36 - norm * 14 },
    { x: 245, y: 24 - norm * 16 },
    { x: 288, y: Math.max(8, 20 - norm * 14) } // Apex beacon
  ];

  const pathD = basePoints.map((p, idx) => (idx === 0 ? `M${p.x},${p.y}` : `L${p.x},${p.y}`)).join(' ');
  const areaD = `${pathD} L288,58 L12,58 Z`;
  const apex = basePoints[basePoints.length - 1];

  return (
    <div className="glass-chart-wrapper" style={{ width: '100%', height, overflow: 'hidden' }}>
      <svg viewBox="0 0 300 60" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
        <defs>
          <linearGradient id={`sparkGrad_${uid}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="50%" stopColor={color} />
            <stop offset="100%" stopColor="#ffffff" />
          </linearGradient>
          <linearGradient id={`sparkArea_${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.32" />
            <stop offset="100%" stopColor={color} stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Shaded Area Under Sparkline */}
        <path d={areaD} fill={`url(#sparkArea_${uid})`} className="chart-area-anim" />

        {/* Connecting Gradient Line */}
        <path
          d={pathD}
          fill="none"
          stroke={`url(#sparkGrad_${uid})`}
          strokeWidth="2.6"
          strokeDasharray="5 2.5"
          className="chart-line-anim"
        />

        {/* Data Nodes */}
        {basePoints.slice(0, -1).map((p, i) => (
          <circle key={i} cx={p.x} cy={p.y} r="3" fill="#ffffff" stroke={color} strokeWidth="1.5" className="spark-node" />
        ))}

        {/* Live Apex Beacon with Radar Ping Rings */}
        <circle cx={apex.x} cy={apex.y} r="8" fill="none" stroke={color} strokeWidth="1.5" opacity="0.6" className="beacon-ping" />
        <circle cx={apex.x} cy={apex.y} r="5" fill="#ffffff" stroke={color} strokeWidth="2.5" style={{ filter: `drop-shadow(0 0 6px ${color})` }} />
        <circle cx={apex.x} cy={apex.y} r="2.5" fill={color} />
      </svg>
    </div>
  );
};

/* ──────────────────────────────────────────────────────────────────────────
   4. VALUE ATTENDANCE / RADIAL FLUID GAUGE (Level fills precisely to %)
   ────────────────────────────────────────────────────────────────────────── */
export const ValueAttendanceGauge = ({ value, color = '#10b981', height = 55 }) => {
  const uid = useId().replace(/:/g, '');
  const parsed = parseMetricValue(value);
  // Attendance is usually between 70% and 100%
  const pct = Math.min(100, Math.max(10, parsed.num || 95));
  const fillWidth = Math.round((pct / 100) * 280);
  const waterLevelY = 50 - (pct / 100) * 36; // 14 to 46

  return (
    <div className="glass-chart-wrapper" style={{ width: '100%', height, overflow: 'hidden', position: 'relative' }}>
      <svg viewBox="0 0 300 60" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
        <defs>
          <linearGradient id={`gaugeGrad_${uid}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="60%" stopColor={color} />
            <stop offset="100%" stopColor="#34d399" />
          </linearGradient>
          <linearGradient id={`waterGrad_${uid}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.4" />
            <stop offset="100%" stopColor={color} stopOpacity="0.04" />
          </linearGradient>
        </defs>

        {/* Liquid Wave Filled According to Attendance % */}
        <path
          d={`M0,${waterLevelY} Q75,${waterLevelY - 6} 150,${waterLevelY} T300,${waterLevelY - 4} L300,60 L0,60 Z`}
          fill={`url(#waterGrad_${uid})`}
          className="chart-area-anim"
        />

        {/* Liquid Surface Waterline */}
        <path
          d={`M0,${waterLevelY} Q75,${waterLevelY - 6} 150,${waterLevelY} T300,${waterLevelY - 4}`}
          fill="none"
          stroke={`url(#gaugeGrad_${uid})`}
          strokeWidth="2.8"
          strokeLinecap="round"
          className="chart-line-anim"
          style={{ filter: `drop-shadow(0 0 5px ${color})` }}
        />

        {/* Base Track */}
        <rect x="10" y="52" width="280" height="4" rx="2" fill="rgba(255,255,255,0.12)" />

        {/* Filled Progress Track */}
        <rect
          x="10"
          y="52"
          width={fillWidth}
          height="4"
          rx="2"
          fill={`url(#gaugeGrad_${uid})`}
          style={{ transition: 'width 1.2s cubic-bezier(0.16, 1, 0.3, 1)', filter: `drop-shadow(0 0 6px ${color})` }}
        />

        {/* Orbiting Spark At Current Attendance Position */}
        <circle cx={10 + fillWidth} cy="54" r="4.5" fill="#ffffff" stroke={color} strokeWidth="2" style={{ filter: `drop-shadow(0 0 8px ${color})` }} />
        <circle cx={10 + fillWidth} cy="54" r="2" fill={color} />
      </svg>
    </div>
  );
};

/* ──────────────────────────────────────────────────────────────────────────
   5. VALUE PULSE RADAR (Concentric pulses and telemetry for Notices / Circulars)
   ────────────────────────────────────────────────────────────────────────── */
export const ValuePulseRadar = ({ value, color = '#ec4899', height = 55 }) => {
  const uid = useId().replace(/:/g, '');
  const parsed = parseMetricValue(value);
  const count = Math.max(1, Math.min(12, parsed.num || 5));

  // Dynamic telemetry nodes representing active notices/broadcasts
  const nodes = [];
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 1.6 + 0.2;
    const dist = 35 + (i % 3) * 22;
    const cx = 150 + Math.cos(angle) * dist * 1.5;
    const cy = 30 + Math.sin(angle) * (dist * 0.4);
    nodes.push({ cx, cy, delay: (i * 0.15).toFixed(2) });
  }

  return (
    <div className="glass-chart-wrapper" style={{ width: '100%', height, overflow: 'hidden' }}>
      <svg viewBox="0 0 300 60" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
        <defs>
          <linearGradient id={`radarGrad_${uid}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="50%" stopColor={color} />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
        </defs>

        {/* Concentric Radar Ring Waves */}
        <ellipse cx="150" cy="30" rx="40" ry="14" fill="none" stroke={color} strokeWidth="1.2" opacity="0.75" className="beacon-ping" />
        <ellipse cx="150" cy="30" rx="85" ry="22" fill="none" stroke={color} strokeWidth="1" opacity="0.5" className="beacon-ping" style={{ animationDelay: '0.6s' }} />
        <ellipse cx="150" cy="30" rx="130" ry="26" fill="none" stroke={color} strokeWidth="0.8" opacity="0.3" className="beacon-ping" style={{ animationDelay: '1.2s' }} />

        {/* Connecting Horizon Ray */}
        <line x1="20" y1="30" x2="280" y2="30" stroke={`url(#radarGrad_${uid})`} strokeWidth="1" strokeDasharray="3 3" opacity="0.6" />

        {/* Broadcast Nodes */}
        {nodes.map((n, i) => (
          <g key={i}>
            <circle cx={n.cx} cy={n.cy} r="3" fill="#ffffff" stroke={color} strokeWidth="1.5" className="matrix-dot" style={{ animationDelay: `${n.delay}s` }} />
            <circle cx={n.cx} cy={n.cy} r="1.2" fill={color} />
          </g>
        ))}

        {/* Center Glowing Emitter */}
        <circle cx="150" cy="30" r="5" fill="#ffffff" stroke={color} strokeWidth="2.5" style={{ filter: `drop-shadow(0 0 8px ${color})` }} />
        <circle cx="150" cy="30" r="2" fill={color} />
      </svg>
    </div>
  );
};

/* ──────────────────────────────────────────────────────────────────────────
   MAIN UNIFIED STAT CARD COMPONENT
   ────────────────────────────────────────────────────────────────────────── */
const StatCard = ({
  title,
  value,
  change,
  positive = true,
  badge,
  icon: Icon,
  chartType = 'none',
  showChart = false,
  color,
  accent = 'sky',
  delay = 0,
  onClick,
  className = '',
  style = {}
}) => {
  // Theme color presets
  const themes = {
    sky: { color: '#38bdf8', glow: 'rgba(56, 189, 248, 0.35)', badgeBg: 'rgba(56, 189, 248, 0.15)' },
    indigo: { color: '#6366f1', glow: 'rgba(99, 102, 241, 0.35)', badgeBg: 'rgba(99, 102, 241, 0.15)' },
    emerald: { color: '#10b981', glow: 'rgba(16, 185, 129, 0.35)', badgeBg: 'rgba(16, 185, 129, 0.15)' },
    amber: { color: '#f59e0b', glow: 'rgba(245, 158, 11, 0.35)', badgeBg: 'rgba(245, 158, 11, 0.15)' },
    rose: { color: '#ec4899', glow: 'rgba(236, 72, 153, 0.35)', badgeBg: 'rgba(236, 72, 153, 0.15)' },
    teal: { color: '#06b6d4', glow: 'rgba(6, 182, 212, 0.35)', badgeBg: 'rgba(6, 182, 212, 0.15)' },
  };

  const currentTheme = themes[accent] || themes.sky;
  const activeColor = color || currentTheme.color;

  // Automatically determine chart type if needed
  let resolvedChart = chartType;
  if (resolvedChart === 'auto') {
    const tLower = (title || '').toLowerCase();
    const vStr = String(value || '').toLowerCase();

    if (tLower.includes('attendance') || vStr.includes('%')) {
      resolvedChart = 'attendance-gauge';
    } else if (tLower.includes('revenue') || tLower.includes('fee') || vStr.includes('₹') || vStr.includes('$')) {
      resolvedChart = 'fluid-wave';
    } else if (tLower.includes('students') || tLower.includes('staff') || tLower.includes('periods') || tLower.includes('curriculum')) {
      resolvedChart = 'equalizer-matrix';
    } else if (tLower.includes('notice') || tLower.includes('circular') || tLower.includes('assignment')) {
      resolvedChart = 'pulse-radar';
    } else {
      resolvedChart = 'sparkline-beacon';
    }
  }

  // Render the value-reactive inside chart
  const renderInsideChart = () => {
    switch (resolvedChart) {
      case 'fluid-wave':
        return <ValueFluidWave value={value} color={activeColor} />;
      case 'equalizer-matrix':
        return <ValueEqualizerMatrix value={value} color={activeColor} />;
      case 'sparkline-beacon':
        return <ValueSparklineBeacon value={value} color={activeColor} />;
      case 'attendance-gauge':
        return <ValueAttendanceGauge value={value} color={activeColor} />;
      case 'pulse-radar':
        return <ValuePulseRadar value={value} color={activeColor} />;
      default:
        return null;
    }
  };

  return (
    <div
      className={`stat-card glass-card hover-lift dynamic-stat-card ${className}`}
      onClick={onClick}
      style={{
        animationDelay: `${delay}s`,
        cursor: onClick ? 'pointer' : 'default',
        '--card-accent-color': activeColor,
        '--card-accent-glow': currentTheme.glow,
        ...style
      }}
    >
      {/* Top Header Row */}
      <div className="stat-card-top" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {Icon && (
            <div
              className="stat-icon-wrapper"
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: currentTheme.badgeBg,
                color: activeColor,
              }}
            >
              <Icon size={18} />
            </div>
          )}
          <h3 className="stat-title" style={{ margin: 0 }}>{title}</h3>
        </div>

        {badge && (
          <span className="live-pulse-badge" style={{ borderColor: activeColor, color: activeColor, background: currentTheme.badgeBg }}>
            <span className="live-dot" style={{ backgroundColor: activeColor, boxShadow: `0 0 8px ${activeColor}` }} />
            {badge}
          </span>
        )}
      </div>

      {/* Metric Value */}
      <div
        className="stat-value dynamic-stat-value"
        style={{
          textShadow: `0 0 16px ${currentTheme.glow}`,
          transition: 'all 0.3s ease',
          margin: '6px 0',
        }}
      >
        <AnimatedCounter value={value} />
      </div>

      {/* Change / Subtitle Row */}
      {change && (
        <div
          className={`stat-change ${positive ? 'positive' : 'negative'}`}
          style={{ marginBottom: showChart ? '12px' : '4px', display: 'flex', alignItems: 'center', gap: '4px' }}
        >
          {positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          <span>{change}</span>
        </div>
      )}

      {/* Embedded Micro-Graph (only rendered if showChart is explicitly true) */}
      {showChart && (
        <div className="stat-chart-container dynamic-chart-container">
          {renderInsideChart()}
        </div>
      )}
    </div>
  );
};

export default StatCard;
