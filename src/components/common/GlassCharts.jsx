import React from 'react';
import StatCard, {
  ValueFluidWave,
  ValueEqualizerMatrix,
  ValueSparklineBeacon,
  ValueAttendanceGauge,
  ValuePulseRadar,
  AnimatedCounter,
  parseMetricValue
} from './StatCard';

export {
  StatCard,
  ValueFluidWave,
  ValueEqualizerMatrix,
  ValueSparklineBeacon,
  ValueAttendanceGauge,
  ValuePulseRadar,
  AnimatedCounter,
  parseMetricValue
};

// 1. Particle / Glowing Flow Wave Chart (dynamically varies with value when provided)
export const ParticleWaveChart = ({ value, color = '#38bdf8', height = 55 }) => {
  if (value !== undefined) {
    return <ValueFluidWave value={value} color={color} height={height} />;
  }
  return (
    <div className="glass-chart-wrapper" style={{ width: '100%', height, overflow: 'hidden', position: 'relative' }}>
      <svg viewBox="0 0 300 60" preserveAspectRatio="none" style={{ width: '100%', height: '100%', display: 'block' }}>
        <defs>
          <linearGradient id="waveGrad1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#6366f1" stopOpacity="0.9" />
            <stop offset="50%" stopColor={color} stopOpacity="0.95" />
            <stop offset="100%" stopColor="#2dd4bf" stopOpacity="0.9" />
          </linearGradient>
          <linearGradient id="waveGradSubtle" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#818cf8" stopOpacity="0.7" />
            <stop offset="50%" stopColor="#c084fc" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#f472b6" stopOpacity="0.7" />
          </linearGradient>
          <linearGradient id="areaGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.35" />
            <stop offset="50%" stopColor="#6366f1" stopOpacity="0.15" />
            <stop offset="100%" stopColor={color} stopOpacity="0.0" />
          </linearGradient>
          <filter id="glow1" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Shaded Area with Gradient */}
        <path
          d="M0,45 Q40,15 90,38 T180,25 T260,35 T300,18 L300,60 L0,60 Z"
          fill="url(#areaGrad1)"
          className="chart-area-anim"
        />

        {/* Animated Main Flow Wave Line with Multi-Color Gradient */}
        <path
          d="M0,45 Q40,15 90,38 T180,25 T260,35 T300,18"
          fill="none"
          stroke="url(#waveGrad1)"
          strokeWidth="2.8"
          strokeLinecap="round"
          filter="url(#glow1)"
          className="chart-line-anim"
        />

        {/* Secondary subtle ribbon wave with Gradient */}
        <path
          d="M0,50 Q45,28 95,42 T185,32 T265,40 T300,28"
          fill="none"
          stroke="url(#waveGradSubtle)"
          strokeWidth="1.8"
          strokeDasharray="4 3"
          className="chart-dash-anim"
        />
      </svg>
    </div>
  );
};

// 2. Dot Matrix Wave Chart with Gradient Nodes (dynamically varies with value when provided)
export const DotMatrixWaveChart = ({ value, color = '#6366f1', columns = 14, rows = 5, height = 55 }) => {
  if (value !== undefined) {
    return <ValueEqualizerMatrix value={value} color={color} columns={columns} height={height} />;
  }
  const dots = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) {
      const phase = (c / columns) * Math.PI * 2 + (r / rows) * Math.PI;
      const opacity = 0.35 + 0.65 * (0.5 + 0.5 * Math.sin(phase));
      const delay = (c * 0.08 + r * 0.05).toFixed(2);
      dots.push({ r, c, opacity, delay });
    }
  }

  return (
    <div className="glass-chart-wrapper" style={{ width: '100%', height, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <svg viewBox="0 0 280 50" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
        <defs>
          <linearGradient id="dotMatrixGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#818cf8" />
            <stop offset="50%" stopColor={color} />
            <stop offset="100%" stopColor="#38bdf8" />
          </linearGradient>
          <radialGradient id="matrixDotRadial" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#a5b4fc" />
            <stop offset="60%" stopColor={color} />
            <stop offset="100%" stopColor="#4338ca" />
          </radialGradient>
        </defs>
        {dots.map((d, i) => {
          const cx = 15 + d.c * 19;
          const cy = 6 + d.r * 9.5;
          return (
            <circle
              key={i}
              cx={cx}
              cy={cy}
              r={d.opacity > 0.65 ? 2.5 : 1.8}
              fill="url(#matrixDotRadial)"
              className="matrix-dot"
              style={{
                opacity: d.opacity,
                animationDelay: `${d.delay}s`,
                filter: d.opacity > 0.7 ? `drop-shadow(0 0 3px ${color})` : 'none',
              }}
            />
          );
        })}
      </svg>
    </div>
  );
};

// 3. Glowing Smooth Area Wave (dynamically varies with value when provided)
export const AreaWaveChart = ({ value, color = '#10b981', height = 55 }) => {
  if (value !== undefined) {
    return <ValueAttendanceGauge value={value} color={color} height={height} />;
  }
  return (
    <div className="glass-chart-wrapper" style={{ width: '100%', height, overflow: 'hidden' }}>
      <svg viewBox="0 0 300 60" preserveAspectRatio="none" style={{ width: '100%', height: '100%', display: 'block' }}>
        <defs>
          <linearGradient id="areaGradGreen" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.45" />
            <stop offset="50%" stopColor="#06b6d4" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
          </linearGradient>
          <linearGradient id="areaStrokeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={color} />
            <stop offset="50%" stopColor="#14b8a6" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
          <filter id="areaGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <path
          d="M0,52 Q50,48 100,32 T200,38 T260,18 T300,12 L300,60 L0,60 Z"
          fill="url(#areaGradGreen)"
          className="chart-area-anim"
        />
        <path
          d="M0,52 Q50,48 100,32 T200,38 T260,18 T300,12"
          fill="none"
          stroke="url(#areaStrokeGrad)"
          strokeWidth="2.8"
          strokeLinecap="round"
          filter="url(#areaGlow)"
          className="chart-line-anim"
        />
      </svg>
    </div>
  );
};

// 4. Sparkline Dot-Connected Chart (dynamically varies with value when provided)
export const SparklineChart = ({ value, color = '#f59e0b', height = 55 }) => {
  if (value !== undefined) {
    return <ValueSparklineBeacon value={value} color={color} height={height} />;
  }
  const points = [
    { x: 10, y: 35 },
    { x: 55, y: 42 },
    { x: 100, y: 28 },
    { x: 145, y: 48 },
    { x: 190, y: 38 },
    { x: 235, y: 22 },
    { x: 285, y: 16 }
  ];
  const pathD = points.map((p, idx) => (idx === 0 ? `M${p.x},${p.y}` : `L${p.x},${p.y}`)).join(' ');

  return (
    <div className="glass-chart-wrapper" style={{ width: '100%', height, overflow: 'hidden' }}>
      <svg viewBox="0 0 300 60" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
        <defs>
          <linearGradient id="sparklineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="50%" stopColor={color} />
            <stop offset="100%" stopColor="#c084fc" />
          </linearGradient>
          <radialGradient id="sparkDotGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor={color} />
          </radialGradient>
        </defs>
        <path
          d={pathD}
          fill="none"
          stroke="url(#sparklineGrad)"
          strokeWidth="2.5"
          strokeDasharray="4 2"
          opacity="0.9"
          className="chart-line-anim"
        />
        {points.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r="4.5" fill="#ffffff" stroke="url(#sparklineGrad)" strokeWidth="2" className="spark-node" />
            <circle cx={p.x} cy={p.y} r="2" fill="url(#sparkDotGrad)" />
          </g>
        ))}
      </svg>
    </div>
  );
};

// 5. Animated Donut Ring Chart with Gradient Segments (as in "Revenue by Product")
export const DonutRingChart = ({
  centerValue = '₹248,420',
  centerLabel = 'Total Revenue',
  currency = '₹',
  segments = [
    { label: 'Pro Plan / Senior High', value: 98420, percent: '39.6%', gradId: 'gradDonutPro', cssGrad: 'linear-gradient(135deg, #6366f1, #8b5cf6)' },
    { label: 'Business / Middle School', value: 72430, percent: '29.2%', gradId: 'gradDonutBusiness', cssGrad: 'linear-gradient(135deg, #06b6d4, #38bdf8)' },
    { label: 'Enterprise / Primary', value: 55210, percent: '22.2%', gradId: 'gradDonutEnterprise', cssGrad: 'linear-gradient(135deg, #10b981, #34d399)' },
    { label: 'Add-ons / Activities', value: 22360, percent: '9.0%', gradId: 'gradDonutAddons', cssGrad: 'linear-gradient(135deg, #f59e0b, #fb923c)' },
  ],
  size = 180
}) => {
  const radius = 68;
  const circumference = 2 * Math.PI * radius;
  let cumulativePercent = 0;

  return (
    <div className="donut-chart-container" style={{ display: 'flex', alignItems: 'center', gap: '2rem', flexWrap: 'wrap' }}>
      <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
        <svg viewBox="0 0 160 160" width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <defs>
            <linearGradient id="gradDonutPro" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#a855f7" />
            </linearGradient>
            <linearGradient id="gradDonutBusiness" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#38bdf8" />
            </linearGradient>
            <linearGradient id="gradDonutEnterprise" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#34d399" />
            </linearGradient>
            <linearGradient id="gradDonutAddons" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#fb923c" />
            </linearGradient>
          </defs>

          {/* Base track circle */}
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke="rgba(150, 160, 180, 0.12)"
            strokeWidth="16"
          />
          {segments.map((seg, idx) => {
            const pct = parseFloat(seg.percent) / 100;
            const strokeDasharray = `${pct * circumference} ${circumference}`;
            const strokeDashoffset = -cumulativePercent * circumference;
            cumulativePercent += pct;
            return (
              <circle
                key={idx}
                cx="80"
                cy="80"
                r={radius}
                fill="none"
                stroke={`url(#${seg.gradId})`}
                strokeWidth="16"
                strokeDasharray={strokeDasharray}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="donut-ring-segment"
                style={{
                  transition: 'stroke-dasharray 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
                  filter: 'drop-shadow(0 2px 5px rgba(0,0,0,0.18))'
                }}
              />
            );
          })}
        </svg>
        {/* Inner center text */}
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          pointerEvents: 'none'
        }}>
          <span className="donut-center-value" style={{ fontWeight: 700, fontSize: '1.25rem', letterSpacing: '-0.5px' }}>
            {centerValue}
          </span>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {centerLabel}
          </span>
        </div>
      </div>

      {/* Legend list with Gradient indicator swatches */}
      <div className="donut-legend-list" style={{ display: 'flex', flexDirection: 'column', gap: '10px', flex: 1, minWidth: '180px' }}>
        {segments.map((seg, idx) => (
          <div key={idx} className="donut-legend-item" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: seg.cssGrad,
                flexShrink: 0,
                boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
              }} />
              <span style={{ fontSize: '0.85rem', fontWeight: 500, color: 'var(--text-secondary)' }}>{seg.label}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <strong style={{ fontSize: '0.85rem' }}>{currency}{seg.value.toLocaleString()}</strong>
              <span className="badge neutral" style={{ fontSize: '0.72rem', minWidth: '44px', textAlign: 'center' }}>{seg.percent}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 6. User Acquisition / Student Flow Ribbon Funnel with Vibrant Multi-Stop Gradient (as in "User Acquisition")
export const FlowFunnelChart = ({
  steps = [
    { label: '1. Inquiries', count: '45,639', pct: '100%' },
    { label: '2. Applications', count: '9,482', pct: '20.7%' },
    { label: '3. Admitted', count: '4,126', pct: '43.5%' },
    { label: '4. Enrolled', count: '1,842', pct: '44.6%' }
  ],
  overallRate = '4.0% Overall Enrollment Rate'
}) => {
  return (
    <div className="flow-funnel-card" style={{ width: '100%' }}>
      {/* Funnel header steps */}
      <div className="funnel-steps-header" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '14px' }}>
        {steps.map((st, idx) => (
          <div key={idx} className="funnel-step-box">
            <span style={{ fontSize: '0.75rem', color: 'var(--text-tertiary)', display: 'block' }}>{st.label}</span>
            <span style={{ fontSize: '1.2rem', fontWeight: 700, display: 'block', margin: '2px 0' }}>{st.count}</span>
            <span className="badge positive" style={{ fontSize: '0.72rem' }}>{st.pct}</span>
          </div>
        ))}
      </div>

      {/* Ribbon Funnel Stream SVG with Multi-Stop Gradient */}
      <div style={{ width: '100%', height: '80px', position: 'relative', overflow: 'hidden' }}>
        <svg viewBox="0 0 500 80" preserveAspectRatio="none" style={{ width: '100%', height: '100%' }}>
          <defs>
            <linearGradient id="funnelGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.9" />
              <stop offset="30%" stopColor="#6366f1" stopOpacity="0.85" />
              <stop offset="65%" stopColor="#06b6d4" stopOpacity="0.85" />
              <stop offset="100%" stopColor="#10b981" stopOpacity="0.95" />
            </linearGradient>
            <linearGradient id="funnelShimmer" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
            </linearGradient>
          </defs>
          {/* Main Funnel stream */}
          <path
            d="M0,8 C120,8 180,26 280,33 C380,39 420,40 500,41 L500,47 C420,48 380,49 280,55 C180,62 120,80 0,80 Z"
            fill="url(#funnelGrad)"
            className="funnel-stream-anim"
            filter="drop-shadow(0 4px 12px rgba(99, 102, 241, 0.35))"
          />
          {/* Top highlight shimmer */}
          <path
            d="M0,8 C120,8 180,26 280,33 C380,39 420,40 500,41 L500,43 C420,42 380,41 280,35 C180,28 120,10 0,10 Z"
            fill="url(#funnelShimmer)"
            opacity="0.6"
          />
        </svg>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
        <span className="badge success" style={{ fontSize: '0.75rem', padding: '4px 10px', borderRadius: '10px' }}>
          {overallRate}
        </span>
      </div>
    </div>
  );
};

// 7. Top Channels / Academic Performance Horizontal Bar Chart with Rich Gradients
export const ProgressChannelList = ({
  channels = [
    { name: 'Direct Referrals / Alumni', count: '12,500', pct: 92, gradient: 'linear-gradient(90deg, #6366f1 0%, #a855f7 100%)' },
    { name: 'Academic Inquiries', count: '8,430', pct: 68, gradient: 'linear-gradient(90deg, #06b6d4 0%, #3b82f6 100%)' },
    { name: 'Campus Open House', count: '6,120', pct: 49, gradient: 'linear-gradient(90deg, #10b981 0%, #34d399 100%)' },
    { name: 'Online Portal', count: '4,320', pct: 35, gradient: 'linear-gradient(90deg, #f59e0b 0%, #f97316 100%)' },
    { name: 'Community Outreach', count: '3,210', pct: 24, gradient: 'linear-gradient(90deg, #ec4899 0%, #a855f7 100%)' },
  ]
}) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', width: '100%' }}>
      {channels.map((ch, idx) => (
        <div key={idx} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 500, width: '180px', color: 'var(--text-secondary)' }}>{ch.name}</span>
          <div style={{ flex: 1, height: '8px', background: 'rgba(150, 160, 180, 0.16)', borderRadius: '10px', overflow: 'hidden', position: 'relative' }}>
            <div
              className="progress-bar-fill-anim"
              style={{
                height: '100%',
                width: `${ch.pct}%`,
                background: ch.gradient,
                borderRadius: '10px',
                transition: 'width 1s cubic-bezier(0.16, 1, 0.3, 1)',
                boxShadow: '0 0 10px rgba(99, 102, 241, 0.4)'
              }}
            />
          </div>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, minWidth: '55px', textAlign: 'right' }}>{ch.count}</span>
        </div>
      ))}
    </div>
  );
};
